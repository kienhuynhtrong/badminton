import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    title: String, // VD: "Giao lưu tối thứ 7"
    date: { type: Date, required: true },
    location: String,
    totalCost: { type: Number, default: 0 }, // Tổng tiền sân + nước
    isCompleted: { type: Boolean, default: false }, // Đã kết thúc buổi chưa

    // Danh sách những người trong nhóm xác nhận đi buổi này
    attendees: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'confirm', 'busy'], default: 'pending' },
        isPaid: { type: Boolean, default: false } // Đã đóng tiền chưa
    }],

    // Lưu kết quả chia đội của buổi đó (để xem lại)
    teamSplits: {
        teamA: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        teamB: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;