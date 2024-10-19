import { AccountType } from '../Account/accountTypes';
import { ICart } from '../Cart/cartTypes';
import { IWishList } from '../WishList/wishlistTypes';

export class CreateMinimalBaseAccountInput {
  firstName?: string;
  lastName?: string;
  phoneNumber: string
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

export class ICustomerAccount {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  passwordChangedAt: Date;
  isVerified: boolean;
  isVerifiedAt: Date;
  resetAt: Date;
  cartId: string;
  wishListId: string;
  accountType: string;
  accountId: string;
  customerId: string;
  provider: string;
}