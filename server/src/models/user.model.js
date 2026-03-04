import mongoose from 'mongoose';

// Định nghĩa cấu trúc của một User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null },
    password: { type: String, required: true }
}, {
    timestamps: true, // Tự động sinh ra 2 trường: createdAt (ngày tạo) và updatedAt (ngày cập nhật)
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password; // Ẩn password khỏi response
            delete ret.__v;     // Ẩn __v (version key) cho gọn
            return ret;
        }
    }
});

// Tạo Model từ Schema
const User = mongoose.model('User', userSchema);

export default User;