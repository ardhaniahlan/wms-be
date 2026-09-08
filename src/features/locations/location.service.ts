import prisma from '../../config/database';

export const getLocations = async (page: number = 1, limit: number = 10, search: string = '') => {
  const skip = (page - 1) * limit;

  const searchQuery = search ? {
    OR: [
      { code: { contains: search, mode: 'insensitive' as const } },
      { warehouse: { name: { contains: search, mode: 'insensitive' as const } } }
    ]
  } : {};

  const [data, totalItems] = await Promise.all([
    prisma.location.findMany({
      where: searchQuery,
      skip: skip,
      take: limit,
      include: {
        warehouse: true,
      },
      orderBy: { code: 'asc' }
    }),
    prisma.location.count({ where: searchQuery })
  ]);

  return {
    data,
    meta: { totalItems, currentPage: page, totalPages: Math.ceil(totalItems / limit), limit }
  };
};

export const getByLocationById = async (id: string) => {
  return await prisma.location.findUnique({
    where: { id }
  });
};

export const createLocation = async (data: { warehouseId: string; code: string; description?: string }) => {
  return await prisma.location.create({
    data: {
      warehouseId: data.warehouseId,
      code: data.code,
      description: data.description,
    },
  });
};

export const updateLocation = async (
  id: string, 
  data: { warehouseId?: string; code?: string; description?: string }
) => {
  return await prisma.location.update({
    where: { id },
    data,
  });
};

export const deleteLocation = async (id: string) => {
  return await prisma.location.delete({
    where: { id },
  });
};