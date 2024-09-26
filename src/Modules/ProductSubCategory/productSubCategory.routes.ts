import { Router } from "express";
import { ProductSubCategoryController } from "./productSubCategory.controller";

const router = Router();

router.post("/", ProductSubCategoryController.create);
router.put("/", ProductSubCategoryController.update);
router.delete("/:productSubCategoryId", ProductSubCategoryController.delete);
router.get("/", ProductSubCategoryController.getAll);
router.get("/:productSubCategoryId", ProductSubCategoryController.getOne);

export default router;
