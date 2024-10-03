import {
  InternalServerException,
  NotFoundException,
} from "../../Shared/Exceptions";
import {
  CreateCartInput,
  AddToCartDTO,
  ICart,
  IncrementOrDecrementInput,
} from "./cartTypes";
import CartRepository from "./cart.repository";
import CustomerServices from "../Customer/customer.services";

export class CartServices {
  public static async createCart(data: CreateCartInput): Promise<ICart> {
    const createdCart = await CartRepository.createOne(data);

    if (!createdCart) {
      throw new InternalServerException("CART CREATION FAILED");
    }

    return createdCart as ICart;
  }

  public static async addProductToCart(data: AddToCartDTO): Promise<string> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(
      data.customerId
    );

    const foundCart = await CartRepository.findOne({
      _id: foundCustomer.cart._id,
    });

    for (const item of data.items) {
      const existingItem = foundCart.items.find(
        (cartItem) => cartItem.product == item.product
      );

      if (existingItem) {
        throw new NotFoundException("PRODUCT ALREADY IN CART");
      } else {
        foundCart.items.push({
          product: item.product,
          quantity: item.quantity,
        });
      }
    }

    await CartRepository.updateOne(
      { _id: foundCustomer.cart._id },
      { items: foundCart.items }
    );

    return "ADD TO CART SUCCESS";
  }

  public static async incrementOrDecrementProductQty(
    data: IncrementOrDecrementInput
  ): Promise<string> {
    const { customerId, productId, quantity } = data;

    const foundCustomer = await CustomerServices.getCustomerByCustomerId(
      customerId
    );

    const foundCart = await CartRepository.findOne({
      _id: foundCustomer.cart._id,
    });

    const existingItem = foundCart.items.find(
      (cartItem) => cartItem.product == productId
    );

    if (!existingItem) {
      throw new NotFoundException("PRODUCT NOT FOUND IN CART!");
    } else {
      existingItem.quantity += quantity;
    }

    await CartRepository.updateOne(
      { _id: foundCustomer.cart._id },
      { items: foundCart.items }
    );

    return "PRODUCT QUANTITY UPDATED";
  }

  public static async addOrUpdateSpecialRequest(data) {
    const { customerId, productId, specialRequest } = data;

    const foundCustomer = await CustomerServices.getCustomerByCustomerId(
      customerId
    );

    const foundCart = await CartRepository.findOne({
      _id: foundCustomer.cart._id,
    });

    const existingItem = foundCart.items.find(
      (cartItem) => cartItem.product == productId
    );

    if (!existingItem) {
      throw new NotFoundException("PRODUCT NOT FOUND IN CART!");
    } else {
      existingItem.specialRequest = specialRequest;
    }

    await CartRepository.updateOne(
      { _id: foundCustomer.cart._id },
      { items: foundCart.items }
    );

    return "OPERATION SUCCESS";
  }

  public static async removeProductFromCart(
    customerId: string,
    productId: string
  ): Promise<string> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(
      customerId
    );

    const cart = await CartRepository.findOne({ _id: foundCustomer.cart._id });

    const existingItem = cart.items.find(
      (cartItem) => cartItem.product == productId
    );

    if (!existingItem) {
      throw new NotFoundException("PRODUCT NOT IN CART");
    }

    cart.items = cart.items.filter(
      (cartItem) => cartItem.product.toString() !== productId
    );

    await CartRepository.updateOne(
      { _id: foundCustomer.cart._id },
      { items: cart.items }
    );

    return "REMOVE PRODUCT FROM CART";
  }

  public static async clearCart(customerId: string): Promise<ICart> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(
      customerId
    );

    const clearedCart = await CartRepository.updateOne(
      { _id: foundCustomer.cart._id },
      { items: [] }
    );

    if (clearedCart.matchedCount === 0)
      throw new NotFoundException("CART NOT FOUND");

    if (clearedCart.modifiedCount === 0)
      throw new InternalServerException("CLEAR CART FAILED");

    const clearCart = await CartRepository.findOne({
      _id: foundCustomer.cart._id,
    });

    return clearCart as ICart;
  }

  public static async getCart(filter: any): Promise<ICart> {
    const foundCart = await CartRepository.findOne(filter);

    if (!foundCart) {
      throw new NotFoundException("CART NOT FOUND");
    }

    const [populatedCart] = await CartRepository.populate(
      [foundCart],
      ["items.product"],
      ["Product"]
    );

    const items = populatedCart.items;
    const [populateCartWithImage] = await CartRepository.populate(
      [items],
      ["product.image"],
      ["Image"]
    );

    return populateCartWithImage as ICart;
  }

  public static async getCartByCustomerId(customerId: string) {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(
      customerId
    );

    return await this.getCart({ _id: foundCustomer.cart });
  }
}
