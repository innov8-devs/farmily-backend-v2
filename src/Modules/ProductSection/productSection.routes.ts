import { Router } from "express";
import ProductSectionController from "./productSection.controller";

const router = Router();

router.get("/", ProductSectionController.getAllSections);
router.get("/:id", ProductSectionController.getSectionById);
router.post("/", ProductSectionController.createSection);
router.put("/:id", ProductSectionController.updateSection);
router.delete("/:id", ProductSectionController.deleteSection);

export default router;
