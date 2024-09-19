import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { config } from '../../Config/app.config';

/**
 * Google OAuth Client instance for handling Google authentication and authorization.
 */
const googleClient = new OAuth2Client({
  clientId: config.oauth.google.clientId,
  clientSecret: config.oauth.google.clientSecret,
  redirectUri:
    config.environment.branchName === 'main'
      ? config.oauth.google.redirectUrl.productionLink
      : config.oauth.google.redirectUrl.staggingLink,
});

export { googleClient, TokenPayload };
