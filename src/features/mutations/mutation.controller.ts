import { Request, Response } from 'express';
import * as mutationService from './mutation.service';

export const createNewMutation = async (req: Request, res: Response) => {
  try {
    const { type, itemId, qty, sourceRackId, destinationRackId, notes } = req.body;

    const userId = (req as any).user?.id || (req as any).userId; 

    const mutationType = type === 'TRANSFER' ? 'MOVE' : type;

    let primaryLocationId = type === 'IN' ? destinationRackId : sourceRackId;

    const result = await mutationService.processMutation({
      itemId: itemId,
      locationId: primaryLocationId,
      destinationLocationId: destinationRackId,
      type: mutationType,
      quantity: Number(qty),
      referenceDoc: notes,
      userId: userId,
    });
    res.status(201).json({ 
      success: true, 
      data: result, 
      message: `Mutasi ${result.type} berhasil, stok telah diupdate!` 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Gagal memproses mutasi stok', error });
  }
};

export const getAllMutations = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string || '';

    const result = await mutationService.getMutations(page, limit, search);
    
    const formattedMutations = result.data.map((mut: any) => ({
      id: mut.id,
      type: mut.type === 'MOVE' ? 'TRANSFER' : mut.type, 
      itemId: mut.itemId,
      qty: mut.quantity,
      notes: mut.referenceDoc,
      createdAt: mut.timestamp, 
      item: mut.item,
      sourceRack: mut.originLocation ? { code: mut.originLocation.code, warehouse: { name: mut.originLocation.warehouse?.name || 'Tidak diketahui' } } : null,
      destinationRack: mut.destinationLocation ? { code: mut.destinationLocation.code, warehouse: { name: mut.destinationLocation.warehouse?.name || 'Tidak diketahui' } } : null,
      user: mut.user
    }));

    return res.status(200).json({ success: true, data: formattedMutations, meta: result.meta });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};