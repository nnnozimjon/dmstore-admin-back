import { Request, Response } from 'express';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import sequelize from 'sequelize';

import { OTP } from '@models/otp-model';
import { MailerController } from '@controllers/mailer-controller';

export class otpController {
  static generateRandomCode() {
    const codeLength = 6;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      const digit = Math.floor(Math.random() * 10);
      code += digit.toString();
    }

    return code;
  }

  static async generateAndSendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const otpValue = otpController.generateRandomCode();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

      if (!email) {
        return Status400(res);
      }

      await OTP.update(
        { is_used: 1 },
        {
          where: {
            email,
          },
        }
      );

      const isOtpSent = await MailerController.sendOtp(email, otpValue)

      if(!isOtpSent) {
        return StatusServerError(res)
      }

      // Save OTP to the database
      await OTP.create({
        email,
        otp_value: otpValue,
        expiration_time: expirationTime,
      });

      Status200(res);
    } catch (error) {
      StatusServerError(res);
    }
  }

  static verifyOTP = async (email: string, enteredOTP: string) => {
    // Check if the entered OTP is valid
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp_value: enteredOTP,
        is_used: false,
        expiration_time: {
          [sequelize.Op.gte]: new Date(), // 5 minutes ago
        },
      },
    });

    if (otpRecord?.email) {
      // Mark OTP as used
      await otpRecord.update({ is_used: true });
      return true;
    }
    return false;
  };

  static checkOTP = async (email: string, enteredOTP: string) => {
    // Check if the entered OTP is valid
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp_value: enteredOTP,
        is_used: false,
        expiration_time: {
          [sequelize.Op.gte]: new Date(), // 5 minutes ago
        },
      },
    });
    if (otpRecord?.email) {
      return true;
    }
    return false;
  };
}
