// src/features/inventories/inventory.service.ts
import prisma from '../../config/database';

export const getInventoryLevels = async () => {
  return await prisma.inventoryLevel.findMany({
    include: {
      item: true,
      location: true,
    }
  });
};