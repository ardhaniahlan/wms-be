import { Request, Response } from 'express';
import { getPublicCatalog } from './catalog.service';

export const getCatalog = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = req.query.search as string || '';

    const result = await getPublicCatalog(page, limit, search);
    return res.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};