import nodemailer, { Transporter } from "nodemailer";
import { config } from "dotenv";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import activationCodeService from "./activationCode-service";

config();

class MailService {
  #transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendCode(to: string, userId: number) {
    const code = activationCodeService.generateCode();
    await activationCodeService.saveCode(code, userId);

    await this.#transporter.sendMail(<MailOptions>{
      from: process.env.SMTP_USER,
      to,
      subject: `Вход в аккаунт на ${process.env.API_URL}`,
      text: "",
      html: `
          <div>
            <h1>Ваш код: ${code}</h1>
          </div>
        `,
    });
  }
}

export default new MailService();