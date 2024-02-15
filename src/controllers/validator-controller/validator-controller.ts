import bcrypt from 'bcrypt';
import { Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

import { Users } from '@models/users-model';

export class ValidatorController {
  static isValidEmail(email: any) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
  }

  static cleanPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/\D/g, '');
  }

  static validatePhoneNumber(phoneNumber: string) {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Check if the cleaned phone number starts with "992" and has a length of exactly 12
    return cleanPhoneNumber.length === 12;
  }

  static validateRequiredFields(fields: { [key: string]: any }): {
    valid: boolean;
    error: string;
  } {
    for (const key in fields) {
      if (!fields[key]) {
        return { valid: false, error: `${key} требуется!` };
      }
    }
    return { valid: true, error: '' };
  }

  static isNameValid(name: any) {
    // Basic validation for names (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  }

  static isUsernameValid(username: any) {
    // Basic validation for usernames (letters, numbers, underscores)
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    return usernameRegex.test(username);
  }

  static async deleteFile(file: any, folder: string) {
    if (file) {
      const filePath = path.resolve(
        __dirname,
        `../../assets/${folder}/${file?.filename}`
      );
      await fs.unlink(filePath);
    }
  }

  static async isUserByPhoneNumberAvailable(
    res: Response,
    phone_number: string
  ) {
    try {
      const user = await Users.findOne({
        where: {
          phone_number,
        },
      });

      if (user?.phone_number) {
        return true;
      }

      return false;
    } catch (error) {
      return res.json({
        code: 500,
        message: 'Что-то пошло не так!',
      });
    }
  }

  static async isUserCredentialCorrect(
    res: Response,
    phone_number: string,
    password: string
  ) {
    try {
      const user = await Users.findOne({
        where: {
          phone_number,
        },
      });

      if (user?.phone_number) {
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          return user;
        }
        return null; // Passwords do not match
      }

      return null; // user not found
    } catch (error: any) {
      return res.json({
        code: 500,
        message: 'Что-то пошло не так!',
      });
    }
  }
}
