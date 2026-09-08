import prisma from "../../config/database";

export const getPublicCatalog = async (page: number = 1, limit: number = 12, search: string = '') => {
  const skip = (page - 1) * limit;

  const searchQuery = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { category: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [items, totalItems] = await Promise.all([
    prisma.item.findMany({
      where: searchQuery,
      skip: skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        inventoryLevels: {
          include: {
            location: {
              include: { warehouse: true }
            }
          }
        }
      }
    }),
    prisma.item.count({ where: searchQuery })
  ]);

  const formattedData = items.map(item => {
    const totalStock = item.inventoryLevels.reduce((sum, inv) => sum + inv.quantity, 0);
    
    const locations = item.inventoryLevels.map(inv => ({
      warehouse: inv.location?.warehouse?.name || 'Gudang Utama',
      rack: inv.location?.code || '-',
      qty: inv.quantity
    })).filter(loc => loc.qty > 0);

    return {
      id: item.id,
      sku: item.sku,
      name: item.name,
      category: item.category || 'Umum',
      totalStock: totalStock,
      locations: locations
    };
  });

  return {
    data: formattedData,
    meta: { totalItems, currentPage: page, totalPages: Math.ceil(totalItems / limit), limit }
  };
};
