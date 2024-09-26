import { Router } from "express";
import ProductCategoryController from "./productCategory.controller";

const router = Router();

router.post("/", ProductCategoryController.createCategory);
router.get(
  "/",
  ProductCategoryController.getAllCategoriesBySection
);
router.put("/:id", ProductCategoryController.updateCategory);
router.delete("/:id", ProductCategoryController.deleteCategory);
router.get("/:id", ProductCategoryController.getCategory);

export default router;
