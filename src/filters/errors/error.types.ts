import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class CustomError extends Error {
  constructor(public code: string, public message: string, public cause?: string) {
    super(message);
    this.name = 'CustomError';
  }
}

export interface ErrorToHttpInterface {
  error: boolean;
  statusCode: HttpStatus;
  errorMsg: string;
}

export type GlobalExceptionType = Error | CustomError | HttpException | Prisma.PrismaClientKnownRequestError;
