import nodemailer, { Transporter } from 'nodemailer';
import { senderEmail, senderPassword } from '../credentials';
import { log } from '@helper/logger';

export class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });
  }

  public async sendEmail(receiver: string, message: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: senderEmail,
        to: receiver,
        subject: 'Hackathon FLO Notification',
        text: message,
      });
    } catch (error) {
      log('[Mailer error]: ', error);
    }
  }
}