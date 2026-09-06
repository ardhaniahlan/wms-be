import prisma from '../../config/database';

export const getItems = async () => {
  return await prisma.item.findMany();
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