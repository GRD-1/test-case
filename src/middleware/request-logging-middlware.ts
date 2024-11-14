import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dayjs from 'dayjs';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.json()(req, res, () => {
      const logger = new Logger('HttpRequest');
      const timeStamp = dayjs(Date.now()).format('HH:mm:ss:SSS');
      const msg = `time: ${timeStamp}; method: ${req.method} ${req.originalUrl}`;
      logger.log(msg);
    });
    next();
  }
}
