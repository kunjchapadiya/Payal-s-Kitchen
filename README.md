# Payal's Kitchen 🍽️

A comprehensive food delivery and subscription service application built with the MERN stack.

## Features

- **4 User Roles**: Visitor, Customer, Employee, Admin
- **Subscription Plans**: Daily tiffin service with auto-menu access
- **Event Catering**: Book packages for events and parties
- **Real-time Order Tracking**: Pending → Confirmed → Preparing → Out for delivery → Delivered
- **Payment Integration**: Razorpay for secure payments
- **OTP Verification**: Secure registration with email/phone OTP
- **Admin Dashboard**: Complete management system with analytics
- **Employee Portal**: Task assignment and delivery tracking

## Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS 4
- React Router DOM
- Axios for API calls
- React Icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Nodemailer for emails
- Razorpay for payments

## Project Structure

```
Payal's Kitchen/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── user/      # Customer pages
│   │   │   ├── admin/     # Admin pages
│   │   │   └── chef/      # Employee pages
│   │   └── services/      # API service layer
│   └── package.json
│
├── server/                # Backend Express application
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
│
└── package.json          # Root package.json

```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Payal's Kitchen"
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Configuration**

Create `server/.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/payals_kitchen
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Option 1: Run both together (from root)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## UI Theme

The application uses a warm, modern design system:

- **Primary Orange**: `#F28C28` - CTAs, highlights, active states
- **Background Cream**: `#FFF8E7` - Page backgrounds
- **Dark Gray**: `#2E2E2E` - Text and dark elements
- **Typography**: Poppins font family
- **Design**: Glassmorphism, rounded corners, smooth transitions

## User Roles & Permissions

### Visitor (Not Logged In)
- View menu, subscription plans, event packages
- Browse offers and promotions
- Access FAQs, About, Contact pages
- **Cannot**: Add to cart, checkout, or place orders

### Customer (Logged In)
- Place orders and track in real-time
- Subscribe to meal plans
- Book event packages
- Manage profile and addresses
- View payment history
- Submit feedback and complaints

### Employee (Staff/Delivery)
- View assigned tasks only
- Update delivery status
- Upload delivery proof
- Report issues to admin

### Admin (Superuser)
- Complete system control
- Manage products, categories, menus
- Assign tasks to employees
- View analytics and reports
- Handle payments and refunds
- Manage feedback and complaints

## Development Progress

### ✅ Priority 1: Foundation (Completed)
- Server setup with Express and MongoDB
- JWT authentication middleware
- API service layer with Axios
- AuthContext for global state
- Reusable UI components (Button, Input, Card, Modal, Spinner, Toast)

### 🔄 Priority 2: Authentication (Next)
- Register with OTP verification
- Login with JWT
- Protected routes
- Role-based routing

### 📋 Upcoming Priorities
- Visitor pages
- Customer panel
- Subscriptions
- Events
- Employee panel
- Admin panel
- Payments
- Notifications

## API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Register with OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/customer/:id` - Get customer orders
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/assign` - Assign to employee (admin)

[More endpoints to be added...]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any queries, please contact: hello@payalskitchen.com

---

**Built with ❤️ for Payal's Kitchen**
