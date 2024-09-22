import mongoose, { Schema, Document } from "mongoose";

export interface IAccountModel extends Document {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  passwordChangedAt: Date;
  verificationToken: string;
  isVerified: boolean;
  isVerifiedAt: Date;
  resetToken: string;
  resetAt: Date;
  resetTokenGeneratedAt: Date;
  verificationTokenGeneratedAt: Date;
  accountType: "Customer" | "Vendor";
  accountTypeId: Schema.Types.ObjectId | IAccountModel;
  provider: "Local" | "Google";
  role: string;
}

const accountSchema = new Schema<IAccountModel>(
  {
    email: {
      type: String,
      unique: true,
      index: true,
    },
    firstName: String,
    lastName: String,
    phoneNumber: {
      type: String,
      unique: true,
      index: true,
    },
    password: String,
    passwordChangedAt: Date,
    verificationToken: String,
    isVerified: { type: Boolean, default: false },
    isVerifiedAt: Date,
    resetToken: String,
    resetAt: Date,
    resetTokenGeneratedAt: Date,
    verificationTokenGeneratedAt: Date,
    accountType: {
      type: String,
      enum: ["Customer", "Vendor"],
      index: true,
    },
    accountTypeId: {
      type: Schema.Types.ObjectId,
      refPath: "accountType",
      index: true,
    },
    provider: {
      type: String,
      enum: ["Local", "Google"],
      default: "Local",
      index: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IAccountModel>("Account", accountSchema);
