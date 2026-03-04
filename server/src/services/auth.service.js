import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '#models/user.model.js';

// Hàm tạo JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Hàm Đăng ký
const register = async (userData) => {
    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email đã được sử dụng');
    }

    // 2. Kiểm tra username đã tồn tại chưa
    const existingUsername = await User.findOne({ username: userData.username });
    if (existingUsername) {
        throw new Error('Username đã được sử dụng');
    }

    // 3. Mã hoá password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 4. Tạo user mới
    const newUser = await User.create({
        ...userData,
        password: hashedPassword
    });

    // 5. Tạo token luôn để user không cần đăng nhập lại sau khi đăng ký
    const token = generateToken(newUser._id);

    return { token, user: newUser };
};

// Hàm Đăng nhập
const login = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    const token = generateToken(user._id);

    return { token, user };
};

export default {
    register,
    login
};
