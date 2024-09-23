import { Request, Response } from "express";
import CustomerServices from "./customer.services";
import TokenHelper from "../../Shared/Helpers/token.helper";
import {
  ChangeCustomerPasswordDTO,
  ChangeCustomerPasswordInput,
  ForgetCustomerPasswordInput,
  CreateBaseAccountInput,
  LoginCustomerInput,
  ResetCustomerPasswordInput,
} from "./customerTypes";
import { AccountValidator } from "../../Validators/account.validator";

export default class CustomerController {
  public static async signUpCustomer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data: CreateBaseAccountInput = req.body;

      const { error } = AccountValidator.validateSignup(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details,
        });

        return;
      }

      const message = await CustomerServices.signUpCustomer(data);

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async resendVerificationLink(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      const message = await CustomerServices.resendVerificationLink(email);

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async verifyCustomer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { verificationToken } = req.params;

      const message = await CustomerServices.verifyCustomer(verificationToken);

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async loginCustomer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data: LoginCustomerInput = req.body;

      const { error } = AccountValidator.validateLogin(data);

      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details,
        });

        return;
      }

      const token = await CustomerServices.loginCustomer(data);

      token && TokenHelper.setTokenCookie(res, token);

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  public static logoutCustomer(_, res: Response) {
    TokenHelper.clearTokenCookie(res);

    res.status(200).json({
      message: "Logout successful",
    });
  }

  public static async forgetCustomerPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data: ForgetCustomerPasswordInput = req.body;

      const message = await CustomerServices.forgetCustomerPassword(data);

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async resetCustomerPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data: ResetCustomerPasswordInput = req.body;
      
      const message = await CustomerServices.resetCustomerPassword(data);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async changeCustomerPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userInput: ChangeCustomerPasswordInput = req.body;

      const { accountId, accountType, accountTypeId } = req.user;

      const data: ChangeCustomerPasswordDTO = {
        ...userInput,
        accountId,
        accountType,
        accountTypeId,
      };

      const message = await CustomerServices.changeCustomerPassword(data);

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /*

  public static async createCustomerGoogleAccount(req: Request, res: Response): Promise<void> {
    try {
      const account = await CustomerServices.createCustomerGoogleAccount();
      res.status(200).json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
 */

  public static async getCustomerAccountDetails(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const givenAccountId = req.user.accountId;

      const customer = await CustomerServices.getCustomerAccountDetails(
        givenAccountId
      );

      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }

      res.status(200).json({ customer }); // Return the customer data
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
}
