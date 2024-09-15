import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../Product/productTypes';


export interface IWishListModel extends Document {
  products: IProduct[]; // Array of preferred products
}

const wishListSchema = new Schema<IWishListModel>(
  {
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        index: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IWishListModel>('WishList', wishListSchema);
