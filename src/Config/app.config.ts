import dotenv from "dotenv";
dotenv.config();

export const config = {
  environment: {
    env: process.env.NODE_ENV,
    branchName: process.env.BRANCH_NAME,
  },
  port: process.env.PORT,
  storage: {
    database: {
      mongoURI: process.env.MONGO_URI || "",
      fileStorage: {
        cloudinary: {
          apiKey: process.env.CLOUDINARY_API_KEY,
          apiSecret: process.env.CLOUDINARY_API_SECRET,
        },
      },
    },
  },

  brevo: {
    apiKey: process.env.BREVO_API_KEY,
  },
  aws: {
    awsRegion: "us-east-1",
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsEmailSender: "hello@farmily.africa",
  },
  clients: {
    stagging: {
      landingPage: "https://farmily-landing-page.fly.dev/",
      shoppingApp: "https://farmily-landing-page.fly.dev/",
    },
    production: {
      landingPage: "https://www.farmily.africa",
      shoppingApp: "https://app.farmily.africa",
    },
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUrl: {
        // staggingLink: 'https://stagging.farmily.africa/auth/google/callback',
        staggingLink: "http://localhost:8000/auth/google/callback",
        productionLink: "https://www.farmily.africa/auth/google/callback",
      },
    },
  },
  encryptionKeys: { otp: process.env.OTP_ENCRYPTION_KEY },
  paystack: {
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    secretKey: process.env.PAYSTACK_SECRET_KEY,
  },
  tokenSecrets: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET || "hgjfj",
      expiresIn: "12h",
    },
    resetToken: { secret: process.env.RESET_TOKEN_SECRET, expiresIn: "6h" },
    verificationToken: {
      secret: process.env.VERIFICATION_TOKEN_SECRET,
      expiresIn: "6h",
    },
    newsletterSubscription: {
      secret: process.env.NEWSLETTER_SUBSCRIPTION_SECRET,
      expiresIn: "24h",
    },
  },
};
