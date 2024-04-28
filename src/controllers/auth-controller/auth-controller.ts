import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import jwt from 'jsonwebtoken';

import { otpController } from '@controllers/otp-controller';
import { ValidatorController } from '@controllers/validator-controller';
import { Users } from '@models/users-model';
import { secretKey } from '@utils/secret-key';

interface CustomRequest extends Request {
  user?: string;
}
export class AuthController {
  static async signIn(req: CustomRequest, res: Response) {
    try {
      const { email, password } = req.body;

      const requiredParams = { email, password };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res, 'Отсутствуют обязательные поля!');
      }

      const user: any = await ValidatorController.isUserCredentialCorrect(
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
      StatusServerError(res)
    }
  }

  static async sendOtpToRegister(req: Request, res: Response) {
    await otpController.generateAndSendOTP(req, res);
  }

  static async verifyOtpRegister(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!otp) {
        return Status400(res);
      }

      if (!email) {
        return Status400(res);
      }

      const isCorrect = await otpController.verifyOTP(email, otp);

      if (!isCorrect) {
        return Status400(res, 'Неверный OTP код!');
      }

      Status200(res);
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async isUserAvailable(req: Request, res: Response) {
    try {
      const { email, phone_number } = req.body;

      if (!email) {
        return Status400(res);
      }

      if(!phone_number) {
        return Status400(res)
      }

      const isUserAvailable =
        await ValidatorController.isUserByEmailAvailable(
          res,
          email
        );

      if (isUserAvailable) {
        return Status400(res, 'Пользователь с указанным вами адресом электронной почты зарегистрирован!');
      }

      const isUserPhoneNumberRegistered = await ValidatorController.isUserByPhoneNumberAvailable(res, phone_number)


      if(isUserPhoneNumberRegistered) {
        return Status400(res, 'Пользователь с указанным вами номером телефона зарегистрирован!')
      }

      Status200(res);
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { email, password, fio, user_role, otp, phone_number } = req.body;
      const requiredParams = { email, phone_number, password, fio, user_role, otp };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }
      
      // check otp
      const isOtpCorrect = await otpController.verifyOTP(email, otp);

      if (!isOtpCorrect) {
        return Status400(res, 'Неверный OTP код!');
      }

      const isEmailAvailable =
        await ValidatorController.isUserByEmailAvailable(
          res,
          email
        );

      if (isEmailAvailable) {
        return Status400(res, 'Аккаунт уже существует!');
      }

      if (password.length <= 8) {
        return Status400(res, 'Пароль слишком короткий!');
      }


      const hashedPassword = await bcrypt.hash(password, 10);

      Users.create({
        email,
        phone_number,
        password: hashedPassword,
        fio,
        user_role,
      });

      Status200(res, 'Пользователь успешно создан!');
    } catch (error) {
      StatusServerError(res);
    }
  }
}
