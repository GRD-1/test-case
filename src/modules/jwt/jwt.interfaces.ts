import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export enum TokenTypeEnum {
  ACCESS = 'access',
  REFRESH = 'refresh',
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'resetPassword',
}

export interface ICustomFields {
  version: number;
}

export interface IGenerateTokenAsyncArgs {
  customFields: ICustomFields;
  secret: string;
  options: jwt.SignOptions;
}

export interface IVerifyTokenArgs {
  token: string;
  secret: string;
  options: jwt.VerifyOptions;
}

export interface IGenerateTokenArgs {
  userId: string;
  version: number;
  tokenType: TokenTypeEnum;
  domain?: string | null;
  tokenId?: string;
}

export interface CustomJwtPayload extends JwtPayload {
  iss: string;
  sub: string;
  exp: number;
  jti: string;
  version: number;
}
