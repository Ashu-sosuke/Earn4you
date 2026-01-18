import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './models/Plan.js';
import User from './models/User.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const planCount = await Plan.countDocuments();
        console.log(`Plans count: ${planCount}`);

        const plans = await Plan.find();
        console.log('Plans:', plans);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
