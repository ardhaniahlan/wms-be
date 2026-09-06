import { Router } from 'express';
import { getAllItems, createNewItem, updateItemById, deleteItemById } from './item.controller';

const router = Router();
router.get('/', getAllItems);
router.post('/', createNewItem);
router.put('/:id', updateItemById);
router.delete('/:id', deleteItemById);

export default router;