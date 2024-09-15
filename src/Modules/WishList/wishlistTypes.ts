import { IProduct } from "../Product/productTypes";

export class IWishList {
  _id: string;
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export class AddOrRemoveProductFromOrToWishListInput {
  productId: string;
}

export class AddOrRemoveProductFromOrToWishListDTO extends AddOrRemoveProductFromOrToWishListInput {
  customerId: string;
}
