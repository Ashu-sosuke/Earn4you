import express from 'express';
import {
  initiatePayment,
  getPendingPayments,
  getPaymentHistory,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/initiate', protect, initiatePayment);
router.get('/pending', protect, getPendingPayments);
router.get('/history', protect, getPaymentHistory);

export default router;
