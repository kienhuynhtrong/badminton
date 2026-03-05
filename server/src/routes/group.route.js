import { Router } from 'express';
import {
    createGroup,
    requestJoin,
    acceptRequest,
    rejectRequest
} from '#controllers/group.controller.js';

const router = Router();

// Tạo nhóm mới
router.post('/', createGroup);

// Xin vào nhóm
router.post('/:groupId/join', requestJoin);

// Chấp nhận yêu cầu (trưởng nhóm)
router.post('/:groupId/requests/:userId/accept', acceptRequest);

// Từ chối yêu cầu (trưởng nhóm)
router.post('/:groupId/requests/:userId/reject', rejectRequest);

export default router;
