import { ImageController } from "./image.controller";
import { Router } from "express";
const router = Router();

router.get(
  "/all",
  ImageController.getAllImages
);

export default router