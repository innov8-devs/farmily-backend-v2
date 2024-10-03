import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../Product/productTypes";

export interface ICartItem {
  product: IProduct;
  quantity: number;
  specialRequest?: string;
}

export interface ICartModel extends Document {
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    quantity: { type: Number, default: 1 },
    specialRequest: String,
  },
  { _id: false }
);

const cartSchema = new Schema<ICartModel>(
  {
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<ICartModel>("Cart", cartSchema);
