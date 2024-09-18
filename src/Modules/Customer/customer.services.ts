import { ICustomer, ICustomerAccount } from "./customerTypes";
import HashHelper from "../../Shared/Helpers/hash.helper";
import TokenHelper from "../../Shared/Helpers/token.helper";
import AccountServices from "../Account/account.services";
import { CreateBaseAccountInput } from "../Account/accountTypes";
import EmailServices from "../Mail/mail.services";
import { WishListServices } from "../WishList/wishlist.services";
import CustomerRepository from "./customer.repository";
import {
  ChangeCustomerPasswordDTO,
  ForgetCustomerPasswordInput,
  LoginCustomerInput,
  ResetCustomerPasswordInput,
} from "./customerTypes";
import { ClientHelper } from "../../Shared/Helpers/client.helper";
import {
  ForbiddenException,
  InternalServerException,
  NotFoundException,
} from "../../Shared/Exceptions";
// import { ShoppingPreferencesServices } from '../../ShoppingPreference/Services';
import { CartServices } from "../Cart/cart.services";

/**
 * Service class for handling customer mutations.
 *
 */
export default class CustomerServices {
  public static async signUpCustomer(
    data: CreateBaseAccountInput
  ): Promise<string> {
    const isAccountRegistered = await AccountServices.accountExists({
      email: data.email,
    });

    if (isAccountRegistered)
      throw new NotFoundException("This account exists!");

    const { _id, firstName, accountType, accountTypeId } =
      await CustomerServices.createCustomer(data);

    const verificationToken = TokenHelper.generateVerificationToken({
      accountId: _id,
      accountType,
      accountTypeId,
    });

    await AccountServices.updateAccount({ _id }, { verificationToken });

    const currentClientHost = ClientHelper.getCurrentClient().landingPage;
    //const verificationLink = `${currentClientHost}/auth/customer/verify-account/${verificationToken}`;
    const verificationLink = `https://farmily-landing-page.fly.dev/auth/customer/verify-account/${verificationToken}`;

    await EmailServices.sendVerificationEmail(
      firstName,
      data.email,
      verificationLink
    );

    return "CHECK_MAIL_BOX";
  }

  public static async verifyCustomer(verificationToken: string) {
    const { accountId, accountType, accountTypeId } =
      TokenHelper.verifyVerificationToken(verificationToken);

    const foundAccount = await AccountServices.findAccount({
      _id: accountId,
      accountType,
      accountTypeId,
    });

    if (foundAccount.isVerified && !foundAccount.verificationToken)
      throw new ForbiddenException("The account is already verified!");

    if (
      accountType !== foundAccount.accountType &&
      accountTypeId !== foundAccount.accountTypeId
    )
      throw new ForbiddenException("You are not allowed to do this!");

    await AccountServices.updateAccount(
      { _id: accountId },
      { isVerified: true, isVerifiedAt: new Date() },
      { verificationToken: 1 }
    );

    await EmailServices.sendWelcomeEmail(
      foundAccount.firstName,
      foundAccount.email
    );

    return "ACCOUNT VERIFIED SUCCESSFULLY";
  }

  public static async loginCustomer(data: LoginCustomerInput) {
    const foundAccount = await AccountServices.findAccount({
      email: data.email,
    });

    if (!foundAccount.isVerified)
      throw new ForbiddenException("The account is not verified yet!");

    const isPasswordValid = await HashHelper.verifyHash(
      data.password,
      foundAccount.password
    );

    if (!isPasswordValid)
      throw new ForbiddenException("The email or password is incorrect!");

    const token = TokenHelper.generateAccessToken({
      accountId: foundAccount._id,
      accountType: foundAccount.accountType,
      accountTypeId: foundAccount.accountTypeId,
    });

    return token;
  }

  // /**
  public static async forgetCustomerPassword(
    data: ForgetCustomerPasswordInput
  ) {
    const foundAccount = await AccountServices.findAccount({
      email: data.email,
      accountType: "Customer",
    });

    if (foundAccount && foundAccount.resetToken) {
      const decodedResetToken = TokenHelper.verifyResetToken(
        foundAccount.resetToken
      );

      if (decodedResetToken)
        throw new ForbiddenException("ALREADY HAVE VALID RESET LINK");
    }

    const resetToken = TokenHelper.generateResetToken({
      accountId: foundAccount._id,
      accountType: foundAccount.accountType,
      accountTypeId: foundAccount.accountTypeId,
    });

    const currentClientHost = ClientHelper.getCurrentClient().landingPage;

    const resetLink = `${currentClientHost}/auth/customer/reset-password/${resetToken}`;

    await EmailServices.sendResetPasswordEmail(
      foundAccount.firstName,
      data.email,
      resetLink
    );

    await AccountServices.updateAccount({ email: data.email }, { resetToken });

    return "CHECK MAIL BOX";
  }

  public static async resetCustomerPassword(data: ResetCustomerPasswordInput) {
    const decodedResetToken = TokenHelper.verifyResetToken(data.resetToken);

    const foundAccount = await AccountServices.findAccount({
      _id: decodedResetToken.accountId,
      accountType: decodedResetToken.accountType,
      accountTypeId: decodedResetToken.accountTypeId,
    });

    if (!foundAccount) throw new NotFoundException("Invalid credentials!");

    const hashedPassword = await HashHelper.generateHash(data.password);

    await AccountServices.updateAccount(
      {
        _id: decodedResetToken.accountId,
        accountType: decodedResetToken.accountType,
        accountTypeId: decodedResetToken.accountTypeId,
      },
      { password: hashedPassword, resetAt: new Date() },
      { resetToken: 1 }
    );

    return "ACCOUNT RESET SUCCESSFULLY";
  }

  public static async changeCustomerPassword(data: ChangeCustomerPasswordDTO) {
    const foundAccount = await AccountServices.findAccount({
      _id: data.accountId,
    });

    const isPasswordValid = await HashHelper.verifyHash(
      data.oldPassword,
      foundAccount.password
    );

    if (!isPasswordValid) throw new ForbiddenException("INCORRECT PASSWORD");

    const hashedPassword = await HashHelper.generateHash(data.newPassword);

    await AccountServices.updateAccount(
      { _id: data.accountId },
      { password: hashedPassword, passwordChangedAt: new Date() }
    );

    return "PASSWORD CHANGED SUCCESSFULLY";
  }

  /*
  public static async createCustomerGoogleAccount(): Promise<IAccountModel> {
    const createdAccount = await CustomerRepository.createOne({});

    if (!createdAccount)
      throw new InternalServerException(
        CustomerConstants.ACCOUNT_CREATION_FAILED
      );

    return createdAccount;
  }
  */
  //   public static async assignCartToCustomer(filter: any, cartId: any) {
  //     const isAssigned = await CustomerRepository.updateOne(filter, { cartId });

  //     if (isAssigned.matchedCount === 0)
  //       return "The customer is not found!";

  //     if (isAssigned.modifiedCount === 0)
  //       return "The customer cart assigning process failed!"
  //   }

  private static async createCustomer(
    data: CreateBaseAccountInput
  ): Promise<any> {
    try {
      const hashedPassword = await HashHelper.generateHash(data.password);

      const createdAccount = await AccountServices.createAccount({
        ...data,
        password: hashedPassword,
      });
      const createdCustomerWhishList = await WishListServices.createWishList();
      const createdCart = await CartServices.createCart({ items: [] });

      /*
      const createdShoppingPreferences =
        await ShoppingPreferencesServices.createShoppingPreferences({
          preferredProductCategories: [],
          preferredProductSubCategories: [],
        });
       */

      const createdCustomer = await CustomerRepository.createOne({});

      await CustomerRepository.updateOne(
        { _id: createdCustomer._id },
        {
          wishList: createdCustomerWhishList._id,
          // shoppingPreferences: createdShoppingPreferences._id,
          cart: createdCart._id,
        }
      );

      return await AccountServices.updateAccount(
        { _id: createdAccount._id },
        { accountType: "Customer", accountTypeId: createdCustomer._id }
      );
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Account Exists");
      } else {
        return error;
      }
    }
  }

  public static async getCustomerAccountDetails(givenAccountId: string): Promise<ICustomerAccount> {
    const {
      _id: accountId,
      firstName,
      lastName,
      email,
      passwordChangedAt,
      isVerified,
      isVerifiedAt,
      resetAt,
      accountType,
      provider,
      accountTypeId: { _id: customerId, wishListId, cartId },
    } = await AccountServices.findAccount({ _id: givenAccountId });

    return {
      accountId,
      firstName,
      lastName,
      email,
      passwordChangedAt,
      isVerified,
      isVerifiedAt,
      resetAt,
      provider,
      accountType,
      customerId,
      wishListId,
      cartId,
    };
  }

  public static async getCustomerByCustomerId(
    customerId: string
  ): Promise<ICustomer> {
    const foundCustomer = await CustomerRepository.findOne({ _id: customerId });

    const populatedCustomer = await CustomerRepository.populate(
      [foundCustomer],
      ["cart", "wishList"],
      ["Cart", "WishList"]
    );

    return populatedCustomer[0] as ICustomer;
  }
}
