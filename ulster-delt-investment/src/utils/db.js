const mongoose = require('mongoose');
const winston = require('winston');
const { config } = require('../config');

// Configure logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: config.logging.errorFile, level: 'error' }),
    new winston.transports.File({ filename: config.logging.combinedFile })
  ]
});

if (config.app.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// MongoDB connection string
const getMongoURI = () => {
  const { uri, user, pass } = config.mongodb;
  
  if (user && pass) {
    return uri.replace('mongodb://', `mongodb://${user}:${pass}@`);
  }
  
  return uri;
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = getMongoURI();
    await mongoose.connect(uri, config.mongodb.options);
    
    logger.info('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  logger
}; 