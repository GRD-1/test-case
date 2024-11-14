import { AuthGuard } from '@/guards/auth.guard';
import { JwtService } from '@/modules/jwt/jwt.service';
import { CustomError } from '@/filters/errors/error.types';
import { TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { CCBK_ERROR_CODES } from '@/filters/errors/custom-error.registry';
import { INVALID_TOKEN_ERR_MSG, UNAUTHORIZED_ERR_MSG } from '@/constants/messages.constants';
import { contextMock, mockTokenPayload, requestMock } from '@/unit/_fixtures/auth-guard.fixture';

describe('AuthGuard tests', () => {
  let authGuard: AuthGuard;
  let jwtServiceMock: JwtService;

  beforeEach(() => {
    jwtServiceMock = {
      verifyToken: jest.fn(),
      isTokenBlacklisted: jest.fn(),
    } as unknown as JwtService;

    authGuard = new AuthGuard(jwtServiceMock);
  });

  it('should throw an error if authorization header is missing', async () => {
    await expect(authGuard.canActivate(contextMock)).rejects.toThrowError(
      new CustomError(CCBK_ERROR_CODES.UNAUTHORIZED, UNAUTHORIZED_ERR_MSG),
    );
  });

  it('should validate token and set request user if valid JWT is provided', async () => {
    requestMock.headers.authorization = 'Bearer valid-jwt-token';

    (jwtServiceMock.verifyToken as jest.Mock).mockResolvedValue(mockTokenPayload);
    (jwtServiceMock.isTokenBlacklisted as jest.Mock).mockResolvedValue(false);

    const result = await authGuard.canActivate(contextMock);

    expect(result).toBe(true);
    expect(requestMock.user).toEqual({ id: mockTokenPayload.sub });
    expect(requestMock.tokenPayload).toBe(mockTokenPayload);
    expect(jwtServiceMock.verifyToken).toHaveBeenCalledWith('valid-jwt-token', TokenTypeEnum.ACCESS);
    expect(jwtServiceMock.isTokenBlacklisted).toHaveBeenCalledWith(mockTokenPayload.jti);
  });

  it('should throw an error if JWT is invalid', async () => {
    requestMock.headers.authorization = 'Bearer invalid-jwt-token';

    (jwtServiceMock.verifyToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    await expect(authGuard.canActivate(contextMock)).rejects.toThrowError(
      new CustomError(CCBK_ERROR_CODES.UNAUTHORIZED, INVALID_TOKEN_ERR_MSG),
    );
    expect(jwtServiceMock.verifyToken).toHaveBeenCalledWith('invalid-jwt-token', TokenTypeEnum.ACCESS);
  });
});
