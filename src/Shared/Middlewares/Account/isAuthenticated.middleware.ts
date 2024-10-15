import { Request, Response, NextFunction } from "express";
import { IDecodedToken } from "../../../Modules/Account/accountTypes";
import TokenHelper from "../../Helpers/token.helper";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = TokenHelper.verifyAccessToken(token) as IDecodedToken;

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(403).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Server error. Try again." });
    }
  }
};
