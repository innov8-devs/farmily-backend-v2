import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.post("/single", ProductController.createProduct);
router.put("/:productId", ProductController.updateProduct);
router.get("/all", ProductController.getAllProducts);
router.delete("/:productId", ProductController.deleteProduct);

export default router;
