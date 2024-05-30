/* eslint-disable no-else-return */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

const { parsed } = dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});
export class MailerController {
  static async sendOtp(client_mail: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: parsed.MAILERUSER,
        pass: parsed.MAILERPASS,
      },
    });

    const mailOptions = {
      from: {
        name: "Dushanbe Market",
        address: parsed.MAILERUSER,
      },
      to: client_mail,
      subject: "Подтверждение регистрации в магазин Dushanbe Market",
      text: `
      Здравствуйте!
      
      Для завершения процесса регистрации в магазин Dushanbe Market, пожалуйста, используйте следующий проверочный код:
      Ваш проверочный код: ${otp}
      
      Это автоматическое сообщение, пожалуйста, не отвечайте.

      Если вы не пытались создать учетную запись в Dushanbe Market, проигнорируйте это сообщение.

      С наилучшими пожеланиями,
      Dushanbe Market
      `,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      return false;
    }
  }
}
