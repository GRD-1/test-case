import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@/modules/jwt/jwt.service';
import { CustomJwtPayload, TokenTypeEnum } from '@/modules/jwt/jwt.interfaces';
import { IAuthResult, IGenerateTokenArgs, IUserWithPassword } from '@/modules/auth/auth.interfaces';
import {
  EMAIL_OCCUPIED_ERR_MSG,
  INVALID_CREDENTIALS_ERR_MSG,
  INVALID_TOKEN_ERR_MSG,
  LOGOUT_MSG,
  NOT_FOUND_ERR_MSG,
  SUSPICIOUS_TOKEN_ERR_MSG,
  USED_PASSWORD_ERR_MSG,
} from '@/constants/messages.constants';
import { compare, hash } from 'bcrypt';
import { CustomError } from '@/filters/errors/error.types';
import { CCBK_ERROR_CODES } from '@/filters/errors/custom-error.registry';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { CredentialsEntity } from '@/modules/user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService, private readonly userRepo: UserRepo) {}

  public async signUp(userData: IUserWithPassword): Promise<string> {
    const { email, nickname, avatar, password } = userData;
    const hashedPass = await hash(password, 10);

    const emailIsOccupied = await this.userRepo.findOneByEmail(email);
    if (emailIsOccupied) {
      throw new CustomError(CCBK_ERROR_CODES.UNIQUE_VIOLATION, EMAIL_OCCUPIED_ERR_MSG);
    }

    const user = await this.userRepo.create({ email, avatar, password: hashedPass, nickname });

    return user.id;
  }

  public async signIn(email: string, password: string, domain?: string): Promise<IAuthResult> {
    const { id, credentials } = await this.userRepo.findOneWithCredentialsByEmail(email);
    this.checkCredentialsExistence(credentials);
    const version = credentials.version;

    await this.validatePassword(credentials.password, password);

    return this.generateAuthTokens({ userId: id, version, domain });
  }

  private async generateAuthTokens(args: IGenerateTokenArgs): Promise<IAuthResult> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.ACCESS }),
      this.jwtService.generateToken({ ...args, tokenType: TokenTypeEnum.REFRESH }),
    ]);

    return { accessToken, refreshToken };
  }

  private checkCredentialsExistence(value: CredentialsEntity | null): asserts value is CredentialsEntity {
    if (!value) {
      throw new CustomError(CCBK_ERROR_CODES.RECORD_NOT_FOUND, NOT_FOUND_ERR_MSG);
    }
  }

  public async logout(accessToken: string, refreshToken: string): Promise<string> {
    const { jti: refreshId, exp: refExp } = await this.jwtService.verifyToken(refreshToken, TokenTypeEnum.REFRESH);
    const { jti: accessId, exp: accExp } = await this.jwtService.decodeJwt(accessToken);

    await this.jwtService.blacklistToken(refreshId, refExp);
    await this.jwtService.blacklistToken(accessId, accExp);

    return LOGOUT_MSG;
  }

  public async validatePassword(storedPassword: string, password: string, isPasswordNew?: boolean): Promise<string> {
    const passwordHash = await hash(password, 10);
    const isEqual = await compare(password, storedPassword);
    const invalidPassword = isPasswordNew ? isEqual : !isEqual;
    if (invalidPassword) {
      if (isPasswordNew) {
        throw new CustomError(CCBK_ERROR_CODES.BAD_REQUEST, USED_PASSWORD_ERR_MSG);
      } else {
        throw new CustomError(CCBK_ERROR_CODES.INVALID_CREDENTIALS, INVALID_CREDENTIALS_ERR_MSG);
      }
    }

    return passwordHash;
  }

  public async refreshTokens(tokenPayload: CustomJwtPayload): Promise<IAuthResult> {
    const { sub: userId, version, jti, exp } = tokenPayload;

    const user = await this.userRepo.findOneById(userId);
    if (!user || !user.credentials) {
      this.logger.error(SUSPICIOUS_TOKEN_ERR_MSG);
      throw new CustomError(CCBK_ERROR_CODES.UNAUTHORIZED, INVALID_TOKEN_ERR_MSG);
    }
    if (user.credentials.version !== version) {
      await this.jwtService.blacklistToken(jti, exp);
      throw new CustomError(CCBK_ERROR_CODES.UNAUTHORIZED, INVALID_TOKEN_ERR_MSG);
    }

    return this.generateAuthTokens({ userId, version });
  }
}
