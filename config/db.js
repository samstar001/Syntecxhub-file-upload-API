import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // load variables from .env into process.env

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // stop the app — it can't run without a database
  }
}

export default connectDB;