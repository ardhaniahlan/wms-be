import prisma from '../../config/database';

export const getLocations = async () => {
  return await prisma.location.findMany({
    include: {
      warehouse: true,
    }
  });
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