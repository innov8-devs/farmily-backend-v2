import { IImage } from "../Image/imageTypes";
import { Schema } from "mongoose";

export class CreateProductInput {
  name: string;
  description: string;
  benefits: string;
  size: string;
  originalPrice: number;
  discountPrice?: number;
  stockQty: number;
  stockQtyAlert: number;
  isFeatured: boolean;
  image: IImage;
  productSection: string;
  category: Schema.Types.ObjectId; 
  subCategory: Schema.Types.ObjectId; 
}
export interface IProduct extends CreateProductInput {
  _id: string;
  slug: string;
  views?: number;
  likes?: number;
}

export class CreateBulkProductsInput {
  products: CreateProductInput[];
}

export class UpdateProductInput {
  productId: string;
  payload: CreateProductInput;
}

export class GetAllProductsInput {
  section?: string;
  pageSize?: number;
  pageNumber?: number;
  sort?: 1 | -1;
}