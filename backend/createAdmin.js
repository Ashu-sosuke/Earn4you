import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@earn4you.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating role to admin...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin role updated.');
    } else {
      console.log('Creating new admin user...');
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash('admin123', salt);

      const admin = new User({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        walletAddress: 'admin_wallet_TRC20',
        referralCode: 'ADMIN01',
        isActive: true,
        role: 'admin',
      });

      await admin.save();
      console.log('Admin user created successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
