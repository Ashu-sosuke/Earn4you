import express from 'express';
import {
  getAllPlans,
  getPlanById,
  getUserDashboard,
  updateProfile,
  getReferralInfo,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getUserDashboard);
router.get('/referrals', protect, getReferralInfo);
router.put('/profile', protect, updateProfile);
router.get('/plans', getAllPlans);
router.get('/plans/:id', getPlanById);

export default router;
