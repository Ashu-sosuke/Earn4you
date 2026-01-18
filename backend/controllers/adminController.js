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

// @desc    Get payments (Admin)
// @route   GET /api/admin/payments
// @access  Private/Admin
export const getAdminPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      if (status === 'Pending') query.status = 'pending';
      else if (status === 'Approved') query.status = 'verified';
      else if (status === 'Rejected') query.status = 'failed';
      // Handle lowercase too if needed, but frontend sends capitalized tabs usually
      // Let's make it case insensitive or stick to lowercase
      if (status.toLowerCase() === 'pending') query.status = 'pending';
      if (status.toLowerCase() === 'approved') query.status = 'verified';
      if (status.toLowerCase() === 'rejected') query.status = 'failed';
    }

    const payments = await Payment.find(query)
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
import Transaction from '../models/Transaction.js';
import { REFERRAL_L1_PERCENT, REFERRAL_L2_PERCENT, REFERRAL_L3_PERCENT } from '../config/constants.js';

// ... other imports ...

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

    if (payment.status === 'verified') {
      return res.status(400).json({ message: 'Payment already verified' });
    }

    // Update payment status
    payment.status = 'verified';
    payment.verifiedBy = req.user.id;
    payment.verifiedAt = new Date();
    payment.verificationNotes = verificationNotes || 'Verified by Admin';

    // Update user
    const user = await User.findById(payment.userId);
    user.plan = payment.planId;
    user.paymentStatus = 'completed';
    user.isActive = true;

    // Get plan for referral commission base
    const plan = await Plan.findById(payment.planId);
    const planPrice = plan.price;

    // --- MLM Referral Logic (3 Levels) ---

    // Level 1 (Direct Referrer)
    if (user.referredBy) {
      const referrerL1 = await User.findById(user.referredBy);
      if (referrerL1) {
        const commissionL1 = (planPrice * REFERRAL_L1_PERCENT) / 100;

        referrerL1.totalEarnings += commissionL1;
        referrerL1.availableBalance += commissionL1;
        await referrerL1.save();

        // Transaction Record L1
        await Transaction.create({
          userId: referrerL1._id,
          amount: commissionL1,
          type: 'referral_bonus_l1',
          description: `Level 1 Commission from ${user.username}`,
          referenceId: payment._id,
          details: { fromUser: user.username, level: 1 }
        });

        // Update Payment with L1 info (legacy support)
        payment.referralBonus = commissionL1;
        payment.referredByUser = referrerL1._id;

        // Level 2 (Indirect Referrer)
        if (referrerL1.referredBy) {
          const referrerL2 = await User.findById(referrerL1.referredBy);
          if (referrerL2) {
            const commissionL2 = (planPrice * REFERRAL_L2_PERCENT) / 100;

            referrerL2.totalEarnings += commissionL2;
            referrerL2.availableBalance += commissionL2;
            await referrerL2.save();

            // Transaction Record L2
            await Transaction.create({
              userId: referrerL2._id,
              amount: commissionL2,
              type: 'referral_bonus_l2',
              description: `Level 2 Commission from ${user.username} (via ${referrerL1.username})`,
              referenceId: payment._id,
              details: { fromUser: user.username, riskSource: referrerL1.username, level: 2 }
            });

            // Level 3 (Deep Referrer)
            if (referrerL2.referredBy) {
              const referrerL3 = await User.findById(referrerL2.referredBy);
              if (referrerL3) {
                const commissionL3 = (planPrice * REFERRAL_L3_PERCENT) / 100;

                referrerL3.totalEarnings += commissionL3;
                referrerL3.availableBalance += commissionL3;
                await referrerL3.save();

                // Transaction Record L3
                await Transaction.create({
                  userId: referrerL3._id,
                  amount: commissionL3,
                  type: 'referral_bonus_l3',
                  description: `Level 3 Commission from ${user.username} (via ${referrerL2.username})`,
                  referenceId: payment._id,
                  details: { fromUser: user.username, riskSource: referrerL2.username, level: 3 }
                });
              }
            }
          }
        }
      }
    }

    await payment.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and commissions distributed',
      data: payment,
    });
  } catch (error) {
    console.error(error);
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

    if (withdrawal.status !== 'pending') {
        return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    withdrawal.status = 'completed';
    withdrawal.transactionHash = transactionHash;
    withdrawal.approvedBy = req.user.id;
    withdrawal.completedAt = new Date();

    // Balance was already deducted at request time, so we just save the withdrawal
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

    if (withdrawal.status !== 'pending') {
        return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    withdrawal.status = 'failed';
    withdrawal.rejectionReason = rejectionReason;
    withdrawal.approvedBy = req.user.id;
    withdrawal.completedAt = new Date(); // Using completedAt to mark end of lifecycle

    // Refund balance to user (Amount was deducted on request, so we add it back)
    const user = await User.findById(withdrawal.userId);
    user.availableBalance += withdrawal.amount;
    await user.save();

    await withdrawal.save();

    // Create Transaction Record for Refund
    await Transaction.create({
        userId: user._id,
        amount: withdrawal.amount,
        type: 'deposit', // Treated as deposit/refund
        description: `Refund: Withdrawal Rejected (${rejectionReason})`,
        referenceId: withdrawal._id,
    });

    res.status(200).json({
      success: true,
      message: 'Withdrawal rejected',
      data: withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
