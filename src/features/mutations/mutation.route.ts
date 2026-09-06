import { Router } from 'express';
import { createNewMutation } from './mutation.controller';

const router = Router();
router.post('/', createNewMutation);

export default router;