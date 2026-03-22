import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB } from '#config/database.js';
import routes from '#routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/api', routes);

app.get('/', (_req, res) => {
    res.status(200).json({ message: 'Server đang chạy ổn định!' });
});

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server đang chạy tại: http://localhost:${port}`);
    });
};

startServer().catch((error) => {
    console.error('Không thể khởi động server:', error);
    process.exit(1);
});
