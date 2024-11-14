import { IUpdateUser } from '@/modules/user/user.interface';
import { UserEntity } from '@/modules/user/user.entity';

export const mockUserRepo = {
  findOneByIdOrThrow: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const userId = 'mock-uuid';

export const userData = { id: userId, email: 'johndoe@example.com', nickname: 'John Doe' } as UserEntity;

export const updatePayload: IUpdateUser = { nickname: 'Updated nickname' };
