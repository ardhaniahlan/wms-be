import { Router } from 'express';
import { getAllItems, createNewItem, updateItemById, deleteItemById, getItemById } from './item.controller';

const router = Router();
router.get('/', getAllItems);
router.post('/', createNewItem);
router.get('/:id', getItemById);
router.patch('/:id', updateItemById);
router.delete('/:id', deleteItemById);

export default router;