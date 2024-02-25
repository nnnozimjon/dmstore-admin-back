import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

export const otpRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // Allow only 1 request per minute
  keyGenerator: (req: Request) => req.body.phone_number, // Use phone_number as the key
  handler: (req: Request, res: Response, next: NextFunction) => {
    res.status(429).json({
      code: 429,
      message: 'Слишком много запросов. Попробуйте еще раз через минуту!',
    });
  },
});
