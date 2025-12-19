# Web Bán Hàng TMDT (E-commerce Website)

Dự án website thương mại điện tử hoàn chỉnh với giao diện hiện đại, sử dụng Next.js và Node.js.

## Tổng quan

Website bán hàng trực tuyến với đầy đủ tính năng:
- 🛒 Mua sắm hoàn chỉnh (duyệt sản phẩm, giỏ hàng, thanh toán)
- 🔐 Đăng nhập/đăng ký người dùng
- 👨‍💼 Bảng điều khiển quản trị
- 📱 Thiết kế responsive
- 🌙 Giao diện tối hiện đại
- 💳 Tích hợp thanh toán (COD, chuyển khoản)
- ⭐ Đánh giá và nhận xét sản phẩm
- 🛍️ Danh sách yêu thích
- 📊 Quản lý đơn hàng
- 📋 Trang giới thiệu và liên hệ
- 🏪 Quản lý kho hàng

## Công nghệ sử dụng

### Frontend
- **Next.js 16** - Framework React
- **Tailwind CSS 4** - CSS utility-first
- **TypeScript** - Kiểm tra kiểu dữ liệu
- **Heroicons** - Thư viện icon

### Backend
- **Node.js** - Môi trường runtime
- **Express.js** - Framework web
- **MongoDB** - Cơ sở dữ liệu
- **JWT** - Xác thực
- **bcrypt** - Mã hóa mật khẩu

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn
- MongoDB (local hoặc MongoDB Atlas)

### Hướng dẫn cài đặt

1. **Cài đặt backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Chỉnh sửa file .env với cấu hình của bạn
   npm run dev
   ```

2. **Cài đặt frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Truy cập [http://localhost:3000](http://localhost:3000)**

### Biến môi trường

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/web-ban-hang
JWT_SECRET=your_jwt_secret_here
VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## Tính năng chính

### Cho người dùng
- Duyệt và tìm kiếm sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng và thanh toán
- Theo dõi đơn hàng
- Đánh giá sản phẩm
- Quản lý tài khoản cá nhân

### Cho quản trị viên
- Quản lý sản phẩm (thêm/sửa/xóa)
- Xem báo cáo bán hàng
- Quản lý đơn hàng
- Quản lý người dùng

## Cấu trúc dự án

```
├── backend/          # API backend
│   ├── models/       # Models MongoDB
│   ├── routes/       # API routes
│   ├── middleware/   # Middleware Express
│   └── server.js     # Điểm khởi đầu
├── frontend/         # Ứng dụng Next.js
│   ├── src/
│   │   ├── app/      # Next.js app router
│   │   └── components/ # Components React
│   └── public/       # Tài nguyên tĩnh
└── README.md         # Tài liệu này
```

## Triển khai

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Triển khai lên Vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Triển khai lên nền tảng ưa thích
```

## Đóng góp

1. Fork repository
2. Tạo nhánh tính năng
3. Commit thay đổi
4. Push lên nhánh
5. Tạo Pull Request

## Giấy phép

Dự án này được cấp phép theo MIT License.
