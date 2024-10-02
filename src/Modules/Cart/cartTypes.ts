import { IProduct } from "../Product/productTypes";

export class ICartItem {
  product?: IProduct;
  quantity?: number;
}

export class ICart {
  _id: string;
  items?: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class AddToCartInput {
  product: string;
  quantity: number;
}

export class AddToCartDTO {
  customerId: string;
  items: AddToCartInput[];
}

export class CreateCartInput {
  items: AddToCartInput[];
}

export class IncrementOrDecrementInput {
  customerId: string;
  productId: string;
  quantity: number;
}
