import User from "#models/user.model.js";

// Hàm Lấy danh sách User
const getAllUsers = async () => {
    const users = await User.find(); // Tìm tất cả user trong DB
    return users;
};

export default {
    getAllUsers
};