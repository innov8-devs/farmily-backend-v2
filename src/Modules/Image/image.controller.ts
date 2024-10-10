import { ImageServices } from "./image.services";
import { AccountType } from "../Account/accountTypes";
import { Request, Response } from "express";
import { HandleImageUploadInput, IImage } from "./imageTypes";

export class ImageController {
  public static async uploadSingleImage(req: Request, res: Response) {
    try {
      const files = req.files as
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] };

      // Ensure files is an array
      const images = Array.isArray(files) ? files : Object.values(files).flat();

      const imageUploadPromises = images.map((image) => {
        return ImageServices.handleImageUpload({
          path: image.path,
          alt: image.filename.split(".")[0],
          accountType: req.accountType,
          accountTypeId: req.accountTypeId,
        } as HandleImageUploadInput);
      });

      const uploadedImages: IImage[] = await Promise.all(imageUploadPromises);

      return res.status(200).json({ images: uploadedImages });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ message: "IMAGE UPLOAD FAILED" });
    }
  }

  public static async uploadMultipleImages(req: Request, res: Response) {
    try {
      const files = req.files as
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] };

      // Ensure files is an array
      const images = Array.isArray(files) ? files : Object.values(files).flat();

      const imageUploadPromises = images.map((image) => {
        return ImageServices.handleImageUpload({
          path: image.path,
          alt: image.filename.split(".")[0],
          accountType: req.accountType,
          accountTypeId: req.accountTypeId,
        } as HandleImageUploadInput);
      });

      const uploadedImages: IImage[] = await Promise.all(imageUploadPromises);

      return res.status(200).json({ images: uploadedImages });
    } catch (error) {
      console.error({ error });
      return res.status(500).json({ message: "Failed to upload images" });
    }
  }

  public static async handleImageUpdate(req: Request, res: Response) {
    try {
      const imageId = req.params.imageId;
      const filePath = (req.files as Express.Multer.File[])[0].path;

      const foundImage = await ImageServices.getImage({
        imageId,
        accountType: req.accountType as AccountType,
        accountTypeId: req.accountTypeId,
      });

      const data = {
        foundImage,
        filePath,
      };

      await ImageServices.handleImageUpdate(data);

      return res.status(200).json({ message: "IMAGE UPDATED SUCCESSFULLY" });
    } catch (error) {
      console.error({ error });
      return res.status(500).json({ message: "Failed to update image" });
    }
  }

  public static async getAllImages(req: Request, res: Response) {
    try {
      const images = await ImageServices.getAllImages();

      return res
        .status(200)
        .json({ message: "IMAGES RETRIEVED SUCCESSFULLY", images });
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve images" });
    }
  }
}
