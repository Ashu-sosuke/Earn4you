import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const users = await User.find({});
    console.log(`Total users found: ${users.length}`);
    console.log(users);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

listUsers();
