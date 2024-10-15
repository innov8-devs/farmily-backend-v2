import { Request, Response, NextFunction } from "express";
import { IDecodedToken } from "../../../Modules/Account/accountTypes";
import TokenHelper from "../../Helpers/token.helper";

// Middleware to check authorization based on user roles
const isAuthorized = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Unauthorized, no token provided" });
      }

      // Extract the token
      const token = authHeader.split(" ")[1];

      // Verify the token
      const decoded = TokenHelper.verifyAccessToken(token) as IDecodedToken;

      // Check if the user's role is allowed
      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden, insufficient permissions" });
      }

      // Attach the decoded user info to the request object
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  };
};

export default isAuthorized;
