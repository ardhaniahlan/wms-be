import { Request, Response } from 'express';
import { getDashboardMetrics } from './dashboard.service';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const metrics = await getDashboardMetrics();
    return res.status(200).json({ success: true, data: metrics });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};