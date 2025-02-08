import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export const isValidID = (id) => mongoose.Types.ObjectId.isValid(id);