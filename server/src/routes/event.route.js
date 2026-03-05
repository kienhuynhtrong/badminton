import { Router } from 'express';
import { createEvent, updateStatus } from '#controllers/event.controller.js';

const router = Router();

// Tạo event mới (trưởng nhóm)
router.post('/', createEvent);

// Cập nhật trạng thái tham gia (confirm / busy)
router.patch('/:eventId/status', updateStatus);

export default router;
