import { Request, Response } from 'express';
import * as inventoryService from './inventory.service';

export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string || '';

    const result = await inventoryService.getInventoryLevels(page, limit, search);

    return res.status(200).json({
      success: true,
      message: 'Data stok berhasil diambil',
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};