import { IDecodedToken } from "./src/Modules/Account/accountTypes";

declare global {
  namespace Express {
    interface Request {
      user?: IDecodedToken;
      file: any;
      files: any;
      accessToken?: string;
      accountId?: string;
      accountType?: string;
      accountTypeId?: string;
    }
  }
}
