// src/features/inventories/inventory.route.ts
import { Router } from 'express';
import { getAllInventory } from './inventory.controller';

const router = Router();
router.get('/', getAllInventory);

export default router;