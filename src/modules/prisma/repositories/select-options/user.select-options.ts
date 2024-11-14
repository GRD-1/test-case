export const USER_SELECT_OPTIONS = {
  id: true,
  email: true,
  nickname: true,
  avatar: true,
};

export const USER_WITH_CREDENTIALS_SELECT_OPTIONS = {
  id: true,
  email: true,
  nickname: true,
  avatar: true,
  credentials: {
    select: {
      userId: true,
      password: true,
      version: true,
      lastPassword: true,
      updatedAt: true,
    },
  },
};
