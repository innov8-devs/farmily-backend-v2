import { Request, Response, NextFunction } from "express";
import { ImageServices } from "../../Modules/Image/image.services";
import path from "path";

export async function validateImages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
  const files = req.files

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  // Handle the case where files are an array or an object with field names
  const fileArray = Array.isArray(files)
    ? files
    : Object.values(files).flat();

  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  for (const file of fileArray) {
    if (!allowedImageTypes.includes(file.mimetype)) {
      const uploadPath = path.join(__dirname, "../../uploads", file.name);
      await ImageServices.deleteImageFromDisk(uploadPath);

      return res.status(400).json({
        message: "Invalid image file type. Allowed types: JPEG, PNG, JPG",
      });
    }

    // Check the file size for each file (you can adjust the maximum size as needed)
    const maxFileSize = 2 * 1024 * 1024; // 2 MB

    if (file.size > maxFileSize) {
      const uploadPath = path.join(__dirname, "../../uploads", file.name);
      await ImageServices.deleteImageFromDisk(uploadPath);

      return res.status(400).json({
        error: "Image file size exceeds the maximum allowed size (2MB)",
      });
    }
  }

  next();
}
