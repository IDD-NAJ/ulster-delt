const Redis = require('ioredis');
const { logger } = require('./db');
const { config } = require('../config');

// Create Redis client with configuration
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  ...config.redis.options
});

// Handle Redis connection events
redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

// Cache utility functions
const cache = {
  // Set key-value pair with optional expiration
  set: async (key, value, expireSeconds = null) => {
    try {
      if (expireSeconds) {
        await redis.set(key, JSON.stringify(value), 'EX', expireSeconds);
      } else {
        await redis.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      logger.error('Redis set error:', error);
      return false;
    }
  },

  // Get value by key
  get: async (key) => {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  },

  // Delete key
  del: async (key) => {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Redis delete error:', error);
      return false;
    }
  },

  // Check if key exists
  exists: async (key) => {
    try {
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error('Redis exists error:', error);
      return false;
    }
  },

  // Set expiration for key
  expire: async (key, seconds) => {
    try {
      await redis.expire(key, seconds);
      return true;
    } catch (error) {
      logger.error('Redis expire error:', error);
      return false;
    }
  },

  // Get time to live for key
  ttl: async (key) => {
    try {
      return await redis.ttl(key);
    } catch (error) {
      logger.error('Redis ttl error:', error);
      return -2; // Key does not exist
    }
  }
};

module.exports = {
  redis,
  cache
}; 