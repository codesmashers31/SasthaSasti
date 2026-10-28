import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const rawUri = process.env.MONGODB_URI;
const primaryUri = rawUri ? rawUri.trim().replace(/^["']|["']$/g, '') : null;
const fallbackUri = process.env.MONGODB_FALLBACK_URI || 'mongodb://127.0.0.1:27017/billing';
const isProd = process.env.NODE_ENV === 'production';

export const connectDB = async () => {
  if (primaryUri) {
    try {
      console.log('Attempting connection to Primary MongoDB (Atlas)...');
      await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✅ Primary MongoDB Connected: ${mongoose.connection.host} / ${mongoose.connection.name}`);
      return;
    } catch (err) {
      console.error(`❌ Primary MongoDB connection failed: ${err.message}`);
      if (err.message.includes('auth') || err.message.includes('Authentication')) {
        console.error('👉 TIP: MongoDB Atlas rejected your username/password (bad auth).');
        console.error('👉 Please check MongoDB Atlas > Database Access, verify/reset the user password, and update MONGODB_URI in Render.');
      }
      if (isProd) {
        console.error('❌ In production mode, local MongoDB fallback is disabled.');
        process.exit(1);
      }
      console.log(`Falling back to local MongoDB: ${fallbackUri}`);
    }
  }

  if (!isProd) {
    try {
      await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Fallback MongoDB Connected: ${mongoose.connection.host} / ${mongoose.connection.name}`);
    } catch (fallbackErr) {
      console.error('❌ Both Primary and Fallback MongoDB connections failed:', fallbackErr);
      process.exit(1);
    }
  } else {
    console.error('❌ MONGODB_URI is not defined in production environment.');
    process.exit(1);
  }
};
