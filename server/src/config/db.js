import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const primaryUri = process.env.MONGODB_URI;
const fallbackUri = process.env.MONGODB_FALLBACK_URI || 'mongodb://127.0.0.1:27017/billing';

export const connectDB = async () => {
  if (primaryUri) {
    try {
      console.log('Attempting connection to Primary MongoDB (Atlas)...');
      await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Primary MongoDB Connected: ${mongoose.connection.host} / ${mongoose.connection.name}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Primary MongoDB connection failed (${err.message}).`);
      console.log(`Falling back to local MongoDB: ${fallbackUri}`);
    }
  }

  try {
    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Fallback MongoDB Connected: ${mongoose.connection.host} / ${mongoose.connection.name}`);
  } catch (fallbackErr) {
    console.error('❌ Both Primary and Fallback MongoDB connections failed:', fallbackErr);
    process.exit(1);
  }
};
