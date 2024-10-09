import { Router } from "express";
import CardController from "./card.controller";
import { isAuthenticated } from "../../../Shared/Middlewares/Account/isAuthenticated.middleware";

const router = Router();

router.get("/", isAuthenticated, CardController.getAllUserCards);

router.get("/:cardId", isAuthenticated, CardController.getCard);

router.delete("/:cardId", isAuthenticated, CardController.removeCard);

router.delete("/", isAuthenticated, CardController.removeAllCards);

export default router;
