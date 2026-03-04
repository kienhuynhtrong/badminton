import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Lấy đường dẫn từ file .env
        const uri = process.env.MONGODB_URI;

        // Thực hiện kết nối
        await mongoose.connect(uri);
        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        process.exit(1); // Dừng server nếu không kết nối được DB
    }
};

export {
    connectDB
};