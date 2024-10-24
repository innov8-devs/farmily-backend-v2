import { Request, Response } from "express";
import { PaystackServices } from "./paystack.services";
import AccountServices from "../../../Account/account.services";

export class PaystackController {
  public static async createCustomer(req: Request, res: Response) {
    try {
      const data = req.body;
      const customer = await PaystackServices.createCustomer(data);
      return res.status(201).json({ success: true, data: customer });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async validateCustomer(req: Request, res: Response) {
    try {
      const data = req.body;
      const validation = await PaystackServices.validateCustomer(data);
      return res.status(200).json({ success: true, data: validation });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async createDedicatedVirtualAccount(
    req: Request,
    res: Response
  ) {
    try {
      const data = req.body;
      const account = await PaystackServices.createDedicatedVirtualAccount(
        data
      );
      return res.status(201).json({ success: true, data: account });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async initializeTransaction(req: Request, res: Response) {
    try {
      const { accountId: userId } = req.user;
      const { amount, orderId, callback_url } = req.body;

      const foundAccount = await AccountServices.findAccount({ _id: userId });

      const amountInKobo = Number(amount) * 100;

      const data = {
        email: foundAccount.email,
        amount: String(amountInKobo),
        callback_url,
        metadata: {
          orderId,
        }
      };

      const transaction = await PaystackServices.initializeTransaction(data);
      return res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Card is charged as a form of validation
   * @param data
   * @returns url
   */
  public static async validateCard(req: Request, res: Response) {
    try {
      const _id = req.user.accountId;

      const foundAccount = await AccountServices.findAccount({ _id });

      const data = {
        email: foundAccount.email,
        userId: foundAccount._id,
      };

      const response = await PaystackServices.validateCard(data);

      return res
        .status(200)
        .json({ success: true, url: response.data.authorization_url });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async payWithSavedCards(req: Request, res: Response) {
    try {
      const { accountId: userId } = req.user;
      const { cardId, amount, orderId, callback_url } = req.body;

      const amountInKobo = Number(amount) * 100;

      const foundAccount = await AccountServices.findAccount({ _id: userId });

      const data = {
        userId,
        cardId,
        orderId,
        amount: String(amountInKobo),
        email: foundAccount.email,
        callback_url,
      };

      const response = await PaystackServices.payWithSavedCard(data);

      return res.status(200).json({ data: response });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
