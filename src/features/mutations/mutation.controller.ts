import { Request, Response } from 'express';
import * as mutationService from './mutation.service';

export const createNewMutation = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = await mutationService.processMutation(body);
    res.status(201).json({ 
      success: true, 
      data: result, 
      message: `Mutasi ${body.type} berhasil, stok telah diupdate!` 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Gagal memproses mutasi stok', error });
  }
};