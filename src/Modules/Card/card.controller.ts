import { Request, Response } from "express";
import CardServices from "./card.services";

export default class CardController {
  public static async getAllUserCards(req: Request, res: Response) {
    try {
      const { accountId: userId } = req.user;

      const result = await CardServices.getAllUserCards(userId);

      // Exclude 'authorizationCode' from each card object
      const sanitizedResult = result.map((card: any) => {
        const { authorizationCode, ...sanitizedCard } = card._doc;
        return sanitizedCard;
      });

      return res
        .status(200)
        .json({
          message: "data retrieved successfully.",
          data: sanitizedResult,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getCard(req: Request, res: Response) {
    try {
      const { cardId } = req.params;

      const card = await CardServices.getCard(cardId);

      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      // Exclude 'authorizationCode' from the card object
      const { authorizationCode, ...sanitizedCard } = card._doc;

      return res
        .status(200)
        .json({ message: "Card retrieved successfully", data: sanitizedCard });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async removeCard(req: Request, res: Response) {
    try {
      const { cardId } = req.params;

      const result = await CardServices.removeCard(cardId);

      return res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async removeAllCards(req: Request, res: Response) {
    try {
      const { accountId: userId } = req.user;

      const result = await CardServices.removeAllCards(userId);

      return res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
