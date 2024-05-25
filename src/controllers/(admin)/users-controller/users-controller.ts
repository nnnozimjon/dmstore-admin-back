import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { ValidatorController } from '@controllers/(general)/validator-controller';
import {
  Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
import { Users } from '@models/users-model';

export class UsersController {
  static async getAll(req: Request, res: Response) {}

  static async getById(req: Request, res: Response) {}

  static async create(req: Request, res: Response) {
    try {
      const { email, phone_number, fio, user_role, password } = req.body;

      const requiredParams = { email, phone_number, fio, user_role, password };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      if (password.length <= 8) {
        return Status400(res, 'Пароль слишком короткий!');
      }

      const isEmailValid = ValidatorController.isValidEmail(email);
      const isPhoneNumberCorrect =
        ValidatorController.validatePhoneNumber(phone_number);

      if (!isEmailValid) {
        return Status400(res, 'Адрес электронной почты указан неверно!');
      }

      if (!isPhoneNumberCorrect) {
        return Status400(res, 'Номер телефона указан неверно!');
      }

      const isUserByEmailAvailable =
        await ValidatorController.isUserByEmailAvailable(res, email);

      if (isUserByEmailAvailable) {
        return Status400(
          res,
          'Пользователь с указанным вами адресом электронной почты существует!'
        );
      }

      const isUserByPhoneNumberAvailable =
        await ValidatorController.isUserByPhoneNumberAvailable(
          res,
          phone_number
        );

      if (isUserByPhoneNumberAvailable) {
        return Status400(
          res,
          'Пользователь с введенным вами номером телефона существует!'
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await Users.create({
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

  static async update(req: Request, res: Response) {}
  static async delete(req: Request, res: Response) {}
}
