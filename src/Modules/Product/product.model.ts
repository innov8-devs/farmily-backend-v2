import mongoose, { Schema, Document } from "mongoose";
import { IImage } from "../Image/imageTypes";
import { IProductCategoryModel } from "../ProductCategory/productCategory.model";
import { IProductSubCategoryModel } from "../ProductSubCategory/productSubCategory.model";

export interface IProductModel extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  benefits: string;
  size: string;
  originalPrice: number;
  discountPrice: number;
  stockQty: number;
  stockQtyAlert: number;
  isFeatured: Boolean;
  image: IImage;
  views: number;
  likes: number;
  productSection: string;
  category: Schema.Types.ObjectId | IProductCategoryModel;
  subCategory: Schema.Types.ObjectId | IProductSubCategoryModel;
}

const productSchema = new Schema<IProductModel>(
  {
    name: { type: String, index: true },
    slug: { type: String, index: true },
    description: String,
    benefits: String,
    size: { type: String, index: true },
    originalPrice: { type: Number, index: true },
    discountPrice: { type: Number, index: true },
    stockQty: Number,
    stockQtyAlert: Number,
    isFeatured: Boolean,
    image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    productSection: String,
    category: {
      type: Schema.Types.ObjectId,
      refPath: "ProductCategory",
      index: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      refPath: "ProductSubCategory",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IProductModel>("Product", productSchema);
