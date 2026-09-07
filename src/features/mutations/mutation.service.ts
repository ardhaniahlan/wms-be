import prisma from '../../config/database';
import { MutationType } from '@prisma/client';

export const getMutations = async () => {
  return await prisma.mutation.findMany({
    orderBy: {
      timestamp: 'desc', 
    },
    include: {
      item: {
        select: {
          sku: true,
          name: true,
          baseUnit: true,
        }
      },
      originLocation: { 
        select: {
          code: true,
          warehouse: { 
            select: { name: true } 
          }
        }
      },
      destinationLocation: { 
        select: {
          code: true,
          warehouse: { 
            select: { name: true } 
          }
        }
      },
      user: { 
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
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