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
