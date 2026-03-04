import 'dotenv/config';
import express from 'express';
import routes from '#routes/index.js';
import { connectDB } from '#config/database.js';

const app = express();
const port = process.env.PORT || 3000;

// Gọi hàm kết nối Database
connectDB(); // <-- Và thêm dòng này

app.use(express.json());

// Gắn toàn bộ routes vào tiền tố /api
app.use('/api', routes);

app.get('/', (req, res) => {
    res.status(200).json({ message: '🎉 Server đang chạy mượt mà!' });
});

app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
});