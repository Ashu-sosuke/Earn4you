import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Withdrawal from '../models/Withdrawal.js';
import Plan from '../models/Plan.js';

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('plan referredBy').select('-password');

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending payments (Admin)
// @route   GET /api/admin/payments/pending
// @access  Private/Admin
export const getPendingPaymentsAdmin = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('userId', 'username email walletAddress')
      .populate('planId', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment (Admin)
// @route   POST /api/admin/payments/verify/:paymentId
// @access  Private/Admin
export const verifyPayment = async (req, res) => {
  try {
    const { verificationNotes } = req.body;
    const paymentId = req.params.paymentId;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status
    payment.status = 'verified';
    payment.verifiedBy = req.user.id;
    payment.verifiedAt = new Date();
    payment.verificationNotes = verificationNotes;

    // Update user
    const user = await User.findById(payment.userId);
    user.plan = payment.planId;
    user.paymentStatus = 'completed';
    user.isActive = true;

    // Get plan for referral commission
    const plan = await Plan.findById(payment.planId);

    // Handle referral commission
    if (user.referredBy) {
      const referralCommission = (plan.price * plan.referralCommission) / 100;
      
      const referrer = await User.findById(user.referredBy);
      referrer.totalEarnings += referralCommission;
      referrer.availableBalance += referralCommission;
      await referrer.save();

      // Create referral record
      const referral = new (require('../models/Referral.js').default)({
        referrer: user.referredBy,
        referralCode: user.referralCode,
        referredUser: payment.userId,
        commission: referralCommission,
        paymentId,
        status: 'completed',
      });
      await referral.save();

      payment.referralBonus = referralCommission;
      payment.referredByUser = user.referredBy;
    }

    await payment.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject payment (Admin)
// @route   POST /api/admin/payments/reject/:paymentId
// @access  Private/Admin
export const rejectPayment = async (req, res) => {
  try {
    const { verificationNotes } = req.body;
    const paymentId = req.params.paymentId;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'failed',
        verifiedBy: req.user.id,
        verificationNotes,
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Payment rejected',
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get referral network (Admin)
// @route   GET /api/admin/referrals
// @access  Private/Admin
export const getReferralNetwork = async (req, res) => {
  try {
    const referrals = await User.aggregate([
      {
        $match: { referredBy: { $ne: null } },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'referredBy',
          foreignField: '_id',
          as: 'referrerInfo',
        },
      },
      {
        $unwind: '$referrerInfo',
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          plan: 1,
          'referrerInfo.username': 1,
          'referrerInfo.email': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: referrals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const verifiedPayments = await Payment.countDocuments({ status: 'verified' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        pendingPayments,
        verifiedPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve withdrawal (Admin)
// @route   POST /api/admin/withdrawals/approve/:withdrawalId
// @access  Private/Admin
export const approveWithdrawal = async (req, res) => {
  try {
    const { transactionHash } = req.body;
    const withdrawalId = req.params.withdrawalId;

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    withdrawal.status = 'completed';
    withdrawal.transactionHash = transactionHash;
    withdrawal.approvedBy = req.user.id;
    withdrawal.completedAt = new Date();

    // Update user balance
    const user = await User.findById(withdrawal.userId);
    user.availableBalance -= withdrawal.amount;
    await user.save();

    await withdrawal.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal approved',
      data: withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject withdrawal (Admin)
// @route   POST /api/admin/withdrawals/reject/:withdrawalId
// @access  Private/Admin
export const rejectWithdrawal = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const withdrawalId = req.params.withdrawalId;

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    withdrawal.status = 'failed';
    withdrawal.rejectionReason = rejectionReason;
    withdrawal.approvedBy = req.user.id;

    // Refund balance to user
    const user = await User.findById(withdrawal.userId);
    user.availableBalance += withdrawal.amount;
    await user.save();

    await withdrawal.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal rejected',
      data: withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
