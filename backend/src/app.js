const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const imagekitRoutes = require('./routes/imagekitRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["https://www.youtube-nocookie.com", "https://www.youtube.com"],
      imgSrc: ["'self'", "https://ik.imagekit.io", "data:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://afsheens-creation.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

// DISABLE CACHING
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', uploadRoutes);
// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Afsheen\'s Creations API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// DEBUG ROUTE - Check admin exists
app.get('/api/debug/admin', async (req, res) => {
  try {
    const User = require('./models/User');
    const admin = await User.findOne({ role: 'admin' }).select('+password');
    if (!admin) {
      return res.json({ 
        exists: false, 
        message: 'No admin found. Run seed script first.' 
      });
    }
    res.json({
      exists: true,
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length || 0,
      isActive: admin.isActive,
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/imagekit', imagekitRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;