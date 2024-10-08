import mongoose, { Schema, Document } from "mongoose";

export interface ICardModel extends Document {
  userId: Schema.Types.ObjectId;
  bin: string;
  last4: string;
  bank: string;
  authorizationCode: string;
  accountName: string;
}

/**
 * Mongoose schema for the Card model.
 */
const cardSchema = new Schema<ICardModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    bin: String,
    last4: String,
    bank: String,
    authorizationCode: {
      type: String,
      unique: true,
    },
    accountName: String
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<ICardModel>('Card', cardSchema);
