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

export { getUsers };