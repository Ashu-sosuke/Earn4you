import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Plan from '../models/Plan.js';
import Referral from '../models/Referral.js';

// @desc    Initiate payment
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const { planId, walletAddress, transactionHash } = req.body;

    // Get plan details
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.user.id,
      planId,
      amount: plan.price,
      walletAddress,
      transactionHash,
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment initiated. Please send USDT to the provided address.',
      data: {
        paymentId: payment._id,
        amount: plan.price,
        currency: 'USDT',
        walletAddress, // Your project's wallet address
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending payments for user
// @route   GET /api/payments/pending
// @access  Private
export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user.id,
      status: 'pending',
    }).populate('planId');

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment history for user
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).populate('planId').sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
