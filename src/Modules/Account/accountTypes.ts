export enum AccountType {
  Customer = "Customer",
  Vendor = "Vendor",
}

// Interface for minimal base account input
export interface CreateMinimalBaseAccountInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
}

// Interface for base account input extending minimal base account input
export interface CreateBaseAccountInput extends CreateMinimalBaseAccountInput {
  password: string;
}

// Interface for full account input extending base account input
export interface CreateAccountInput extends CreateBaseAccountInput {
  accountType?: AccountType;
  accountTypeId?: string;
}

// Enum for provider types
export enum ProviderType {
  Google = "Google",
  Facebook = "Facebook",
}

// Interface for Google or Facebook account input extending minimal base account input
export interface CreateGoogleAccountInput
  extends CreateMinimalBaseAccountInput {
  isVerified: boolean;
  isVerifiedAt: Date;
  accountType?: AccountType;
  accountTypeId?: string;
  provider?: ProviderType;
}

export interface IDecodedToken {
  accountId?: string;
  accountType?: string;
  accountTypeId?: string;
  role?: string,
  iat: number;
  exp: number;
}
