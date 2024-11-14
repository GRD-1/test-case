import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/custom-error.registry';
import { AuthService } from '@/modules/auth/auth.service';
import { LOGOUT_MSG } from '@/constants/messages.constants';
import { SignInDto, SignUpDto, TokensDto } from '@/modules/auth/auth.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { TokenPayload } from '@/decorators/token-payload.decorator';
import { CustomJwtPayload } from '@/modules/jwt/jwt.interfaces';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'User created', schema: { example: '530350e2-cc3f-40fb-b82e-7e4241a3c03b' } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiResponse({ status: 422, description: 'Unique key violation', schema: { example: CCBK_ERR_TO_HTTP.CCBK06 } })
  async signUp(@Body() payload: SignUpDto): Promise<string> {
    return this.authService.signUp(payload);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'The user is logged in', type: TokensDto })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  @ApiUnauthorizedResponse({ description: 'Authorisation failed', schema: { example: CCBK_ERR_TO_HTTP.CCBK08 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async signIn(@Body() payload: SignInDto): Promise<TokensDto> {
    return this.authService.signIn(payload.email, payload.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out of the system' })
  @ApiBody({ type: TokensDto })
  @ApiOkResponse({ description: 'The user has been logged out', schema: { example: LOGOUT_MSG } })
  @ApiUnauthorizedResponse({ description: 'Invalid token', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  async logout(@Body() payload: TokensDto): Promise<string> {
    return this.authService.logout(payload.accessToken, payload.refreshToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a new couple of tokens' })
  @ApiOkResponse({ description: 'The tokens have been refreshed', type: TokensDto })
  @ApiUnauthorizedResponse({ description: 'Invalid token', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  async refreshTokens(@TokenPayload() tokenPayload: CustomJwtPayload): Promise<TokensDto> {
    return this.authService.refreshTokens(tokenPayload);
  }
}
