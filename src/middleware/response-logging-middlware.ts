import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';
import dayjs from 'dayjs';

@Injectable()
export class ResponseLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const originalSend = res.send;
    res.send = (body): Response => {
      const logger = new Logger('HttpResponse');
      const timeStamp = dayjs(Date.now()).format('HH:mm:ss:SSS');
      const msg = `time: ${timeStamp}; method: ${req.method} ${req.originalUrl}; statusCode: ${res.statusCode}`;

      logger.log(msg);

      return originalSend.apply(res, [body]);
    };
    next();
  }
}
