import eventService from '#services/event.service.js';

const createEvent = async (req, res) => {
    try {
        const groupId = req.params.groupId || req.body.group_id || req.body.groupId;
        const workspace = await eventService.createGroupEvent(req.user._id, groupId, req.body);

        res.status(201).json({
            status: 'success',
            message: 'Tạo phiên vote thành công!',
            data: workspace
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const submitVote = async (req, res) => {
    try {
        const { groupId, eventId } = req.params;
        const workspace = await eventService.submitVote(req.user._id, groupId, eventId, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Đã lưu bình chọn của bạn!',
            data: workspace
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const lockEvent = async (req, res) => {
    try {
        const { groupId, eventId } = req.params;
        const workspace = await eventService.lockEvent(req.user._id, groupId, eventId, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Đã chốt kết quả buổi chơi!',
            data: workspace
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const { groupId, eventId } = req.params;
        const workspace = await eventService.updatePayment(req.user._id, groupId, eventId, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Đã cập nhật phần thanh toán.',
            data: workspace
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const togglePaymentStatus = async (req, res) => {
    try {
        const { groupId, eventId, userId } = req.params;
        const workspace = await eventService.togglePaymentStatus(req.user._id, groupId, eventId, userId, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Đã cập nhật trạng thái thanh toán.',
            data: workspace
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const completeEvent = async (req, res) => {
    try {
        const { groupId, eventId } = req.params;
        const workspace = await eventService.completeEvent(req.user._id, groupId, eventId);

        res.status(200).json({
            status: 'success',
            message: 'Buổi chơi đã được hoàn tất.',
            data: workspace
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export {
    createEvent,
    submitVote,
    lockEvent,
    updatePayment,
    togglePaymentStatus,
    completeEvent
};
