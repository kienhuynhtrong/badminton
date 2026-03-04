import { Router } from 'express';
import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import authMiddleware from '#middlewares/auth.middleware.js';

const router = Router();

// === Route công khai (không cần đăng nhập) ===
router.use('/auth', authRoute);

// === Route cần đăng nhập (gắn authMiddleware một lần cho tất cả) ===
router.use(authMiddleware);
router.use('/users', userRoute);

export default router;