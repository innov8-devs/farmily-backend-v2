import { IDecodedToken } from "./src/Modules/Account/accountTypes";

declare global {
  namespace Express {
    interface Request {
      user?: IDecodedToken;
    }
  }
}
