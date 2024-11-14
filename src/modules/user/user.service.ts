import { Injectable } from '@nestjs/common';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { IUpdateUser } from '@/modules/user/user.interface';
import { UserEntity } from './user.entity';
import { DELETE_USER_MSG } from '@/constants/messages.constants';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async findOneById(id: string): Promise<UserEntity> {
    return this.userRepo.findOneByIdOrThrow(id);
  }

  async update(id: string, payload: IUpdateUser): Promise<UserEntity> {
    return this.userRepo.update(id, payload);
  }

  public async delete(userId: string): Promise<string> {
    await this.userRepo.delete(userId);

    return DELETE_USER_MSG;
  }
}
