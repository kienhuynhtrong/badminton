import { Router } from 'express';
import { getUsers } from '#controllers/user.controller.js';

const router = Router();

// API lấy danh sách User
router.get('/', getUsers);

export default router;