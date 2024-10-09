import axios, { AxiosRequestConfig } from "axios";
import { config } from "../../../../Config/app.config";
import {
  validateCustomerInput,
  InitializeTransactionInput,
  chargeAuthorizationInput,
  payWithSavedCard,
} from "./paystackTypes";
import CardRepository from "../../Card/card.repository";

export class PaystackServices {
  private static readonly API_URL: string = "https://api.paystack.co";
  private static readonly SECRET_KEY: string = config.paystack.secretKey;
  private static readonly HEADERS: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${this.SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  public static async createCustomer(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  }) {
    try {
      const { email, first_name, last_name, phone } = data;

      const response = await axios.post(
        `${this.API_URL}/customer`,
        { email, first_name, last_name, phone },
        this.HEADERS
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async validateCustomer(data: validateCustomerInput) {
    try {
      const response = await axios.post(
        `${this.API_URL}/customer/${data.customerCode}/identification`,
        this.HEADERS
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates Nigerian bank accounts for customers, this account does not hold funds!
   * Any funds transferred to the created account is credited to the platform.
   * @param data customer, preferred_bank
   * @returns
   */
  public static async createDedicatedVirtualAccount(data) {
    try {
      const { customer, preferred_bank } = data;

      const response = await axios.post(
        `${this.API_URL}/customer/dedicated_account`,
        { customer, preferred_bank },
        this.HEADERS
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async initializeTransaction(data: InitializeTransactionInput) {
    try {
      const response = await axios.post(
        `${this.API_URL}/transaction/initialize`,
        data,
        this.HEADERS
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Card is charged as a form of validation
   * @param data
   */
  public static async validateCard(data) {
    try {
      // charge the card 50 naira
      const reqData = {
        email: data.email,
        amount: "5000",
        channel: ["card"],
        metadata: {
          action: "validate_card",
          userId: data.userId,
        },
      };

      const response = this.initializeTransaction(reqData);

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * This is used for recurring card charges.
   * Authorization code is gotten from the first successful card transaction
   * and it is saved in DB.
   * @param data email, amount, authorization code
   */
  public static async chargeAuthorization(data: chargeAuthorizationInput) {
    try {
      const response = await axios.post(
        `${this.API_URL}/transaction/charge_authorization`,
        data,
        this.HEADERS
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async payWithSavedCard(data: payWithSavedCard) {
    const { userId, cardId, email, amount } = data;

    const card = await CardRepository.findOne({
      _id: cardId,
      userId,
    });

    const response = await PaystackServices.chargeAuthorization({
      email,
      amount,
      authorization_code: card.authorizationCode,
    });

    return response.data;
  }
}
