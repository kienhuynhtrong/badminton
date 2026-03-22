import { Router } from 'express';
import {
    createGroup,
    getMyGroups,
    getDiscoverGroups,
    updateGroup,
    deleteGroup,
    requestJoin,
    acceptRequest,
    rejectRequest
} from '#controllers/group.controller.js';

const router = Router();

router.post('/', createGroup);
router.get('/me', getMyGroups);
router.get('/discover', getDiscoverGroups);
router.patch('/:groupId', updateGroup);
router.delete('/:groupId', deleteGroup);
router.post('/:groupId/join', requestJoin);
router.post('/:groupId/requests/:userId/accept', acceptRequest);
router.post('/:groupId/requests/:userId/reject', rejectRequest);

export default router;
