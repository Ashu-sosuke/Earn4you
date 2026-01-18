import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/earn4you';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
