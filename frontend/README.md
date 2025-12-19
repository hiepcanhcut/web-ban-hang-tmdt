# E-Shop - Modern E-commerce Website

A modern, dark-themed e-commerce website built with Next.js 16, Tailwind CSS, and Node.js/Express backend.

## Features

- 🛒 Complete shopping experience (browse, cart, checkout)
- 🔐 User authentication (JWT)
- 👨‍💼 Admin dashboard with analytics
- 📱 Fully responsive design
- 🌙 Dark theme with modern aesthetics
- 💳 Payment integration (COD & Bank Transfer)
- ⭐ Product reviews and ratings
- 🛍️ Wishlist functionality
- 📊 Order management & tracking
- 📋 About & Contact pages
- 🏪 Inventory management

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **Tailwind CSS 4** - Utility-first CSS
- **TypeScript** - Type safety
- **Heroicons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone and setup backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

2. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)**

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eshop
JWT_SECRET=your_jwt_secret_here
VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

#### Frontend Environment (if needed)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Payment Integration

### VNPay Sandbox
- **Test Card:** Any valid card number
- **OTP:** 123456 (for sandbox)
- **Return URL:** Configured in VNPay dashboard

### PayPal Sandbox
- Use PayPal developer account
- Test with sandbox buyer accounts

## Sample Data

### Sample Products
The website includes 12 sample products with high-quality stock images from Unsplash:
- **Electronics**: Wireless headphones, mechanical keyboard, smart watch, coffee maker, wireless charger
- **Fashion**: Minimal hoodie, leather backpack, minimalist watch
- **Accessories**: Water bottle, desk lamp, ceramic plant pot, portable speaker

### Test Users (Demo Login)
The website includes mock authentication for demo purposes:

- **Admin:** `admin@example.com` / any password (4+ characters)
- **User:** `user@example.com` / any password (4+ characters)
- **Demo:** `demo@example.com` / any password (4+ characters)

*Note: Authentication works without backend - just enter any password with 4+ characters for the demo emails above.*

### Admin Panel Access
1. Login with admin account: `admin@example.com`
2. Click your username in the top-right corner
3. Select "Admin Panel" from the dropdown menu
4. Access product upload at: `http://localhost:3000/admin`

**Admin Features:**
- 📊 Dashboard with statistics
- 📦 Product management (view/edit/delete)
- ➕ Add new products with image upload
- 📋 Order management (future)
- 👥 User management

### Shopping Cart & Checkout
- 🛒 Add products to cart from homepage and product pages
- 📈 Cart counter in header updates automatically
- 🗂️ Full cart page at `/cart` with quantity controls
- 💰 Order summary with shipping and tax calculations
- 🗑️ Remove items and clear cart functionality
- 🛍️ Complete checkout flow at `/checkout`

### Payment Methods
- 💵 **Cash on Delivery (COD)** - Pay when goods are delivered
- 📱 **Bank Transfer (QR Code)** - Scan QR code with mobile banking app
- 🏦 **Mock Bank Details:** Vietcombank, Account: 1234567890, Name: E-Shop Company
- ✅ **Order Confirmation** - Detailed receipt at `/order-confirmation`
- 📦 **Order History** - Complete order tracking at `/orders`

### Order Management
- 📋 **My Orders** - View complete order history
- 📊 **Order Status** - Track delivery progress
- 🔄 **Order Details** - View items, shipping, payment info
- 📞 **Customer Support** - Contact information for order issues
- 📈 **Sales Reports** - Revenue analytics and insights

### Product Reviews & Ratings
- ⭐ **Write Reviews** - Rate and review products after delivery
- 📝 **Review System** - Star ratings and detailed feedback
- 📊 **Product Ratings** - Average ratings from customer reviews
- 📈 **Review Analytics** - Helpfulness voting (future feature)
- 🛍️ **Product Details** - Full product pages with reviews at `/products/[slug]`

### User Profile Management
- 👤 **Profile Page** - View and edit personal information at `/profile`
- ✏️ **Edit Profile** - Update name, email, phone, and address
- ⚙️ **Account Settings** - Manage notifications and preferences
- 🔐 **Security Options** - Change password and account security
- 📝 **Write Reviews** - Dedicated page to review purchased products at `/write-reviews`

### API Endpoints

See `api-contracts.json` for detailed API documentation including request/response formats.

#### Main Endpoints
- `GET /api/products` - Get all products
- `POST /api/auth/login` - User login
- `GET /api/cart` - Get user cart
- `POST /api/orders` - Create order
- `POST /api/payments` - Process payment

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   └── lib/          # Utilities
│   ├── public/           # Static assets
│   └── api-contracts.json # API documentation
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── server.js        # Entry point
```

## Design System

### Colors
- **Background:** #0F1724 (dark navy)
- **Surface:** #111827 (card backgrounds)
- **Primary:** #06B6D4 (cyan - CTAs)
- **Accent:** #F59E0B (amber - sales)
- **Text Primary:** #E6EEF6
- **Text Secondary:** #C8D6E5

### Typography
- **Font:** Inter (Google Fonts)
- **Sizes:** Responsive scaling
- **Line Heights:** Optimized for readability

### Spacing
- **Base:** 8px system
- **Consistent:** 4px, 8px, 16px, 24px, 32px, 48px

## Development

### Available Scripts

```bash
# Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

# Backend
npm run dev      # Start with nodemon
npm run start    # Start production server
```

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
npm run build
# Deploy to your preferred platform
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
