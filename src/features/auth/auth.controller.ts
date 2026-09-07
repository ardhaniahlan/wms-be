import { Request, Response } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const newUser = await authService.registerUser(req.body);
    res.status(201).json({ success: true, message: 'Registrasi berhasil', data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Gagal registrasi (Email mungkin sudah dipakai)' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, message: 'Login berhasil', data: { user } });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};