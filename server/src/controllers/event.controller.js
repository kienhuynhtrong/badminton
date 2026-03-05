import eventService from '#services/event.service.js';

// 1. Tạo event
const createEvent = async (req, res) => {
    try {
        const event = await eventService.createEvent(req.user._id, req.body);

        res.status(201).json({
            status: 'success',
            message: 'Tạo event thành công!',
            data: event
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// 2. Cập nhật trạng thái tham gia
const updateStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status } = req.body;

        const event = await eventService.updateAttendeeStatus(req.user._id, eventId, status);

        res.status(200).json({
            status: 'success',
            message: status === 'confirm' ? 'Đã xác nhận tham gia!' : 'Đã cập nhật trạng thái bận.',
            data: event
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export { createEvent, updateStatus };
