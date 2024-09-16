import mongoose, { Schema, Document } from 'mongoose';
import { ICart } from '../Cart/cartTypes';
// import { IShoppingPreferences } from '../../ShoppingPreference/Types/shoppingPreferencesTypes';
import { IWishList } from '../WishList/wishlistTypes';

/**
 * Interface representing the Customer model.
 */
export interface ICustomerModel extends Document {
  cart: ICart;
  // shoppingPreferences: IShoppingPreferences;
  wishList: IWishList;
}

/**
 * Mongoose schema for the Customer model.
 */
const customerSchema = new Schema<ICustomerModel>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    // shoppingPreferences: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'ShoppingPreferences',
    // },
    wishList: {
      type: Schema.Types.ObjectId,
      ref: 'WishList',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<ICustomerModel>('Customer', customerSchema);
