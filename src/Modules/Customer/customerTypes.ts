import { AccountType } from '../Account/accountTypes';
import { ICart } from '../Cart/cartTypes';
import { IWishList } from '../WishList/wishListTypes';

export class CreateMinimalBaseAccountInput {
  firstName?: string;
  lastName?: string;
  email: string;
}

export class CreateBaseAccountInput extends CreateMinimalBaseAccountInput {
  password: string;
}

export interface VerifyCustomerOrVendorInput {
  verificationToken: string;
}

export interface ForgetCustomerPasswordInput {
  email: string;
}

export interface LoginCustomerInput extends ForgetCustomerPasswordInput {
  password: string;
}

export interface ResetCustomerPasswordInput {
  password: string;
  resetToken: string;
}

export interface ChangeCustomerPasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeCustomerPasswordDTO extends ChangeCustomerPasswordInput {
  accountId: string;
  accountType?: AccountType | string;
  accountTypeId: string;
}

export class ICustomer {
  _id: string;
  cart: ICart;
  wishList?: IWishList;
  // shoppingPreferences?: IShoppingPreferences;
}