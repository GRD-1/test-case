import { ExecutionContext } from '@nestjs/common';
import { RequestInterface } from '@/types/request.type';

interface MockRequest extends RequestInterface {
  headers: {
    authorization?: string;
  };
}

export const requestMock = {
  headers: {},
} as MockRequest;

export const contextMock = {
  switchToHttp: () => ({
    getRequest: () => requestMock,
  }),
} as unknown as ExecutionContext;

export const mockTokenPayload = {
  sub: 'user-id',
  jti: 'jti',
  exp: 3600,
};
