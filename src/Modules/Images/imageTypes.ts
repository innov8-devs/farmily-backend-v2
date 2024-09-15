import { AccountType } from "../Account/accountTypes";

export class CreateImageInput {
  url: string;
  alt: string;
  publicId: string;
  accountType: "Customer" | "Vendor";
  accountTypeId: string;
}

export class DeleteImageInput {
  imageId: string;
  accountType: AccountType;
  accountTypeId: string;
}

export class HandleImageUploadInput {
  path: any;
  alt: any;
  accountType: "Customer" | "Vendor";
  accountTypeId: string;
}

export class ICloudinaryImage {
  publicId?: string;
  url?: string;
}

export class IImage extends ICloudinaryImage {
  _id?: string;
  alt?: string;
  accountType?: string;
  accountTypeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
