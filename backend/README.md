# Earn4You Backend

Node.js backend for Earn4You - A referral and payment platform with JWT authentication, MongoDB, and admin panel.

## Features

- JWT Authentication (Register & Login)
- Plan Selection & Payment Processing
- Referral System with Commission Tracking
- Admin Dashboard for Payment Verification
- Withdrawal System
- User Profile Management

## Project Structure

```
backend/
├── config/
│   ├── db.js           # MongoDB connection
│   └── constants.js    # Environment constants
├── models/
│   ├── User.js         # User schema
│   ├── Plan.js         # Plans schema
│   ├── Payment.js      # Payments schema
│   ├── Referral.js     # Referrals schema
│   └── Withdrawal.js   # Withdrawals schema
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── user.js         # User routes
│   ├── payments.js     # Payment routes
│   ├── withdrawals.js  # Withdrawal routes
│   └── admin.js        # Admin routes
├── controllers/
│   ├── authController.js       # Auth logic
│   ├── userController.js       # User logic
│   ├── paymentController.js    # Payment logic
│   ├── adminController.js      # Admin logic
│   └── withdrawalController.js # Withdrawal logic
├── middleware/
│   └── auth.js         # JWT verification & admin check
├── utils/
│   ├── generateToken.js    # JWT token generation
│   └── referralCode.js     # Referral code generation
├── .env                # Environment variables
├── server.js           # Main server file
└── package.json        # Dependencies
```

## Installation

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Edit `.env` file with your MongoDB URI and JWT secret
   - Add your USDT wallet address

4. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### User
- `GET /api/user/dashboard` - User dashboard (Protected)
- `GET /api/user/plans` - Get all available plans
- `GET /api/user/plans/:id` - Get specific plan
- `GET /api/user/referrals` - Get referral info (Protected)
- `PUT /api/user/profile` - Update profile (Protected)

### Payments
- `POST /api/payments/initiate` - Initiate payment (Protected)
- `GET /api/payments/pending` - Get pending payments (Protected)
- `GET /api/payments/history` - Payment history (Protected)

### Withdrawals
- `POST /api/withdrawals/request` - Request withdrawal (Protected)
- `GET /api/withdrawals/history` - Withdrawal history (Protected)

### Admin
- `GET /api/admin/users` - List all users (Admin)
- `GET /api/admin/payments/pending` - Pending payments (Admin)
- `POST /api/admin/payments/verify/:paymentId` - Verify payment (Admin)
- `POST /api/admin/payments/reject/:paymentId` - Reject payment (Admin)
- `GET /api/admin/referrals` - Referral network (Admin)
- `GET /api/admin/stats` - Dashboard stats (Admin)
- `POST /api/admin/withdrawals/approve/:withdrawalId` - Approve withdrawal (Admin)
- `POST /api/admin/withdrawals/reject/:withdrawalId` - Reject withdrawal (Admin)

## Database Models

### User
- Email, username, password (hashed)
- Wallet address
- Referral code & referred by
- Plan selection
- Total earnings & available balance

### Plan
- Name, price in USDT
- Referral commission percentage
- Features list

### Payment
- User, plan, amount
- Status (pending/verified/failed)
- Transaction hash
- Referral bonus tracking

### Referral
- Referrer, referred user
- Commission amount
- Status tracking

### Withdrawal
- User, amount
- Wallet address
- Status tracking
- Transaction hash for completion

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/earn4you
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
FRONTEND_URL=http://localhost:5173
USDT_WALLET_ADDRESS=your_usdt_wallet_address_here
```

## Payment Flow

1. User registers/logs in
2. Selects a plan
3. Initiates payment
4. Admin verifies payment in dashboard
5. Payment marked as verified
6. User plan activated
7. If referred, referrer gets commission

## Referral Flow

1. User gets unique referral code
2. Shares referral link with others
3. Referred user registers with referral code
4. When referred user's payment is verified, referrer gets commission
5. Commission added to referrer's available balance

## Withdrawal Process

1. User requests withdrawal when balance reaches threshold
2. Admin reviews pending withdrawals
3. Admin approves/rejects
4. On approval, amount deducted from balance
5. Binance/external integration handles actual transfer

## Next Steps

1. Add input validation using express-validator
2. Integrate actual USDT payment verification
3. Add Binance API for withdrawal processing
4. Add email notifications
5. Add logging system
6. Deploy to production server
