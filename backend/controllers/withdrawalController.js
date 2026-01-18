import Withdrawal from '../models/Withdrawal.js';
import User from '../models/User.js';

// @desc    Request withdrawal
// @route   POST /api/withdrawals/request
// @access  Private
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;

    const user = await User.findById(req.user.id);

    // Check if user has enough balance
    if (user.availableBalance < amount) {
      return res.status(400).json({
        message: 'Insufficient balance',
        availableBalance: user.availableBalance,
      });
    }

    // Check withdrawal threshold
    if (amount < 10) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is 10 USDT' });
    }

    const withdrawal = new Withdrawal({
      userId: req.user.id,
      amount,
      walletAddress,
    });

    await withdrawal.save();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted',
      data: withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get withdrawal history
// @route   GET /api/withdrawals/history
// @access  Private
export const getWithdrawalHistory = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: withdrawals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending withdrawals (Admin)
// @route   GET /api/admin/withdrawals/pending
// @access  Private/Admin
export const getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: 'pending' })
      .populate('userId', 'username email walletAddress')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: withdrawals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
