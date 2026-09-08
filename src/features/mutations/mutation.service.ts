import prisma from '../../config/database';
import { MutationType } from '@prisma/client';

export const getMutations = async (page: number = 1, limit: number = 10, search: string = '') => {
  const skip = (page - 1) * limit;

  const searchQuery = search ? {
    OR: [
      { item: { name: { contains: search, mode: 'insensitive' as const } } },
      { referenceDoc: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [data, totalItems] = await Promise.all([
    prisma.mutation.findMany({
      where: searchQuery,
      skip: skip,
      take: limit,
      orderBy: {
        timestamp: 'desc', 
      },
      include: {
        item: {
          select: { sku: true, name: true, baseUnit: true }
        },
        originLocation: { 
          select: { code: true, warehouse: { select: { name: true } } }
        },
        destinationLocation: { 
          select: { code: true, warehouse: { select: { name: true } } }
        },
        user: { 
          select: { id: true, name: true, email: true }
        }
      }
    }),
    prisma.mutation.count({ where: searchQuery })
  ]);

  return {
    data,
    meta: { totalItems, currentPage: page, totalPages: Math.ceil(totalItems / limit), limit }
  };
};

export const processMutation = async (data: {
  itemId: string;
  locationId: string;
  destinationLocationId?: string;
  type: MutationType;
  quantity: number;
  referenceDoc?: string;
  userId: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    
    const mutation = await tx.mutation.create({
      data: {
        itemId: data.itemId,
        locationId: data.locationId,
        destinationLocationId: data.destinationLocationId,
        type: data.type,
        quantity: data.quantity,
        referenceDoc: data.referenceDoc,
        userId: data.userId,
      }
    });

    if (data.type === 'MOVE') {
      if (!data.destinationLocationId) {
        throw new Error('Untuk mutasi MOVE, destinationLocationId wajib diisi!');
      }

      await tx.inventoryLevel.update({
        where: {
          itemId_locationId: { itemId: data.itemId, locationId: data.locationId }
        },
        data: { quantity: { decrement: data.quantity } }
      });

      await tx.inventoryLevel.upsert({
        where: {
          itemId_locationId: { itemId: data.itemId, locationId: data.destinationLocationId }
        },
        update: { quantity: { increment: data.quantity } },
        create: { itemId: data.itemId, locationId: data.destinationLocationId, quantity: data.quantity }
      });

    } else {
      const qtyChange = (data.type === 'IN' || data.type === 'ADJUST') ? data.quantity : -data.quantity;

      await tx.inventoryLevel.upsert({
        where: {
          itemId_locationId: { itemId: data.itemId, locationId: data.locationId }
        },
        update: { quantity: { increment: qtyChange } },
        create: { itemId: data.itemId, locationId: data.locationId, quantity: data.quantity }
      });
    }

    return mutation;
  });
};