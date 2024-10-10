import { ImageServices } from "./image.services";
import { ImageController } from "./image.controller";
import { Router } from "express";
import { isAuthenticated } from "../../Shared/Middlewares/Account/isAuthenticated.middleware";
import { validateImages } from "../../Shared/Middlewares/validateImages.middleware";
import { upload } from "../../Infrastructure/Databases/multerClient.config";

const router = Router();

router.post(
  "/single",
  isAuthenticated,
  upload.array("file"),
  validateImages,
  ImageController.uploadSingleImage
);

router.post(
  "/multiple",
  isAuthenticated,
  upload.array("file"),
  validateImages,
  ImageController.uploadMultipleImages
);

router.put(
  "/:imageId",
  isAuthenticated,
  upload.array("file"),
  validateImages,
  ImageController.handleImageUpdate
);

router.get(
  "/all",
  ImageController.getAllImages
);

export default router