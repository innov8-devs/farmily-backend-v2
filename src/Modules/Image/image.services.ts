import fs from 'fs';
import cloudinary from '../../Infrastructure/Databases/cloudinaryClient.config';
import ImageRepository from './image.repository';
import { InternalServerException, NotFoundException, UnAuthorizedException } from '../../Shared/Exceptions';
import {
  CreateImageInput,
  DeleteImageInput,
  HandleImageUploadInput,
  ICloudinaryImage,
  IImage,
} from './imageTypes';

/**
 * Represents a service class for handling image mutations, including image upload, deletion, and update.
 */
export class ImageServices {
  public static async handleImageUpload({
    path,
    alt,
    accountType,
    accountTypeId,
  }: HandleImageUploadInput) {
    const { publicId, url } = await this.addImageToCloudinary(path);

    await this.deleteImageFromDisk(path);

    return await this.createImage({
      publicId,
      url,
      alt,
      accountType,
      accountTypeId,
    });
  }

  public static async handleImageDelete(data: DeleteImageInput) {
    const foundImage = await ImageServices.getImage(data);

    await this.removeImageFromCloudinary(foundImage.publicId);

    await this.deleteImage(foundImage._id);

    return "IMAGE DELETED SUCCESSFULLY";
  }

  public static async getImage(data): Promise<IImage> {
    const isImageFound = await ImageRepository.findOne({ _id: data.imageId });

    if (!isImageFound) throw new NotFoundException("IMAGE NOT FOUND");

    if (isImageFound.accountTypeId !== data.accountTypeId)
      throw new UnAuthorizedException("IMAGE NOT YOURS");

    return isImageFound as IImage;
  }

  public static async handleImageUpdate(data: {
    foundImage: IImage;
    filePath: string;
  }) {
    const { foundImage, filePath } = data;

    await this.removeImageFromCloudinary(foundImage.publicId);

    const { publicId, url } = await this.addImageToCloudinary(
      filePath
    );

    await this.updateImage(foundImage._id, url, publicId);

    await this.deleteImageFromDisk(filePath);

    return "IMAGE UPDATED SUCCESSFULLY";
  }

  public static async deleteImageFromDisk(imagePath: string) {
    return await fs.unlink(imagePath, (error) => {
      if (error) {
        console.log({ error });
        throw new InternalServerException("IMAGE DELETION FROM DISK FAILED");
      }
    });
  }

  private static async addImageToCloudinary(imagePath: any) {
    const { public_id: publicId, secure_url: url } =
      await cloudinary.v2.uploader.upload(imagePath, {
        folder: "farmily",
      });

    return {
      publicId,
      url,
    } as ICloudinaryImage;
  }

  private static async removeImageFromCloudinary(imagePublicId: string) {
    try {
      return await cloudinary.v2.uploader.destroy(imagePublicId);
    } catch (error) {
      console.log({ error });
      throw new InternalServerException("IMAGE DELETE FROM CLOUDINARY FAILED");
    }
  }

  private static async createImage(data: CreateImageInput) {
    const isImageCreated = await ImageRepository.createOne(data);

    if (!isImageCreated)
      throw new InternalServerException("IMAGE CREATION FAILED");

    return isImageCreated as IImage;
  }

  private static async updateImage(
    imageId: string,
    url: string,
    publicId: string
  ) {
    const isImageUpdated = await ImageRepository.updateOne(
      { _id: imageId },
      { url, publicId }
    );

    if (isImageUpdated.matchedCount === 0)
      throw new NotFoundException("IMAGE NOT FOUND");

    if (isImageUpdated.modifiedCount === 0)
      throw new InternalServerException("IMAGE UPDATE FAILED");
  }

  private static async deleteImage(imageId: string) {
    const isDeleted = await ImageRepository.deleteOne({ _id: imageId });

    if (isDeleted.deletedCount === 0) return "Image Deletion Failed!";
  }
}
