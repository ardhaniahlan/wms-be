import prisma from '../../config/database';

export const getWarehouses = async () => {
  return await prisma.warehouse.findMany();
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