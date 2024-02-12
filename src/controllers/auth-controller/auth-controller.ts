import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { ValidatorController } from '@controllers/validator-controller';
import { Users } from '@models/users-model';

export class AuthController {
  static async signIn(req: Request, res: Response) {
    try {
      const { phone_number, password } = req.body;

      const requiredParams = { phone_number, password };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return res.json({
          code: 400,
          message: 'Отсутствуют обязательные поля!',
        });
      }

      const user: any = await ValidatorController.isUserCredentialCorrect(
        res,
        phone_number,
        password
      );

      if (!user) {
        return res.status(400).json({
          code: 400,
          message: 'Неверные учетные данные!',
        });
      }

      // send token
      res.send(user);
    } catch (error) {
      res.json({
        code: 500,
        message: '',
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { phone_number, password, fio, user_role } = req.body;
      const requiredParams = { phone_number, password, fio, user_role };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return res.status(400).json({
          code: 400,
          message: validation.error,
        });
      }

      const isPhoneNumberAvailable =
        ValidatorController.isValidEmail(phone_number);

      if (!isPhoneNumberAvailable) {
        return res.status(400).json({
          code: 400,
          message: 'Account with this phone number already exists!',
        });
      }

      if (password.length <= 8) {
        return res.status(400).json({
          code: 400,
          message: 'Пароль слишком короткий!',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      Users.create({
        phone_number,
        password: hashedPassword,
        fio,
        user_role,
      });

      res.status(200).json({
        code: 200,
        message: 'Пользователь успешно создан!',
      });
    } catch (error) {
      res.json({
        code: 500,
        message: 'Что-то пошло не так!',
      });
    }
  }
}
