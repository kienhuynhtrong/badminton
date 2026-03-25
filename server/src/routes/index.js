import { Router } from 'express';
import authMiddleware from '#middlewares/auth.middleware.js';
import authRoute from './auth.route.js';
import groupRoute from './group.route.js';
import userRoute from './user.route.js';

const router = Router();

router.use('/auth', authRoute);

router.use(authMiddleware);
router.use('/users', userRoute);
router.use('/groups', groupRoute);

export default router;
