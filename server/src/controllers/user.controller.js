import userService from '#services/user.service.js';

// Hàm lấy danh sách User
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Hàm lấy thông tin user đã đăng nhập
const getCurrentUser = async (req, res) => {
    try {
        // req.user đã được set bởi authMiddleware
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User không tồn tại'
            });
        }

        res.status(200).json({ 
            status: 'success', 
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};

export { getUsers, getCurrentUser };