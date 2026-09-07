import { Request, Response } from "express";
import * as itemService from "./item.service";

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await itemService.getItems();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data barang", error });
  }
};

export const createNewItem = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newItem = await itemService.createItem(body);
    res
      .status(201)
      .json({
        success: true,
        data: newItem,
        message: "Barang berhasil ditambahkan",
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Gagal membuat barang (SKU mungkin duplikat)",
        error,
      });
  }
};

export const updateItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;

    const updatedItem = await itemService.updateItem(id, data);

    return res.status(200).json({
      success: true,
      message: 'Barang berhasil diperbarui',
      data: updatedItem,
    });
  } catch (error: any) {
    console.error("ERROR SAAT UPDATE:", error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    });
  }
};

export const deleteItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await itemService.deleteItem(id);
    res
      .status(200)
      .json({ success: true, message: "Data barang berhasil dihapus" });
  } catch (error) {
    res
      .status(404)
      .json({
        success: false,
        message: "Gagal menghapus, barang tidak ditemukan",
        error,
      });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const data = await itemService.getItemById(id);
    res
      .status(200)
      .json({ success: true, data:data, message: "Data barang berhasil ditemukan" });
  } catch (error) {
    res
      .status(404)
      .json({
        success: false,
        message: "barang tidak ditemukan",
        error,
      });
  }
};
