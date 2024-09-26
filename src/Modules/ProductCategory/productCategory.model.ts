import mongoose, { Schema, Document } from "mongoose";
import { IImage } from "../Image/imageTypes";
import { IProductSectionModel } from "../ProductSection/productSection.model";

export interface IProductCategoryModel extends Document {
  label: string;
  description: string;
  image: IImage;
  productSection: string;
  productSectionId: Schema.Types.ObjectId | IProductSectionModel;
}

const categorySchema = new Schema<IProductCategoryModel>(
  {
    label: { type: String, required: true, index: true },
    description: String,
    image: { type: Schema.Types.ObjectId, ref: "Image" },
    productSection: { type: String, ref: "ProductSection", index: true },
    productSectionId: { type: Schema.Types.ObjectId, ref: "ProductSection", index: true  },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IProductCategoryModel>("ProductCategory", categorySchema);
