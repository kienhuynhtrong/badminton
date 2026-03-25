import mongoose from 'mongoose';

const voteOptionBase = {
    label: { type: String, required: true, trim: true },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
};

const scheduleOptionSchema = new mongoose.Schema({
    ...voteOptionBase,
    startAt: { type: Date, required: false },
    endAt: { type: Date, required: false }
}, { _id: true });

const locationOptionSchema = new mongoose.Schema({
    ...voteOptionBase,
    address: { type: String, default: '', trim: true }
}, { _id: true });

const courtOptionSchema = new mongoose.Schema({
    label: { type: String, required: true, trim: true },
    courtCount: { type: Number, required: true, min: 1 },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { _id: true });

const voteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduleOptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    locationOptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    courtOptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    note: { type: String, default: '', trim: true },
    votedAt: { type: Date, default: Date.now }
}, { _id: false });

const paymentItemSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, default: 0, min: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const eventSchema = new mongoose.Schema({
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: {
        type: String,
        enum: ['voting', 'locked', 'completed'],
        default: 'voting',
        index: true
    },
    scheduleOptions: {
        type: [scheduleOptionSchema],
        validate: {
            validator: (value) => Array.isArray(value) && value.length > 0,
            message: 'Cần ít nhất một lựa chọn khung giờ'
        }
    },
    locationOptions: {
        type: [locationOptionSchema],
        validate: {
            validator: (value) => Array.isArray(value) && value.length > 0,
            message: 'Cần ít nhất một lựa chọn địa điểm'
        }
    },
    courtOptions: {
        type: [courtOptionSchema],
        validate: {
            validator: (value) => Array.isArray(value) && value.length > 0,
            message: 'Cần ít nhất một lựa chọn số sân'
        }
    },
    votes: {
        type: [voteSchema],
        default: []
    },
    finalSelection: {
        scheduleOptionId: { type: mongoose.Schema.Types.ObjectId, default: null },
        locationOptionId: { type: mongoose.Schema.Types.ObjectId, default: null },
        courtOptionId: { type: mongoose.Schema.Types.ObjectId, default: null },
        lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        lockedAt: { type: Date, default: null }
    },
    payment: {
        totalCost: { type: Number, default: 0, min: 0 },
        note: { type: String, default: '', trim: true },
        items: {
            type: [paymentItemSchema],
            default: []
        }
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
