import { IDecodedToken } from "./src/Modules/Account/accountTypes";

declare global {
  namespace Express {
    interface Request {
      query: any
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
