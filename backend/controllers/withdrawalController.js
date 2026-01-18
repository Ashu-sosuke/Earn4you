import Withdrawal from '../models/Withdrawal.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { MIN_WITHDRAWAL_AMOUNT, WITHDRAWAL_FEE_PERCENT } from '../config/constants.js';

// @desc    Request withdrawal
// @route   POST /api/withdrawals/request
// @access  Private
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;
    const withdrawalAmount = Number(amount);

    if (isNaN(withdrawalAmount)) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    // Check minimum amount
    if (withdrawalAmount < MIN_WITHDRAWAL_AMOUNT) {
      return res.status(400).json({ message: `Minimum withdrawal amount is ${MIN_WITHDRAWAL_AMOUNT} USDT` });
    }

    const user = await User.findById(req.user.id);

    // Check if user has enough balance
    if (user.availableBalance < withdrawalAmount) {
      return res.status(400).json({
        message: 'Insufficient balance',
        availableBalance: user.availableBalance,
      });
    }

    // Calculate Fees
    const fee = (withdrawalAmount * WITHDRAWAL_FEE_PERCENT) / 100;
    const netAmount = withdrawalAmount - fee;

    // Deduct Balance Immediately
    user.availableBalance -= withdrawalAmount;
    await user.save();

    // Create Withdrawal Record
    const withdrawal = new Withdrawal({
      userId: req.user.id,
      amount: withdrawalAmount,
      fee,
      netAmount,
      walletAddress,
    });
    await withdrawal.save();

    // Create Transaction Record
    await Transaction.create({
        userId: req.user.id,
        amount: -withdrawalAmount, // Negative for withdrawal
        type: 'withdrawal',
        description: `Withdrawal Request to ${walletAddress.substring(0, 10)}... (Fee: ${fee} USDT)`,
        referenceId: withdrawal._id,
        details: { walletAddress, fee, netAmount }
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted',
      data: withdrawal,
    });
  } catch (error) {
    console.error(error);
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
