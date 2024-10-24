import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { EmailTemplates } from "./mail.templates";


@Injectable()
export class MailService {
  private transport: nodemailer.Transporter;

  // Constructor
  constructor (private configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASSWORD')
      }
    })
  }


  // SendEmail Method
  async sendEmail (templateName: 'verification' | 'passwordReset' | 'welcome', subject: string,  templateVars: Record<string, any>) {
    const {customerEmail, customerName, otp, loginLink, newPassword} = templateVars;

    // Get and check the template
    const templateFN: any = EmailTemplates[templateName];
    if (!templateFN) throw new Error(`No Template found for ${templateName}`);

    // Generate the email HTML with the template and passed variables
    let html: string;
    if (templateName === 'verification')
      html = templateFN(customerEmail || this.configService.get<string>('GMAIL_USER'), customerName, otp);
    else if (templateName === 'passwordReset')
      html = templateFN(customerName, customerEmail, newPassword, loginLink)

    // Set the mail options
    const mailOptions = {
      from: `"SP_STORE " <${this.configService.get<string>('GMAIL_USER')}>`,
      to: customerEmail,
      subject,
      html
    };

    try {
      const info = await this.transport.sendMail(mailOptions);
      console.log(`Email send: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }
}