import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Plan from './models/Plan.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Plan.deleteMany({});

    // Create plans
    const plans = [
      {
        name: 'Starter',
        price: 10,
        currency: 'USDT',
        referralCommission: 10,
        description: 'Basic plan for beginners',
        features: ['Feature 1', 'Feature 2'],
      },
      {
        name: 'Pro',
        price: 50,
        currency: 'USDT',
        referralCommission: 15,
        description: 'Professional plan with more features',
        features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
      },
      {
        name: 'Premium',
        price: 100,
        currency: 'USDT',
        referralCommission: 20,
        description: 'Premium plan with all features',
        features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
      },
    ];

    const createdPlans = await Plan.insertMany(plans);
    console.log('Plans created:', createdPlans.length);

    // Create admin user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);

    const admin = new User({
      username: 'admin',
      email: 'admin@earn4you.com',
      password: hashedPassword,
      walletAddress: 'admin_wallet_address',
      referralCode: 'ADMIN_CODE',
      isActive: true,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
