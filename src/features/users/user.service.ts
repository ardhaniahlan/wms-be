import prisma from '../../config/database';

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const createUser = async (data: { name: string; role: string }) => {
  return await prisma.user.create({
    data: {
      name: data.name,
      role: data.role,
    },
  });
};