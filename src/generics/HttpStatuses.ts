import { Response } from 'express';

export const StatusServerError = (res: Response, message?: string) => {
  res.status(500).json({
    code: 500,
    message: message || 'Что-то пошло не так!',
  });
};

export const Status400 = (res: Response, message?: string) => {
  res.status(400).json({
    code: 400,
    message:
      message ||
      'Запрос был сформирован некорректно. Проверьте ваши параметры запроса и повторите попытку!',
  });
};

export const Status200 = (
  res: Response,
  message?: string | null,
  args?: any
) => {
  res.status(200).json({
    code: 200,
    message: message || 'Запрос был успешно выполнен!',
    ...args,
  });
};
