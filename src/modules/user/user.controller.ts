import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto, UserRespDto } from '@/modules/user/user.dto';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/custom-error.registry';
import { UserId } from '@/decorators/user-id.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { UserService } from './user.service';
import { DELETE_USER_MSG } from '@/constants/messages.constants';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user data' })
  @ApiOkResponse({ description: 'The user has been found', type: UserRespDto })
  @ApiUnauthorizedResponse({ description: 'Authorization is required', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  async findOneById(@UserId() userId: string): Promise<UserRespDto> {
    return this.userService.findOneById(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a user data' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'The user has been updated', type: UserRespDto })
  @ApiBadRequestResponse({ description: 'Invalid user data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiUnauthorizedResponse({ description: 'Authorization is required', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  async update(@UserId() userId: string, @Body() payload: UpdateUserDto): Promise<UserRespDto> {
    return this.userService.update(userId, payload);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'The user has been deleted', schema: { example: DELETE_USER_MSG } })
  @ApiUnauthorizedResponse({ description: 'Authorization is required', schema: { example: [CCBK_ERR_TO_HTTP.CCBK02] } })
  @ApiForbiddenResponse({ description: 'Access denied', schema: { example: CCBK_ERR_TO_HTTP.CCBK03 } })
  async delete(@UserId() userId: string): Promise<string> {
    return this.userService.delete(userId);
  }
}
