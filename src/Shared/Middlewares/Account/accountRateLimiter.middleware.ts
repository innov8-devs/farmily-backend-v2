import rateLimit from "express-rate-limit";

export class AccountRateLimiter {
  public static loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
      success: false,
      message: "Too many login attempts, please try again later.",
    },
  });

  public static signUpRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 5,
    message: {
      success: false,
      message: "Too many sign-up attempts, please try again later.",
    },
  });

  public static resendVerificationRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3,
    message: {
      success: false,
      message:
        "Too many requests to resend verification link, please try again later.",
    },
  });

  public static forgetPasswordRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3,
    message: {
      success: false,
      message: "Too many password reset requests, please try again later.",
    },
  });

  public static updateAccountEmailLimiter = rateLimit({
    windowMs: 6 * 60 * 60 * 1000, // 6 hours
    limit: 2,
    message: {
      success: false,
      message: "Too many update account requests, please try again after 6 hours.",
    },
  });
}
