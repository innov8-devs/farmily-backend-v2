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
  public static async handleImageUpload({ path, alt, accountType, accountTypeId }: HandleImageUploadInput) {
    const { publicId, url } = await this.addImageToCloudinary(path);

    await this.deleteImageFromDisk(path);

    return await this.createImage({ publicId, url, alt, accountType, accountTypeId });
  }

  public static async handleImageDelete(data: DeleteImageInput) {
    const foundImage = await ImageServices.getImage(data);

    await this.removeImageFromCloudinary(foundImage.publicId);

    await this.deleteImage(foundImage._id);

    return "IMAGE_DELETED_SUCCESSFULLY";
  }

  public static async getImage(data): Promise<IImage> {
        const isImageFound = await ImageRepository.findOne({ _id: data.imageId });
    
        if (!isImageFound) throw new NotFoundException("IMAGE_NOT_FOUND");
    
        if (isImageFound.accountTypeId !== data.accountTypeId)
          throw new UnAuthorizedException("IMAGE_NOT_YOURS");
    
        return isImageFound as IImage;
      }

  private static async addImageToCloudinary(imagePath: any) {
    const { public_id: publicId, secure_url: url } = await cloudinary.v2.uploader.upload(
      `${process.cwd()}/${imagePath}`,
      {
        folder: 'farmily',
      },
    );

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
      throw new InternalServerException("IMAGE_DELETE_FROM_CLOUDINARY_FAILED");
    }
  }

  private static async createImage(data: CreateImageInput) {
    const isImageCreated = await ImageRepository.createOne(data);

    if (!isImageCreated) throw new InternalServerException("IMAGE_CREATION_FAILED")

    return isImageCreated as IImage;
  }

  private static async deleteImage(imageId: string) {
    const isDeleted = await ImageRepository.deleteOne({ _id: imageId });

    if (isDeleted.deletedCount === 0) return "Image Deletion Failed!";
  }

  public static async deleteImageFromDisk(imagePath: string) {
        return await fs.unlink(imagePath, (error) => {
          if (error) {
            console.log({ error });
            throw new InternalServerException("IMAGE_DELETION_FROM_DISK_FAILED");
          }
        });
      }
}
