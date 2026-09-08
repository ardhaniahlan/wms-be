import prisma from '../../config/database';

export const getInventoryLevels = async (page: number, limit: number, search: string) => {
  const skip = (page - 1) * limit;

  const searchQuery = search ? {
    OR: [
      { item: { name: { contains: search, mode: 'insensitive' as const } } },
      { item: { sku: { contains: search, mode: 'insensitive' as const } } },
      { location: { warehouse: { name: { contains: search, mode: 'insensitive' as const } } } }
    ]
  } : {};

  const [data, totalItems] = await Promise.all([
    prisma.inventoryLevel.findMany({
      where: searchQuery,
      skip: skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        item: true,
        location: { include: { warehouse: true } }
      }
    }),
    prisma.inventoryLevel.count({ where: searchQuery })
  ]);

  return {
    data,
    meta: {
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      limit,
    }
  };
};