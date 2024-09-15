import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing the Image model.
 */
export interface IImageModel extends Document {
  url: string; // The URL of the image.
  alt: string; // The alternative text for the image.
  publicId: string; // The cloudinary public identifier of the image.
  accountType: 'Customer' | 'Vendor'; // The type of the account associated with the image.
  accountTypeId: Schema.Types.ObjectId; // The ID of the account associated with the image.
}

const ImageSchema = new Schema<IImageModel>(
  {
    url: String,
    alt: String,
    publicId: String,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IImageModel>('Image', ImageSchema);
