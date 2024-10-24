import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from "../../Shared/Exceptions";
import { CartServices } from "../Cart/cart.services";
import { ICartItem } from "../Cart/cartTypes";
import { ProductServices } from "../Product/product.services";
import OrderRepository from "./order.repository";
import { PlaceOrderDTO } from "./orderTypes";

export class OrderServices {
  public static async placeOrder(data: PlaceOrderDTO): Promise<any> {
    // not placed order it will returns cart
    const cartItems = (await this.hasAlreadyPlacedTheOrder(
      data.cartId
    )) as ICartItem[];

    const { items, totalPrice } = this.calculatePrices(cartItems);

    const order = await this.createOne({
      ...data,
      orderItems: items,
      totalPrice,
    });

    await CartServices.clearCart(data.accountTypeId);

    return order;
  }

  public static async confirmOrder(orderId: string) {
    const order = await OrderRepository.findOne({ _id: orderId });

    order && (await this.updateOne(orderId, { payment: { status: "Paid" } }));

    // Decrement each product stock
    order.orderItems.forEach(async (product) => {
      await ProductServices.decrementProductStock(
        product.productId,
        product.quantity
      );
    });

    return order;
  }

  public static async getOrder(query: { customerId?: string; _id: string }) {
    const order = await OrderRepository.findOne(query);

    if (!order) throw new NotFoundException("ORDER NOT FOUND");

    return order;
  }

  public static async getAllUserOrders(customerId, query) {
    const {
      pageNumber,
      pageSize,
      sort,
    } = query;

    const skip = (pageNumber - 1) * pageSize;

    const order = await OrderRepository.findMany(
      { customerId },
      {
        sort,
        skip,
        limit: pageSize,
      }
    );

    if (!order) throw new NotFoundException("NO ORDER FOUND!");

    return order;
  }

  private static async hasAlreadyPlacedTheOrder(
    cartId: string
  ): Promise<void | ICartItem[]> {
    const cart = (await CartServices.getCart({ _id: cartId })) as any;

    if (cart.length === 0) {
      throw new BadRequestException("ALREADY PLACED ORDER");
    }

    return cart;
  }

  private static async createOne(data: PlaceOrderDTO): Promise<boolean> {
    delete data.accountType;

    const { accountTypeId, ...payload } = data;

    const createdOrder = await OrderRepository.createOne({
      ...payload,
      customerId: accountTypeId,
    });

    if (!createdOrder) {
      throw new InternalServerException("ORDER CREATION FAILED");
    }

    return createdOrder;
  }

  private static async updateOne(orderId: string, payload: any) {
    const isOrderUpdated = await OrderRepository.updateOne(
      { _id: orderId },
      payload
    );

    if (!isOrderUpdated) throw new NotFoundException("ORDER NOT FOUND");

    return isOrderUpdated;
  }

  private static calculatePrices(cart: ICartItem[]) {
    let totalPrice = 0;

    const items = cart.map((item) => {
      const { _id, originalPrice, discountPrice } = item.product;

      // Use discountPrice if it exists, else originalPrice
      const price = discountPrice || originalPrice;

      const totalItemPrice = price * item.quantity;

      // Accumulate total price
      totalPrice += totalItemPrice;

      return {
        product: _id,
        quantity: item.quantity,
        price: totalItemPrice,
      };
    });

    return { items, totalPrice };
  }
}
