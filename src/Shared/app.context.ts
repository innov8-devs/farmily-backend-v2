import { Request, Response } from 'express';

/**
 * Represents the application context containing request and response objects,
 * along with other relevant properties.
 */

export interface AppContext {
  req: Request;
  res: Response;
  accessToken: string;
  accountId: string;
  accountTypeId: string;
  accountType: string;
}
