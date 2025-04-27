const User = require('../models/User');
const { logger } = require('../utils/db');
const { cache } = require('../utils/redis');

const CACHE_TTL = 3600; // 1 hour

const userService = {
  // Create new user
  createUser: async (userData) => {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      // Try to get from cache first
      const cachedUser = await cache.get(`user:${userId}`);
      if (cachedUser) {
        return cachedUser;
      }

      // If not in cache, get from database
      const user = await User.findById(userId).select('-password');
      if (user) {
        // Cache the user
        await cache.set(`user:${userId}`, user, CACHE_TTL);
      }
      return user;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, updateData) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (user) {
        // Update cache
        await cache.set(`user:${userId}`, user, CACHE_TTL);
      }
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (user) {
        // Remove from cache
        await cache.del(`user:${userId}`);
      }
      return user;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get all users (admin only)
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();
      
      return {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { role } },
        { new: true, runValidators: true }
      ).select('-password');

      if (user) {
        // Update cache
        await cache.set(`user:${userId}`, user, CACHE_TTL);
      }
      return user;
    } catch (error) {
      logger.error('Error updating user role:', error);
      throw error;
    }
  }
};

module.exports = userService; 