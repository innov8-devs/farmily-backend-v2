import axios, { AxiosResponse } from 'axios';
import { config } from '../../Config/app.config';

class BrevoEmailService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = 'https://api.brevo.com/v3/smtp/email';
    this.apiKey = config.brevo.apiKey;
  }

  private createPayload(receiverEmail: string, subject: string, templateName: string): object {
    return {
      sender: {
        name: 'Farmily Africa',
        email: 'adamsakorede5@gmail.com',
      },
      to: [
        {
          email: receiverEmail,
        //   name: receiverName,
        },
      ],
      subject: subject || 'Hello',
      htmlContent: templateName,
    };
  }

  public async sendMail(receiverEmail: string, templateName: string, subject?: string): Promise<AxiosResponse> {
    const emailPayload = this.createPayload(receiverEmail, subject, templateName);

    try {
      const response = await axios.post(this.apiUrl, emailPayload, {
        headers: {
          accept: 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error sending email: ${error.message}`);
      } else {
        throw new Error('An unexpected error occurred while sending the email.');
      }
    }
  }
}

export default BrevoEmailService;
