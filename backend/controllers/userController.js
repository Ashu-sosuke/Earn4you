import User from '../models/User.js';
import Plan from '../models/Plan.js';

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Public
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user dashboard
// @route   GET /api/user/dashboard
// @access  Private
export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('plan referredBy');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalEarnings: user.totalEarnings,
          availableBalance: user.availableBalance,
          withdrawalThreshold: user.withdrawalThreshold,
          isEligibleForWithdrawal: user.availableBalance >= user.withdrawalThreshold,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { walletAddress },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get referral info
// @route   GET /api/user/referrals
// @access  Private
export const getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Find all users referred by this user
    const referredUsers = await User.find({ referredBy: req.user.id }).select(
      'username email plan totalEarnings createdAt'
    );

    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`,
        referredCount: referredUsers.length,
        referredUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
