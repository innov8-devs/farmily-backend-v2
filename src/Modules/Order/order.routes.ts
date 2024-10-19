import { Router } from "express";
import { OrderController } from "./order.controller";
import { isAuthenticated } from "../../Shared/Middlewares/Account/isAuthenticated.middleware";

const router = Router();

router.get("/:orderId", isAuthenticated, OrderController.getOrderByUser);
router.post("/place-order", isAuthenticated, OrderController.placeOrder);

export default router;
