import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const email = 'user@gmail.com';
    const password = '123456';
    const username = 'TestUser';

    let user = await User.findOne({ email });

    if (user) {
      console.log('User already exists, updating password...');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // Optional: Give them some balance if "dump amount" meant balance
      user.availableBalance = 1000; 
      await user.save();
      console.log('User password updated and balance set to 1000.');
    } else {
      console.log('Creating new user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        username,
        email,
        password: hashedPassword,
        walletAddress: '0xTestUserWalletAddress123456',
        availableBalance: 1000,
      });

      await user.save();
      console.log('User created successfully with balance 1000.');
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createTestUser();
