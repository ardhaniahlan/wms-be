import prisma from '../../config/database';

export const getItems = async (page: number = 1, limit: number = 10, search: string = '') => {
  const skip = (page - 1) * limit;

  const searchQuery = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { sku: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [data, totalItems] = await Promise.all([
    prisma.item.findMany({
      where: searchQuery,
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.item.count({ where: searchQuery })
  ]);

  return {
    data,
    meta: { totalItems, currentPage: page, totalPages: Math.ceil(totalItems / limit), limit }
  };
};

export const getItemById = async (id: string) => {
  const item = await prisma.item.findUnique({
    where: { id: id },
  });

  if (!item) {
    throw new Error("Barang tidak ditemukan");
  }

  return item;
};

export const createItem = async (data: { sku: string; name: string; category:string; baseUnit: string; attributes: any }) => {
  return await prisma.item.create({
    data: {
      sku: data.sku,
      name: data.name,
      category: data.category,
      baseUnit: data.baseUnit,
      attributes: data.attributes,
    },
  });
};

export const updateItem = async (
  id: string, 
  data: { sku?: string; name?: string; category?: string; baseUnit?: string; attributes?: any }
) => {
  return await prisma.item.update({
    where: { id },
    data,
  });
};

export const deleteItem = async (id: string) => {
  return await prisma.item.delete({
    where: { id },
  });
};