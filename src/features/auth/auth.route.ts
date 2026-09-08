import { Router } from 'express';
import { register, login, logoutUser } from './auth.controller';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logoutUser);

export default router;