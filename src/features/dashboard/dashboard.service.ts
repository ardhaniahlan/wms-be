import prisma from '../../config/database';

export const getDashboardMetrics = async () => {
  const [
    totalItems,
    totalWarehouses,
    lowStockCount,
    recentMutations
  ] = await Promise.all([
    prisma.item.count(),
    prisma.warehouse.count(),
    prisma.inventoryLevel.count({ where: { quantity: { lte: 10 } } }),
    prisma.mutation.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
      include: { 
        item: { select: { name: true, sku: true } },
        user: { select: { name: true } }
      }
    })
  ]);

  return {
    totalItems,
    totalWarehouses,
    lowStockCount,
    recentMutations
  };
};