import jwt from 'jsonwebtoken';
import { config } from '../../Config/app.config';
import { Response } from 'express';


export default class TokenHelper {
  public static generateVerificationToken(payload: any): string {
    return TokenHelper.generateToken(
      payload,
      config.tokenSecrets.verificationToken.secret,
      config.tokenSecrets.verificationToken.expiresIn,
    );
  }
 
  public static verifyVerificationToken(token: string) {
    return TokenHelper.verifyToken(token, config.tokenSecrets.verificationToken.secret);
  }

  public static generateResetToken(payload: any): string {
    return TokenHelper.generateToken(
      payload,
      config.tokenSecrets.resetToken.secret,
      config.tokenSecrets.resetToken.expiresIn,
    );
  }

  public static verifyResetToken(token: string) {
    return TokenHelper.verifyToken(token, config.tokenSecrets.resetToken.secret);
  }

  public static generateAccessToken(payload: any): string {
    return TokenHelper.generateToken(
      payload,
      config.tokenSecrets.accessToken.secret,
      config.tokenSecrets.accessToken.expiresIn,
    );
  }

  public static verifyAccessToken(token: string): any {
    return TokenHelper.verifyToken(token, config.tokenSecrets.accessToken.secret);
  }


  public static generateNewsLetterSubscriptionToken(email: string): string {
    return TokenHelper.generateToken(
      { email },
      config.tokenSecrets.newsletterSubscription.secret,
      config.tokenSecrets.newsletterSubscription.expiresIn,
    );
  }

  public static verifyNewsLetterSubscriptionToken(token: string) {
    return TokenHelper.verifyToken(token, config.tokenSecrets.newsletterSubscription.secret);
  }

  private static generateToken(payload: any, secret: string, expiresIn: string): string {
    const generatedToken = jwt.sign(payload, secret, { expiresIn });
    return generatedToken
  }

  private static verifyToken(token: string, secret: string): any {
    const res = jwt.verify(token, secret);
    return res
  }

  // Set JWT as a cookie
  public static setTokenCookie(res: Response, token: string): void {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 3600000,
    });
  }

  public static clearTokenCookie(res: Response): void {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}
