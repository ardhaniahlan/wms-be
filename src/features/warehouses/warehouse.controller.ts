import { Request, Response } from 'express';
import * as warehouseService from './warehouse.service';

export const getAllWarehouses = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string || '';

    const result = await warehouseService.getWarehouses(page, limit, search);
    return res.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNewWarehouse = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newWarehouse = await warehouseService.createWarehouse(body);
    res.status(201).json({ success: true, data: newWarehouse, message: 'Gudang berhasil ditambahkan' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Gagal membuat gudang (Kode mungkin duplikat)', error });
  }
};

export const updateWarehouseById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body;
    
    const updatedWarehouse = await warehouseService.updateWarehouse(id, body);
    res.status(200).json({ success: true, data: updatedWarehouse, message: 'Data gudang berhasil diubah' });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Gagal mengubah, gudang tidak ditemukan', error });
  }
};

export const deleteWarehouseById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    await warehouseService.deleteWarehouse(id);
    res.status(200).json({ success: true, message: 'Data gudang berhasil dihapus' });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Gagal menghapus, gudang tidak ditemukan', error });
  }
};

export const getWarehousesById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const warehouses = await warehouseService.getWarehouseById(id);
    res.status(200).json({ success: true, data: warehouses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data gudang', error });
  }
};

