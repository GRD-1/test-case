import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/custom-error.registry';
import { JwtService } from '@/modules/jwt/jwt.service';
import { TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { RequestInterface } from '@/types/request.type';
import { UNAUTHORIZED_ERR_MSG } from '@/constants/messages.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const authorizationHeader = request.headers.authorization;
    const tokenType = request.url === '/auth/refresh' ? TokenTypeEnum.REFRESH : TokenTypeEnum.ACCESS;

    if (!authorizationHeader) {
      throw new CustomError(CCBK_ERROR_CODES.UNAUTHORIZED, UNAUTHORIZED_ERR_MSG);
    }

    const parts = authorizationHeader.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : null;

    if (token) {
      const tokenPayload = await this.jwtService.verifyToken(token, tokenType);
      await this.jwtService.isTokenBlacklisted(tokenPayload.jti);
      request.user = { id: tokenPayload.sub };
      request.tokenPayload = tokenPayload;

      return true;
    }
    throw new CustomError(CCBK_ERROR_CODES.UNAUTHORIZED, UNAUTHORIZED_ERR_MSG);
  }
}
