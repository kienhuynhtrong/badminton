import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người nhận
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Người gửi
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    type: {
        type: String,
        enum: ['JOIN_REQUEST', 'JOIN_ACCEPTED', 'NEW_EVENT', 'PAYMENT_REMIND']
    },
    content: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;