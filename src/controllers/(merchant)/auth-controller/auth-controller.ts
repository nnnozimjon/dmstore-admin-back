// import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// import { sequelize } from '@config/db';
// import { otpController } from '@controllers/(client)/otp-controller';
import { ValidatorController } from '@controllers/(general)/validator-controller';
import {
  // Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
// import { Merchant } from '@models/merchant-model';
// import { Users } from '@models/users-model';
import { secretKey } from '@utils/secret-key';

export class MerchantAuthController {
  static async signInMerchant(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const requiredParams = { email, password };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res, 'Отсутствуют обязательные поля!');
      }

      const user: any = await ValidatorController.isMerchantCredentialCorrect(
        res,
        email,
        password
      );

      if (!user) {
        return Status400(res, 'Неверные учетные данные!');
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          phone_number: user.phone_number,
          fio: user.fio,
          user_role: user.user_role,
        },
        secretKey
      );
      // send token
      res.json({
        code: 200,
        token,
        message: 'Авторизация прошла успешно. Добро пожаловать!',
      });
    } catch (error) {
      StatusServerError(res);
    }
  }

  // static async registerMerchant(req: Request, res: Response) {
  //   let transaction;

  //   try {
  //     const user_role = 'merchant';

  //     const { email, password, fio, otp, phone_number } = req.body;
  //     const requiredParams = {
  //       email,
  //       phone_number,
  //       password,
  //       fio,
  //       otp,
  //     };

  //     const validation =
  //       ValidatorController.validateRequiredFields(requiredParams);

  //     if (!validation.valid) {
  //       return Status400(res);
  //     }

  //     // check otp
  //     const isOtpCorrect = await otpController.verifyOTP(email, otp);

  //     if (!isOtpCorrect) {
  //       return Status400(res, 'Неверный OTP код!');
  //     }

  //     const isEmailAvailable = await ValidatorController.isUserByEmailAvailable(
  //       res,
  //       email
  //     );

  //     if (isEmailAvailable) {
  //       return Status400(res, 'Аккаунт уже существует!');
  //     }

  //     if (password.length <= 8) {
  //       return Status400(res, 'Пароль слишком короткий!');
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     // Start transaction
  //     transaction = await sequelize.transaction();

  //     const user = await Users.create(
  //       {
  //         email,
  //         phone_number,
  //         password: hashedPassword,
  //         fio,
  //         user_role,
  //       },
  //       { transaction }
  //     );

  //     const user_id = user.id;

  //     Merchant.create(
  //       {
  //         user_id,
  //         store_name: '',
  //       },
  //       { transaction }
  //     );

  //     Status200(res, 'Пользователь успешно создан!');
  //   } catch (error) {
  //     // Rollback the transaction if an error occurs
  //     if (transaction) await transaction.rollback();
  //     StatusServerError(res);
  //   }
  // }
}
