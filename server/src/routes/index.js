import { Router } from 'express';
import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import groupRoute from './group.route.js';
import eventRoute from './event.route.js';
import authMiddleware from '#middlewares/auth.middleware.js';

const router = Router();

// === Route công khai (không cần đăng nhập) ===
router.use('/auth', authRoute);

// === Route cần đăng nhập (gắn authMiddleware một lần cho tất cả) ===
router.use(authMiddleware);
router.use('/users', userRoute);
router.use('/groups', groupRoute);
router.use('/events', eventRoute);

export default router;