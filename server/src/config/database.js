import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        await mongoose.connect(uri);
        console.log('Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error.message);
        process.exit(1);
    }
};

export {
    connectDB
};
