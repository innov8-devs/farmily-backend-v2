import mongoose, { Schema, Document } from 'mongoose';

export interface IAccountModel extends Document {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordChangedAt: Date;
  verificationToken: string;
  isVerified: boolean;
  isVerifiedAt: Date;
  resetToken: string;
  resetAt: Date;
  accountType: 'Customer' | 'Vendor';
  accountTypeId: Schema.Types.ObjectId | IAccountModel;
  provider: 'Local' | 'Google';
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
    password: String,
    passwordChangedAt: Date,
    verificationToken: String,
    isVerified: { type: Boolean, default: false },
    isVerifiedAt: Date,
    resetToken: String,
    resetAt: Date,
    accountType: {
      type: String,
      enum: ['Customer', 'Vendor'],
      index: true,
    },
    accountTypeId: {
      type: Schema.Types.ObjectId,
      refPath: 'accountType',
      index: true,
    },
    provider: {
      type: String,
      enum: ['Local', 'Google'],
      default: 'Local',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IAccountModel>('Account', accountSchema);