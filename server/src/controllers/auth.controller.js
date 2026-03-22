import authService from '#services/auth.service.js';

const register = async (req, res) => {
    try {
        const { username, nickname, email, phone, password } = req.body;

        if (!username || !nickname || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Vui lòng nhập đầy đủ: username, nickname, email, password'
            });
        }

        const { token, user } = await authService.register({
            username,
            nickname,
            email,
            phone,
            password
        });

        res.status(201).json({
            status: 'success',
            message: 'Đăng ký thành công!',
            data: { token, user }
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Vui lòng nhập email và password'
            });
        }

        const { token, user } = await authService.login({ email, password });

        res.status(200).json({
            status: 'success',
            message: 'Đăng nhập thành công!',
            data: { token, user }
        });
    } catch (error) {
        res.status(401).json({ status: 'error', message: error.message });
    }
};

const logout = async (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Đăng xuất thành công!'
    });
};

export { register, login, logout };
