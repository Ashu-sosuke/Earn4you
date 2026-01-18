import express from 'express';
import {
  getAllUsers,
  getPendingPaymentsAdmin,
  verifyPayment,
  rejectPayment,
  getReferralNetwork,
  getAdminStats,
  approveWithdrawal,
  rejectWithdrawal,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply admin auth to all routes
router.use(protect, adminOnly);

// User management
router.get('/users', getAllUsers);

// Payment management
router.get('/payments/pending', getPendingPaymentsAdmin);
router.post('/payments/verify/:paymentId', verifyPayment);
router.post('/payments/reject/:paymentId', rejectPayment);

// Referral management
router.get('/referrals', getReferralNetwork);

// Withdrawal management
router.post('/withdrawals/approve/:withdrawalId', approveWithdrawal);
router.post('/withdrawals/reject/:withdrawalId', rejectWithdrawal);

// Dashboard stats
router.get('/stats', getAdminStats);

export default router;
