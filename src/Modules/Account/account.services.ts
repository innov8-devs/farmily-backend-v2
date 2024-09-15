import { IAccountModel } from "./account.model";
import AccountRepository from "./account.repository";
import { CreateAccountInput, CreateGoogleAccountInput } from "./accountTypes";
import { NotFoundException } from "../../Shared/Exceptions";

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
  ): Promise<IAccountModel | string> {
    const createdAccount = await AccountRepository.createOne(data);

    if (!createdAccount) return "ACCOUNT CREATION FAILED!";

    return createdAccount;
  }

  public static async updateAccount(
    filter: any,
    setPayload: any,
    unSetPayload: any = undefined
  ): Promise<any> {
    const updatedAccount = await AccountRepository.updateOne(
      filter,
      setPayload,
      unSetPayload
    );

    return updatedAccount;
  }

  public static async updateAccountAndReturnNew(
    filter: any,
    setPayload: any,
    unSetPayload: any = undefined
  ): Promise<any> {
    const updatedAccount = await AccountRepository.updateOneAndReturnNew(
      filter,
      setPayload,
      unSetPayload
    );

    return updatedAccount;
  }

  public static async accountExists(filter: any): Promise<boolean> {
    const foundAccount = await AccountRepository.findOne(filter);

    return !!foundAccount;
  }

  public static async findAccount(filter: any): Promise<any> {
    const foundAccount = await AccountRepository.findOne(filter);

    if (!foundAccount) throw new NotFoundException('Invalid credentials!');

    return foundAccount;
  }
}
