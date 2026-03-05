import Event from '#models/event.model.js';
import Group from '#models/group.model.js';

// 1. Tạo event (chỉ trưởng nhóm)
const createEvent = async (adminId, eventData) => {
    const { group_id, title, date, location } = eventData;

    // Kiểm tra nhóm tồn tại
    const group = await Group.findById(group_id);
    if (!group) {
        throw new Error('Nhóm không tồn tại');
    }

    // Kiểm tra quyền admin
    const isAdmin = group.members.some(
        m => m.user_id.toString() === adminId.toString() && m.role === 'admin'
    );
    if (!isAdmin) {
        throw new Error('Chỉ trưởng nhóm mới có thể tạo event');
    }

    // Lấy tất cả thành viên từ group làm attendees
    const attendees = group.members.map(m => ({
        user_id: m.user_id,
        status: 'pending'
    }));

    const event = await Event.create({
        group_id,
        title,
        date,
        location,
        attendees
    });

    return event;
};

// 2. Cập nhật trạng thái tham gia (confirm / busy)
const updateAttendeeStatus = async (userId, eventId, status) => {
    if (!['confirm', 'busy'].includes(status)) {
        throw new Error('Trạng thái phải là "confirm" hoặc "busy"');
    }

    const event = await Event.findById(eventId);
    if (!event) {
        throw new Error('Event không tồn tại');
    }

    // Tìm attendee trong danh sách
    const attendee = event.attendees.find(
        a => a.user_id.toString() === userId.toString()
    );
    if (!attendee) {
        throw new Error('Bạn không được mời tham gia event này');
    }

    // Cập nhật trạng thái
    attendee.status = status;
    await event.save();

    return event;
};

export default {
    createEvent,
    updateAttendeeStatus
};
