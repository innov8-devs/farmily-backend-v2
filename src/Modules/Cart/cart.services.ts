import { InternalServerException, NotFoundException } from '../../Shared/Exceptions';
import { AddToCartDTO, CreateCartInput, ICart } from './cartTypes';
import CartRepository from './cart.repository';
import CustomerServices from '../Customer/customer.services';

export class CartServices {
  public static async createCart(data: CreateCartInput): Promise<ICart> {
    const createdCart = await CartRepository.createOne(data);

    if (!createdCart) {
      throw new InternalServerException("CART_CREATION_FAILED");
    }

    return createdCart as ICart;
  }

  public static async addProductToCart(data: AddToCartDTO): Promise<string> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(data.customerId);

    const foundCart = await CartRepository.findOne({ _id: foundCustomer.cart._id });

    for (const item of data.items) {
      const existingItem = foundCart.items.find((cartItem) => cartItem.product == item.product);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        foundCart.items.push({ product: item.product, quantity: item.quantity });
      }
    }

    const updatedCart = await CartRepository.updateOne({ _id: foundCustomer.cart._id }, { items: foundCart.items });

    await CartRepository.populate([updatedCart], ['items.product'], ['Product']);

    return "ADD_TO_CART_SUCCESS";
  }

  public static async removeProductFromCart(customerId: string, productId: string): Promise<string> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(customerId);

    const cart = await CartRepository.findOne({ _id: foundCustomer.cart._id });

    const existingItem = cart.items.find((cartItem) => cartItem.product._id == productId);

    if (!existingItem) {
      throw new NotFoundException("PRODUCT_NOT_IN_CART");
    }

    if (existingItem.quantity === 1) {
      cart.items = cart.items.filter((cartItem) => cartItem.product._id.toString() !== productId);
    } else {
      existingItem.quantity -= 1;
    }

    const updatedCart = await CartRepository.updateOne({ _id: foundCustomer.cart._id }, { items: cart.items });

    await CartRepository.populate([updatedCart], ['items.product'], ['Product']);

    return "REMOVE_PRODUCT_FROM_CART";
  }

  public static async clearCart(customerId: string): Promise<ICart> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(customerId);

    const clearedCart = await CartRepository.updateOne({ _id: foundCustomer.cart._id }, { items: [] });

    if (clearedCart.matchedCount === 0) throw new NotFoundException("CART_NOT_FOUND");

    if (clearedCart.modifiedCount === 0) throw new InternalServerException("CLEAR_CART_FAILED");

    const clearCart = await CartRepository.findOne({ _id: foundCustomer.cart._id });

    return clearCart as ICart;
  }

  public static async getCart(filter: any): Promise<ICart> {
        const foundCart = await CartRepository.findOne(filter);
    
        if (!foundCart) {
          throw new NotFoundException("CART_NOT_FOUND");
        }
    
        const populatedCart = await CartRepository.populate([foundCart], ['items.product'], ['Product']);
    
        return populatedCart[0] as ICart;
      }
    
      public static async getCartByCustomerId(customerId: string) {
        const foundCustomer = await CustomerServices.getCustomerByCustomerId(customerId);
    
        return await this.getCart({ _id: foundCustomer.cart });
      }
}
