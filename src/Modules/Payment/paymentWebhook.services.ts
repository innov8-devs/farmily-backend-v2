import { appLogger } from "../../Shared/utils/logger";
import { OrderServices } from "../Order/order.services";
import CardServices from "./Card/card.services";

export class PaymentWebhookServices {
  public static async handlePaystackWebhook(updates) {
    const eventType = updates.event;

    const transactionData = updates.data;

    const isValidateCardAction =
      transactionData.channel === "card" &&
      transactionData.metadata.action === "validate_card";

    const orderId = transactionData.metadata.orderId;

    switch (eventType) {
      case "charge.success":
        console.log(JSON.stringify(transactionData, null, 4));

        if (isValidateCardAction) {
          const cardDetails = {
            userId: transactionData.metadata.userId,
            bin: transactionData.authorization.bin,
            last4: transactionData.authorization.last4,
            authorizationCode: transactionData.authorization.authorization_code,
            accountName: transactionData.authorization.account_name,
            bank: transactionData.authorization.bank,
          };

          await CardServices.saveCard(cardDetails);
        }

        if (orderId) await OrderServices.confirmOrder(orderId);

        break;

      default:
        appLogger.error(`Unhandled event type: ${eventType}`);
        break;
    }
  }
}
