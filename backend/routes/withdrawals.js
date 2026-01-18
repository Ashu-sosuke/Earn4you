import express from 'express';
import {
  requestWithdrawal,
  getWithdrawalHistory,
  getPendingWithdrawals,
} from '../controllers/withdrawalController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', protect, requestWithdrawal);
router.get('/history', protect, getWithdrawalHistory);
router.get('/pending', protect, adminOnly, getPendingWithdrawals);

export default router;
