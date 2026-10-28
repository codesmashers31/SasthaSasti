import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares - Production-ready CORS for Render & Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean).map((u) => u.trim().replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      allowedOrigins.includes('*') ||
      cleanOrigin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Divya Murti ERP & Sacred POS Server',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Divya Murti Backend running on http://localhost:${PORT}`);
    console.log(`🗄️  Connected to MongoDB: billing`);
    console.log(`⚡ API Base Endpoint: http://localhost:${PORT}/api`);
    console.log(`======================================================\n`);
  });
};

startServer();
