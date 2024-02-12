import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { secretKey } from '@utils/secret-key';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ code: 403, message: 'Forbidden' });
    }
    console.log('user', user);

    next();
  });
};
