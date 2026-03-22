import { Router } from 'express';
import authMiddleware from '#middlewares/auth.middleware.js';
import { register, login, logout } from '#controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

export default router;
