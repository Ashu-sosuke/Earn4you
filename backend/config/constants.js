import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Referral Commission Rates (Percentage)
export const REFERRAL_L1_PERCENT = 5;
export const REFERRAL_L2_PERCENT = 3;
export const REFERRAL_L3_PERCENT = 2;

// Withdrawal Rules
export const MIN_WITHDRAWAL_AMOUNT = 10; // USDT
export const WITHDRAWAL_FEE_PERCENT = 5;
