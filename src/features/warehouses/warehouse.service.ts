import prisma from '../../config/database';

export const getWarehouses = async (page: number = 1, limit: number = 10, search: string = '') => {
  const skip = (page - 1) * limit;

  const searchQuery = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { code: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [data, totalItems] = await Promise.all([
    prisma.warehouse.findMany({
      where: searchQuery,
      skip: skip,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    prisma.warehouse.count({ where: searchQuery })
  ]);

  return {
    data,
    meta: { totalItems, currentPage: page, totalPages: Math.ceil(totalItems / limit), limit }
  };
};

export const createWarehouse = async (data: { code: string; name: string; address?: string }) => {
  return await prisma.warehouse.create({
    data: {
      code: data.code,
      name: data.name,
      address: data.address,
    },
  });
};

export const updateWarehouse = async (
  id: string, 
  data: { code?: string; name?: string; address?: string }
) => {
  return await prisma.warehouse.update({
    where: { id },
    data,
  });
};

export const deleteWarehouse = async (id: string) => {
  return await prisma.warehouse.delete({
    where: { id },
  });
};

export const getWarehouseById = async (id: string) => {
  return await prisma.warehouse.findUnique({
    where: { id }
  });
};