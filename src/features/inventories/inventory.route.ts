import { Router } from 'express';
import { getAllInventory } from './inventory.controller';

const router = Router();
router.get('/', getAllInventory);

export default router;