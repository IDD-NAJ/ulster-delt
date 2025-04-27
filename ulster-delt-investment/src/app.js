const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { serve: swaggerServe, setup: swaggerSetup } = require('./config/swagger');
const { connectDB } = require('./utils/db');
const { config, validateConfig } = require('./config');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middleware/errorHandler');
const securityMiddleware = require('./middleware/security');

// Create Express app
const app = express();

// Validate configuration
validateConfig();

// Security middleware
app.use(helmet()); // Security headers
securityMiddleware.applyRateLimit(app);
securityMiddleware.applySecurityHeaders(app);
securityMiddleware.applySanitization(app);
securityMiddleware.applyCORS(app);

// Basic middleware
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded bodies

// Logging middleware
if (config.app.env !== 'production') {
  app.use(morgan('dev'));
}

// Swagger documentation
app.use('/api-docs', swaggerServe, swaggerSetup);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.app.env
  });
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(config.app.port, () => {
      console.log(`Server is running on port ${config.app.port}`);
      console.log(`Environment: ${config.app.env}`);
      console.log(`API Documentation: http://localhost:${config.app.port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app; 