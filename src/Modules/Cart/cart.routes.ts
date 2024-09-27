import { Router } from "express";
import { CartController } from "./cart.controller";
import { isAuthenticated } from "../../Shared/Middlewares/Account/isAuthenticated.middleware";

const router = Router();

router.get("/", isAuthenticated, CartController.getCart);
router.post("/add", isAuthenticated, CartController.addProduct);
router.delete(
  "/:productId",
  isAuthenticated,
  CartController.removeProduct
);
router.delete("/clear", isAuthenticated, CartController.clear);

export default router;
