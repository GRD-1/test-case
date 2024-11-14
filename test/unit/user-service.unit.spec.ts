import { UserService } from '@/modules/user/user.service';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { DELETE_USER_MSG } from '@/constants/messages.constants';
import { mockUserRepo, updatePayload, userData, userId } from '@/unit/_fixtures/user.fixture';

describe('UserService tests', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockUserRepo as unknown as UserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneById', () => {
    it('should return a user data by id', async () => {
      (mockUserRepo.findOneByIdOrThrow as jest.Mock).mockResolvedValue(userData);

      const result = await userService.findOneById(userId);

      expect(mockUserRepo.findOneByIdOrThrow).toHaveBeenCalledWith(userId);
      expect(result).toEqual(userData);
    });

    it('should throw an error if user is not found', async () => {
      (mockUserRepo.findOneByIdOrThrow as jest.Mock).mockRejectedValue(new Error('User not found'));

      await expect(userService.findOneById(userId)).rejects.toThrow('User not found');
      expect(mockUserRepo.findOneByIdOrThrow).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated data', async () => {
      const updatedUserEntity = { ...userData, ...updatePayload };
      (mockUserRepo.update as jest.Mock).mockResolvedValue(updatedUserEntity);

      const result = await userService.update(userId, updatePayload);

      expect(mockUserRepo.update).toHaveBeenCalledWith(userId, updatePayload);
      expect(result).toEqual(updatedUserEntity);
    });

    it('should throw an error if update fails', async () => {
      (mockUserRepo.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

      await expect(userService.update(userId, updatePayload)).rejects.toThrow('Update failed');
      expect(mockUserRepo.update).toHaveBeenCalledWith(userId, updatePayload);
    });
  });

  describe('delete', () => {
    it('should delete a user and return a success message', async () => {
      (mockUserRepo.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await userService.delete(userId);

      expect(mockUserRepo.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(DELETE_USER_MSG);
    });

    it('should throw an error if delete fails', async () => {
      (mockUserRepo.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      await expect(userService.delete(userId)).rejects.toThrow('Delete failed');
      expect(mockUserRepo.delete).toHaveBeenCalledWith(userId);
    });
  });
});
