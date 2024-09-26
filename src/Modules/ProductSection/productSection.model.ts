import mongoose, { Schema, Document } from "mongoose";

export interface IProductSectionModel extends Document {
  name: string;
}

const productSectionSchema = new Schema<IProductSectionModel>(
  {
    name: { type: String, required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IProductSectionModel>("ProductSection", productSectionSchema);
