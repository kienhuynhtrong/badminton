import { Router } from 'express';
import {
    createEvent,
    submitVote,
    lockEvent,
    updatePayment,
    togglePaymentStatus,
    completeEvent
} from '#controllers/event.controller.js';

const router = Router();

// Legacy routes kept for compatibility. New UI uses nested /groups/:groupId/events APIs.
router.post('/', createEvent);
router.post('/:eventId/vote', submitVote);
router.post('/:eventId/lock', lockEvent);
router.patch('/:eventId/payment', updatePayment);
router.post('/:eventId/payment/:userId/toggle', togglePaymentStatus);
router.post('/:eventId/complete', completeEvent);

export default router;
