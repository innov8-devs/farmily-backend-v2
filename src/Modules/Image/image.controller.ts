import { ImageServices } from "./image.services";
import { Request, Response } from "express";
import { HandleImageUploadInput, IImage } from "./imageTypes";
import path from "path";

export class ImageController {

  public static async uploadImage(req: Request, res: Response) {
    try {
      const files = req.files;

      // Ensure files is an array
      const images = Array.isArray(files) ? files : Object.values(files).flat();

      // Manually construct the file path since we moved the files to 'uploads'
      const imageUploadPromises = images.map((image) => {
        const uploadPath = path.join(__dirname, "../../uploads", image.name); // File was moved to this path

        return ImageServices.handleImageUpload({
          path: uploadPath,
          alt: image.name.split(".")[0],
          accountType: req.accountType,
          accountTypeId: req.accountTypeId,
        } as HandleImageUploadInput) ;
      });

      const uploadedImages: IImage[] = await Promise.all(imageUploadPromises);

      return res.status(200).json({ images: uploadedImages });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ message: "IMAGE UPLOAD FAILED" });
    }
  }

  public static async handleImageUpdate(req: Request, res: Response) {
    try {
      const imageId = req.params.imageId;

      const file = req.files[0] as any;

      const filePath = path.join(__dirname, "../../uploads", file.name);

      const foundImage = await ImageServices.getImage({
        imageId,
        accountType: req.accountType,
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
