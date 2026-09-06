import { Request, Response } from 'express';
import * as inventoryService from './inventory.service';

export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const inventories = await inventoryService.getInventoryLevels();
    res.status(200).json({ success: true, data: inventories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data stok', error });
  }
};