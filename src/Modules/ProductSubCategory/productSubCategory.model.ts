import mongoose, { Schema, Document } from "mongoose";
import { IProductSectionModel } from "../ProductSection/productSection.model";

export interface IProductSubCategoryModel extends Document {
  label: string;
  description: string;
  image: Schema.Types.ObjectId; // The ID of the image associated with the product sub-category.
  category: Schema.Types.ObjectId;
  productSection: string;
  productSectionId: Schema.Types.ObjectId | IProductSectionModel;
}

const productSubCategorySchema = new Schema<IProductSubCategoryModel>(
  {
    label: { type: String, unique: true, index: true },
    description: String,
    image: { type: Schema.Types.ObjectId, ref: "Image" },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      index: true,
    },
    productSection: { type: String, index: true },
    productSectionId: {
      type: Schema.Types.ObjectId,
      ref: "ProductSection",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IProductSubCategoryModel>(
  "ProductSubCategory",
  productSubCategorySchema
);
