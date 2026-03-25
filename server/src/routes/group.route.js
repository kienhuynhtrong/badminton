import { Router } from 'express';
import {
    createGroup,
    getMyGroups,
    getDiscoverGroups,
    getGroupWorkspace,
    updateGroup,
    deleteGroup,
    requestJoin,
    acceptRequest,
    rejectRequest
} from '#controllers/group.controller.js';
import {
    createEvent,
    submitVote,
    lockEvent,
    updatePayment,
    togglePaymentStatus,
    completeEvent
} from '#controllers/event.controller.js';

const router = Router();

router.post('/', createGroup);
router.get('/me', getMyGroups);
router.get('/discover', getDiscoverGroups);
router.get('/:groupId/workspace', getGroupWorkspace);
router.patch('/:groupId', updateGroup);
router.delete('/:groupId', deleteGroup);
router.post('/:groupId/join', requestJoin);
router.post('/:groupId/requests/:userId/accept', acceptRequest);
router.post('/:groupId/requests/:userId/reject', rejectRequest);
router.post('/:groupId/events', createEvent);
router.post('/:groupId/events/:eventId/vote', submitVote);
router.post('/:groupId/events/:eventId/lock', lockEvent);
router.patch('/:groupId/events/:eventId/payment', updatePayment);
router.post('/:groupId/events/:eventId/payment/:userId/toggle', togglePaymentStatus);
router.post('/:groupId/events/:eventId/complete', completeEvent);

export default router;
