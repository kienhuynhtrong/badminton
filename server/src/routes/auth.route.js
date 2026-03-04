import { Router } from 'express';
import { register, login, logout } from '#controllers/auth.controller.js';
import authMiddleware from '#middlewares/auth.middleware.js';

const router = Router();

// Đăng ký (không cần đăng nhập)
router.post('/register', register);

// Đăng nhập (không cần đăng nhập)
router.post('/login', login);

// Đăng xuất (cần đăng nhập trước)
router.post('/logout', authMiddleware, logout);

export default router;
