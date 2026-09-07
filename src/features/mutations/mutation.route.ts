import { Router } from 'express';
import { createNewMutation, getAllMutations } from './mutation.controller';

const router = Router();
router.post('/', createNewMutation);
router.get('/', getAllMutations)

export default router;