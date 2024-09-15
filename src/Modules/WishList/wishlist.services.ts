import { AddOrRemoveProductFromOrToWishListDTO, IWishList } from './wishListTypes';
import { InternalServerException } from '../../Shared/Exceptions';
import WishListRepository from './wishList.repository';
import CustomerServices from '../Customer/customer.services';

export class WishListServices {
  public static async createWishList(): Promise<IWishList> {
    const isWishListCreated = await WishListRepository.createOne({});

    if (!isWishListCreated) {
      throw new InternalServerException("WISHLIST_CREATE_FAILED");
    }

    return isWishListCreated as IWishList;
  }

  public static async addProductToWishList({
    customerId,
    productId,
  }: AddOrRemoveProductFromOrToWishListDTO): Promise<IWishList> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(customerId);

    const foundWishList = await WishListRepository.findOne({ _id: foundCustomer.wishList._id, products: productId });

    if (foundWishList) {
      return await this.populateAndReturnWishList(foundWishList);
    }

    await this.pushProductToWishList(foundCustomer.wishList._id, productId);

    const updatedWishList = await this.findWishListById(foundCustomer.wishList._id);

    return await this.populateAndReturnWishList(updatedWishList);
  }

  public static async removeProductFromWishList({
    productId,
    customerId,
  }: AddOrRemoveProductFromOrToWishListDTO): Promise<IWishList> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(customerId);

    await this.pullProductFromWishList(foundCustomer.wishList._id, productId);

    const updatedWishList = await this.findWishListById(foundCustomer.wishList._id);

    return await this.populateAndReturnWishList(updatedWishList);
  }

  public static async clearWishList(customerId: string): Promise<IWishList> {
    const foundCustomer = await CustomerServices.getCustomerByCustomerId(customerId);

    await this.clearWishListProducts(foundCustomer.wishList._id);

    const updatedWishList = await this.findWishListById(foundCustomer.wishList._id);

    return await this.populateAndReturnWishList(updatedWishList);
  }

  private static async populateAndReturnWishList(wishList: IWishList): Promise<IWishList> {
    const populatedWishList = await WishListRepository.populate([wishList], ['products'], ['Product']);
    return populatedWishList[0] as IWishList;
  }

  private static async pushProductToWishList(wishListId: string, productId: string): Promise<void> {
    await WishListRepository.updateOne({ _id: wishListId }, { $push: { products: productId } });
  }

  private static async pullProductFromWishList(wishListId: string, productId: string): Promise<void> {
    await WishListRepository.updateOne({ _id: wishListId }, { $pull: { products: productId } });
  }

  private static async findWishListById(wishListId: string): Promise<IWishList | null> {
    return await WishListRepository.findOne({ _id: wishListId });
  }

  private static async clearWishListProducts(wishListId: string): Promise<void> {
    await WishListRepository.updateOne({ _id: wishListId }, { products: [] });
  }
}
