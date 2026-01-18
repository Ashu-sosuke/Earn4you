import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    transactionHash: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin user
    },
    rejectionReason: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Withdrawal', withdrawalSchema);
