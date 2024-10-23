import { IAccountModel } from "./account.model";
import AccountRepository from "./account.repository";
import { CreateAccountInput, CreateGoogleAccountInput } from "./accountTypes";
import {
  NotFoundException,
  InternalServerException,
  ForbiddenException,
} from "../../Shared/Exceptions";
import CardServices from "../Payment/Card/card.services";
import HashHelper from "../../Shared/Helpers/hash.helper";

export default class AccountServices {
  public static async createAccount(data: CreateAccountInput): Promise<any> {
    const createdAccount = await AccountRepository.createOne(data);

    if (!createdAccount) return "ACCOUNT CREATION FAILED!";

    return createdAccount;
  }

  public static async createGoogleAccount(
    data: CreateGoogleAccountInput
  ): Promise<IAccountModel> {
    const createdAccount = await AccountRepository.createOne(data);

    if (!createdAccount)
      throw new InternalServerException("ACCOUNT CREATION FAILED");

    return createdAccount;
  }

  public static async updateAccount(
    filter: any,
    setPayload?: any,
    unSetPayload?: any
  ): Promise<any> {
    const updatedAccount = await AccountRepository.updateOne(
      filter,
      setPayload,
      unSetPayload
    );

    return updatedAccount;
  }

  public static async updateAccountDetails(data) {
    const { firstName, lastName, phoneNumber, password, accountId } = data;

    const foundAccount = await this.findAccount({
      _id: data.accountId,
    });

    const isPasswordValid = await HashHelper.verifyHash(
      password,
      foundAccount.password
    );

    if (!isPasswordValid) throw new ForbiddenException("Invalid credentials!");

    const account = await this.updateAccount(
      { _id: accountId },
      { firstName, lastName, phoneNumber }
    );

    return account;
  }

  public static async updateAccountEmail(data) {
    const { email, password, accountId } = data;

    const foundAccount = await this.findAccount({
      _id: data.accountId,
    });

    // For security purpose, delete all saved cards if email changes
    if (foundAccount.email !== email) {
      await CardServices.removeAllCards(accountId);
    }

    const isPasswordValid = await HashHelper.verifyHash(
      password,
      foundAccount.password
    );

    if (!isPasswordValid) throw new ForbiddenException("Invalid credentials!");

    // Later-Implement: Email verification

    const account = await this.updateAccount(
      { _id: accountId },
      { email, emailChangedAt: new Date() }
    );

    return account;
  }

  public static async findAccount(filter: any, populate?: boolean): Promise<any> {
    const foundAccount = populate
      ? await AccountRepository.findOneAndPopulateAccountTypeId(filter)
      : await AccountRepository.findOne(filter);

    if (!foundAccount) throw new NotFoundException("Invalid credentials!");

    return foundAccount;
  }

  public static async checkAccountPresence(filter: any): Promise<any | null> {
    return await AccountRepository.findOne(filter);
  }
}
