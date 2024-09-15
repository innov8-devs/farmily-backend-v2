import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../../Config/app.config';
import { IDecodedToken } from '../../../Modules/Account/accountTypes';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required!' });
  }

  try {
    const secret = config.tokenSecrets.accessToken.secret;

    const decoded = jwt.verify(token, secret) as IDecodedToken; 

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
