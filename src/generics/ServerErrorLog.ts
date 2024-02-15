import { Response } from 'express';

export const ServerErrorLog = (res: Response, message?: string) => {
  return res.json({
    code: 500,
    message: message || 'Что-то пошло не так!',
  });
};
