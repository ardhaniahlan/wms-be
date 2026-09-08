import { Request, Response } from 'express';
import * as locationService from './location.service';

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string || '';

    const result = await locationService.getLocations(page, limit, search);
    return res.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNewLocation = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newLocation = await locationService.createLocation(body);
    res.status(201).json({ success: true, data: newLocation, message: 'Lokasi rak berhasil ditambahkan' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Gagal membuat lokasi (Kode mungkin duplikat atau Warehouse ID salah)', error });
  }
};

export const updateLocationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body;
    
    const updatedLocation = await locationService.updateLocation(id, body);
    res.status(200).json({ success: true, data: updatedLocation, message: 'Data lokasi rak berhasil diubah' });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Gagal mengubah, lokasi rak tidak ditemukan', error });
  }
};

export const deleteLocationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    await locationService.deleteLocation(id);
    res.status(200).json({ success: true, message: 'Data lokasi rak berhasil dihapus' });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Gagal menghapus, lokasi rak tidak ditemukan', error });
  }
};

export const getLocationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const data = await locationService.getByLocationById(id);
    res.status(200).json({ success: true, data: data, message: 'Data lokasi rak berhasil ditemukan' });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Gagal mengubah, lokasi rak tidak ditemukan', error });
  }
};