import AccountServices from "../../Account/account.services";
import CardRepository from "./card.repository";
import { CardDetails } from "./cardTypes";

export default class CardServices {
  public static async saveCard(data: CardDetails) {
    const accountExists = await AccountServices.checkAccountPresence({
      _id: data.userId,
    });

    if (!accountExists) return;

    const cardFound = await CardRepository.findOne({
      authorizationCode: data.authorizationCode,
    });
    const cardExists = !!cardFound;

    if (cardExists) return;

    await CardRepository.createOne(data);
  }

  public static async getAllUserCards(userId) {
    return await CardRepository.findMany({ userId });
  }

  public static async getCard(cardId) {
    return await CardRepository.findOne({ _id: cardId });
  }

  public static async removeCard(cardId) {
    await CardRepository.deleteOne({ _id: cardId });

    return "CARD REMOVED SUCCESSFULLY";
  }

  public static async removeAllCards(userId) {
    await CardRepository.deleteMany({ userId });

    return "CARDS REMOVED SUCCESSFULLY";
  }
}
