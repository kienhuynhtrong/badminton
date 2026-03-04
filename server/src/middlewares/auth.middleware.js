import jwt from 'jsonwebtoken';
import User from '#models/user.model.js';

// Middleware kiểm tra JWT token
const authMiddleware = async (req, res, next) => {
    try {
        // 1. Lấy token từ header Authorization (format: "Bearer <token>")
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Bạn chưa đăng nhập. Vui lòng cung cấp token.'
            });
        }

        // 2. Tách lấy token
        const token = authHeader.split(' ')[1];

        // 3. Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Tìm user từ token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User không tồn tại.'
            });
        }

        // 5. Gắn thông tin user vào request
        req.user = user;

        // 6. Cho phép đi tiếp
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token không hợp lệ hoặc đã hết hạn.'
        });
    }
};

export default authMiddleware;
