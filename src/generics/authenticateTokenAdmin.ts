import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Users } from 'models/users-model';

import { secretKey } from '@utils/secret-key';

export const authenticateTokenAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ code: 401, message: 'Неавторизованный' });
  }

  jwt.verify(token, secretKey, async (err, user: any) => {
    if (err) {
      return res.status(403).json({ code: 403, message: 'Запрещено' });
    }

    const id = user.id;
    const isUser = await Users.findOne({ where: { id, user_role: 'admin' } });

    if (!isUser) {
      return res.status(401).json({ code: 401, message: 'Неавторизованный' });
    }

    (req as any).user = user;

    next();
  });
};
