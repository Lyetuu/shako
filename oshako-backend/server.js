// server.js - Entry point for the backend
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');

// Load environment variables
require('dotenv').config();

// Initialize app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to databases
connectDB();

// Routes
app.use('/api/users', require('./api/routes/userRoutes'));
app.use('/api/auth', require('./api/routes/authRoutes'));
app.use('/api/groups', require('./api/routes/groupRoutes'));
app.use('/api/savings', require('./api/routes/savingsRoutes'));
app.use('/api/payments', require('./api/routes/paymentRoutes'));
app.use('/api/companies', require('./api/routes/companyRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// config/database.js - Database connection
const mongoose = require('mongoose');
const { Pool } = require('pg');

// PostgreSQL connection
const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Main connection function
const connectDB = async () => {
  // Test PostgreSQL connection
  try {
    const pgClient = await pgPool.connect();
    console.log('PostgreSQL connected');
    pgClient.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }
  
  // Connect to MongoDB
  await connectMongoDB();
};

module.exports = { pgPool, connectDB };
