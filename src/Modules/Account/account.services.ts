import { IAccountModel } from "./account.model";
import AccountRepository from "./account.repository";
import { CreateAccountInput, CreateGoogleAccountInput } from "./accountTypes";
import { NotFoundException, InternalServerException } from "../../Shared/Exceptions";

export default class AccountServices {
  public static async createAccount(
    data: CreateAccountInput
  ): Promise<any> {

    const createdAccount = await AccountRepository.createOne(data);

    if (!createdAccount) return "ACCOUNT CREATION FAILED!";

    return createdAccount;
  }

  public static async createGoogleAccount(
    data: CreateGoogleAccountInput
  ): Promise<IAccountModel> {
    const createdAccount = await AccountRepository.createOne(data);

    if (!createdAccount)
      throw new InternalServerException(
        "ACCOUNT CREATION FAILED"
      );

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
  
  public static async findAccount(filter: any): Promise<any> {
    const foundAccount = await AccountRepository.findOne(filter);

    if (!foundAccount) throw new NotFoundException('Invalid credentials!');

    return foundAccount;
  }

  public static async checkAccountPresence(filter: any): Promise<any | null> {
    return await AccountRepository.findOne(filter);
  }
}
