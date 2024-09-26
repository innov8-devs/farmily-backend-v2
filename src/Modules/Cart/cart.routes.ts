import { Router } from "express";
import { CartController } from "./cart.controller";

const router = Router();

router.post("/", CartController.create);
router.post("/add", CartController.addProduct);
router.delete("/:customerId/product/:productId", CartController.removeProduct);
router.delete("/:customerId", CartController.clear);
router.get("/:customerId", CartController.getCart);

export default router;
