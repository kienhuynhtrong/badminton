import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    maxMembers: { type: Number, default: 1, required: true },
    // Danh sách thành viên chính thức
    members: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        role: { type: String, enum: ['admin', 'member'], default: 'member', required: false },
        joinedAt: { type: Date, default: Date.now, required: false }
    }],

    // Danh sách người lạ đang xin vào nhóm
    pending_requests: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        message: { type: String, required: false },
        requestedAt: { type: Date, default: Date.now, required: false }
    }]
});
const Group = mongoose.model('Group', groupSchema);

export default Group;

