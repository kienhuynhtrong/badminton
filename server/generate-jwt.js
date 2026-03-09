import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// 1. Tạo chuỗi ngẫu nhiên dài 64 bytes (128 ký tự hex)
const newSecret = crypto.randomBytes(64).toString('hex');

// 2. Tìm file .env
const envPath = path.join(process.cwd(), '.env');

try {
    let envFile = fs.readFileSync(envPath, 'utf8');

    // Kiểm tra xem JWT_SECRET có tồn tại không
    if (envFile.includes('JWT_SECRET=')) {
        // Thay thế JWT_SECRET cũ bằng mới
        envFile = envFile.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${newSecret}`);
    } else {
        // Nếu chưa có, thì thêm vào cuối file
        envFile += `\nJWT_SECRET=${newSecret}`;
    }

    // 3. Ghi lại vào .env
    fs.writeFileSync(envPath, envFile);
    console.log('✅ Đã tạo JWT_SECRET mới thành công!');
    console.log(`🔑 Key mới: ${newSecret}`);
} catch (error) {
    console.error('❌ Lỗi khi đọc/ghi file .env:', error);
}
