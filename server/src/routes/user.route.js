import { Router } from 'express';
import { getUsers, getCurrentUser } from '#controllers/user.controller.js';
import authMiddleware from '#middlewares/auth.middleware.js';

const router = Router();

// API lấy danh sách User
router.get('/', getUsers);

// API lấy thông tin user đã đăng nhập
router.get('/me', authMiddleware, getCurrentUser);

export default router;