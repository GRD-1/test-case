import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CustomError, ErrorToHttpInterface, GlobalExceptionType } from '@/filters/errors/error.types';
import { PRISMA_ERR_TO_HTTP } from '@/filters/errors/prisma-error.registry';
import { CCBK_ERR_TO_HTTP, CCBK_ERROR_CODES } from '@/filters/errors/custom-error.registry';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: GlobalExceptionType, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    let responsePayload: ErrorToHttpInterface = { ...CCBK_ERR_TO_HTTP[CCBK_ERROR_CODES.INTERNAL_SERVER_ERROR] };
    let tempErrorPayload: ErrorToHttpInterface;

    switch (true) {
      case exception instanceof CustomError:
        responsePayload = { ...CCBK_ERR_TO_HTTP[(exception as CustomError).code] };
        responsePayload.errorMsg = `${responsePayload.errorMsg}: ${(exception as CustomError).message}`;

        this.logger.error(exception.stack, exception.cause);
        break;

      case exception instanceof HttpException:
        responsePayload.statusCode = (exception as HttpException).getStatus();
        responsePayload.errorMsg = (exception as HttpException).message;
        if (responsePayload.statusCode === HttpStatus.NOT_FOUND) {
          responsePayload.errorMsg = `The path was not found: ${responsePayload.errorMsg}`;
        }
        this.logger.error(exception.stack);
        break;

      case exception instanceof Prisma.PrismaClientKnownRequestError:
        tempErrorPayload = PRISMA_ERR_TO_HTTP[(exception as Prisma.PrismaClientKnownRequestError).code];
        if (tempErrorPayload) {
          responsePayload = { ...tempErrorPayload };
        }
        this.logger.error({ ...exception }, 'Prisma query failed!');
        break;

      case exception instanceof Prisma.PrismaClientValidationError:
        this.logger.error({ ...exception }, 'Prisma validation error!');
        break;

      default:
        this.logger.error(exception.stack);
        break;
    }

    response.status(responsePayload.statusCode).send(responsePayload);
  }
}
