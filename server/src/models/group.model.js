import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    location: String,
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Chủ nhóm
    status: { type: String, enum: ['public', 'private'], default: 'public' },

    // Danh sách thành viên chính thức
    members: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        rank: { type: Number, default: 0 }, // Dùng để Drag & Drop sắp xếp trình độ
        joinedAt: { type: Date, default: Date.now }
    }],

    // Danh sách người lạ đang xin vào nhóm
    pending_requests: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        requestedAt: { type: Date, default: Date.now }
    }]
});
const Group = mongoose.model('Group', groupSchema);

export default Group;

