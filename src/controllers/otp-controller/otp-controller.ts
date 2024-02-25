import { Request, Response } from 'express';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import sequelize from 'sequelize';

import { OTP } from '@models/otp-model';

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
      const { phone_number } = req.body;
      const otpValue = otpController.generateRandomCode();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

      if (!phone_number) {
        return Status400(res);
      }

      await OTP.update(
        { is_used: 1 },
        {
          where: {
            phone_number,
          },
        }
      );

      // Save OTP to the database
      await OTP.create({
        phone_number,
        otp_value: otpValue,
        expiration_time: expirationTime,
      });

      Status200(res);
    } catch (error) {
      StatusServerError(res);
    }
  }

  static verifyOTP = async (phone_number: string, enteredOTP: string) => {
    // Check if the entered OTP is valid
    const otpRecord = await OTP.findOne({
      where: {
        phone_number,
        otp_value: enteredOTP,
        is_used: false,
        expiration_time: {
          [sequelize.Op.gte]: new Date(), // 5 minutes ago
        },
      },
    });

    if (otpRecord?.phone_number) {
      // Mark OTP as used
      await otpRecord.update({ is_used: true });
      return true;
    }
    return false;
  };

  static checkOTP = async (phone_number: string, enteredOTP: string) => {
    // Check if the entered OTP is valid
    const otpRecord = await OTP.findOne({
      where: {
        phone_number,
        otp_value: enteredOTP,
        is_used: false,
        expiration_time: {
          [sequelize.Op.gte]: new Date(), // 5 minutes ago
        },
      },
    });
    if (otpRecord?.phone_number) {
      return true;
    }
    return false;
  };
}
