import cardModel from "./card.model";
import { BaseRepository } from "../../Repository";

class CardRepository extends BaseRepository<any> {
  constructor() {
    super(cardModel);
  }
}

export default new CardRepository();
