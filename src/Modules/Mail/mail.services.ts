import fs from "fs";
import ejs from "ejs";
import BrevoEmailService from "../../Infrastructure/Brevo/brevoMail";

const emailServiceByBrevo = new BrevoEmailService();

export default class EmailServices {
  static async sendWelcomeEmail(firstName: string, email: string) {
    const subject = "Welcome to Farmily";
    const templateName = "welcomeEmail";
    const sendEmailParams = await EmailServices.buildSendEmailParams(
      email,
      subject,
      templateName,
      { firstName }
    );
    return EmailServices.sendEmail(sendEmailParams);
  }

  static async sendVerificationEmail(
    firstName: string,
    email: string,
    verificationLink: string
  ) {
    const subject = "Email Verification";
    const templateName = "verifyEmail";
    const sendEmailParams = await EmailServices.buildSendEmailParams(
      email,
      subject,
      templateName,
      {
        firstName,
        verificationLink,
      }
    );
    return EmailServices.sendEmail(sendEmailParams);
  }

  static async sendResetPasswordEmail(
    firstName: string,
    email: string,
    resetLink: string
  ) {
    const subject = "Reset Password";
    const templateName = "resetPasswordEmail";
    const sendEmailParams = await EmailServices.buildSendEmailParams(
      email,
      subject,
      templateName,
      {
        firstName,
        email,
        resetLink,
      }
    );
    return EmailServices.sendEmail(sendEmailParams);
  }

  static async sendNewsLetterSubscriptionEmail(
    firstName: string,
    email: string,
    newsletterLink: string
  ) {
    const subject = "Newsletter Subscription";
    const templateName = "subscribeToNewsLetterEmail";
    const sendEmailParams = await EmailServices.buildSendEmailParams(
      email,
      subject,
      templateName,
      {
        firstName,
        email,
        newsletterLink,
      }
    );
    return EmailServices.sendEmail(sendEmailParams);
  }

  static async sendThanksToNewsLetterSubscriptionEmail(
    firstName: string,
    email: string
  ) {
    const subject = "Thanks For Newsletter Subscription";
    const templateName = "thanksForNewsLetterSubscriptionEmail";
    const sendEmailParams = await EmailServices.buildSendEmailParams(
      email,
      subject,
      templateName,
      { firstName }
    );
    return EmailServices.sendEmail(sendEmailParams);
  }

  static async sendEmail(params) {
    const { toAddress, renderedTemplate, subject } = params;

    try {
      return await emailServiceByBrevo.sendMail(toAddress, renderedTemplate, subject);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  static async buildSendEmailParams(toAddress: string, subject: string, templateName: string, data: object) {
    const filePath = `./templates/${templateName}.html`;

    const template = fs.readFileSync(filePath, "utf8");

    const renderedTemplate = ejs.render(template, data);

    return { toAddress, renderedTemplate, subject };
  }
}
