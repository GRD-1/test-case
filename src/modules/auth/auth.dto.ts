import { IsEmail, IsJWT, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/modules/user/user.dto';
import { INVALID_PASSWORD_ERR_MSG } from '@/constants/messages.constants';
import { PASSWORD_REGEX } from '@/constants/regexp.constants';

export class SignUpDto extends UserDto {
  @ApiProperty({ description: 'application domain', nullable: true })
  @IsOptional()
  readonly domain?: string;

  @ApiProperty({ description: 'user password', nullable: false, example: 'Password88' })
  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, { message: INVALID_PASSWORD_ERR_MSG })
  readonly password: string;
}

export class SignInDto {
  @ApiProperty({ description: 'email', nullable: false })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'application domain', nullable: true })
  @IsOptional()
  readonly domain?: string;
}

export class TokensDto {
  @ApiProperty({ description: 'access token', nullable: false })
  @IsJWT()
  readonly accessToken: string;

  @ApiProperty({ description: 'refresh token', nullable: false })
  @IsJWT()
  readonly refreshToken: string;
}
