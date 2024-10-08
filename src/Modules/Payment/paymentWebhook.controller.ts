import { Request, Response } from "express";
import crypto from "crypto";
import { config } from "../../Config/app.config";
import { PaymentWebhookServices } from "./paymentWebhook.services";
import {
  ForbiddenException,
  BadRequestException,
} from "../../Shared/Exceptions";

export default class PaymentWebhookController {
  private static readonly SECRET_KEY: string = config.paystack.secretKey;

  public static async handleWebhook(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { gatewayId } = req.params;

      // To handle multiple payment gateways in future.
      switch (gatewayId) {
        case "paystack":
          const isFromPaystack =
            PaymentWebhookController.isValidPaystackEvent(req);

          if (!isFromPaystack) throw new BadRequestException("Invalid event!");

          await PaymentWebhookServices.handlePaystackWebhook(req.body);

          res.status(200).send({ message: "Webhook handled successfully" });

          break;

        default:
          throw new ForbiddenException(`Unsupported gateway: ${gatewayId}`);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  private static isValidPaystackEvent(req: Request) {
    const event = req.body;

    const hash = crypto
      .createHmac("sha512", PaymentWebhookController.SECRET_KEY)
      .update(JSON.stringify(event))
      .digest("hex");

    return hash == req.headers["x-paystack-signature"];
  }
}
