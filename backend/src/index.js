require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Keep the process running
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  // Keep the process running
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // React default
  'https://medgenius-ai-production.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      // detailed error for debugging
      console.log('BLOCKED CORS ORIGIN:', origin);
      // For development, we can be more permissive if needed, but let's strictly add the port first.
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', require('./routes/ai'));
app.use('/api/reports', require('./routes/reports'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to MongoDB with aggressive retry for production
let isMongoConnected = false;

const connectDB = async () => {
  const maxRetries = 5; // Reduce retries for faster feedback
  let retryCount = 0;
  
  while (retryCount < maxRetries && !isMongoConnected) {
    try {
      console.log(`🔄 MongoDB connection attempt ${retryCount + 1}/${maxRetries}`);
      console.log(`📡 Connecting to: ${process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')}`);
      
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 15000, // Reduce timeout for faster feedback
        connectTimeoutMS: 15000,
        socketTimeoutMS: 20000,
      });
      
      console.log('✅ Connected to MongoDB Atlas');
      console.log('📊 Database:', mongoose.connection.name);
      console.log('🌐 Host:', mongoose.connection.host);
      console.log('📈 Ready state:', mongoose.connection.readyState);
      isMongoConnected = true;
      return;
    } catch (error) {
      retryCount++;
      console.error(`❌ MongoDB connection attempt ${retryCount}/${maxRetries} failed:`);
      console.error(`   Error: ${error.message}`);
      
      // Specific error diagnostics
      if (error.message.includes('ENOTFOUND')) {
        console.log('🔍 DNS Resolution failed - check cluster URL');
      } else if (error.message.includes('authentication')) {
        console.log('🔍 Authentication failed - check username/password');
      } else if (error.message.includes('timeout')) {
        console.log('🔍 Connection timeout - check network/firewall');
      }
      
      if (retryCount < maxRetries) {
        console.log(`⏳ Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('💥 All MongoDB connection attempts failed');
        console.log('🔧 Troubleshooting checklist:');
        console.log('   ✓ MongoDB Atlas cluster is running (not paused)');
        console.log('   ✓ IP address 0.0.0.0/0 is whitelisted');
        console.log('   ✓ Username: med');
        console.log('   ✓ Password: Barad@2005');
        console.log('   ✓ Database: medgenius');
        console.log('   ✓ Network connectivity');
        isMongoConnected = false;
      }
    }
  }
};

// Middleware to check MongoDB status
app.use((req, res, next) => {
  req.isMongoConnected = isMongoConnected;
  next();
});

// Start server and connect to MongoDB
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with retries
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    if (isMongoConnected) {
      console.log('💾 Using real MongoDB data');
    } else {
      console.log('⚠️  MongoDB connection failed - check configuration');
    }
  }).on('error', (error) => {
    console.error('Server error:', error);
  });
});