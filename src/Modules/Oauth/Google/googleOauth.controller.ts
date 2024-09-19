import { Request, Response } from 'express';
import { GoogleOAuthServices } from './googleOauth.services';
import { HandleCustomerGoogleLoginCallbackInput } from './googleOauthTypes';

/**
 * Controller for handling Google OAuth operations.
 */
export class GoogleOAuthController {
  /**
   * Initiates Google OAuth sign-up or login process.
   *
   * @param req - The request object.
   * @param res - The response object.
   */
  public static initiateSignUpOrLogin(req: Request, res: Response): void {
    try {
      const url = GoogleOAuthServices.initiateSignUpOrLoginCustomerWithGoogle();
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ message: `Error initiating Google sign-up or login: ${error.message}` });
    }
  }

  /**
   * Handles Google OAuth callback for sign-up or login.
   *
   * @param req - The request object.
   * @param res - The response object.
   */
  public static async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
      const data: HandleCustomerGoogleLoginCallbackInput = req.body;

      // Validate input
      if (!data.code) {
        res.status(400).json({ message: 'Authorization code is required' });
        return;
      }

      const result = await GoogleOAuthServices.handleCustomerGoogleSignUpOrLoginCallback(data);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: `Error handling Google callback: ${error.message}` });
    }
  }
}
