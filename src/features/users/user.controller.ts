import { Request, Response } from 'express';
import * as userService from './user.service';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data user', error });
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newUser = await userService.createUser(body);
    res.status(201).json({ success: true, data: newUser, message: 'Karyawan berhasil didaftarkan' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Gagal mendaftarkan karyawan', error });
  }
};