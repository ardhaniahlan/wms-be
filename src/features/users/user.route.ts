import { Router } from 'express';
import { getAllUsers, createNewUser } from './user.controller';

const router = Router();
router.get('/', getAllUsers);
router.post('/', createNewUser);

export default router;