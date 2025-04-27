const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Please verify your email address'
      });
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        status: 'error',
        message: 'Account is not active'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token'
    });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Two-factor authentication middleware
const require2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.twoFactorEnabled && !req.session.twoFactorVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Two-factor authentication required'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking 2FA status'
    });
  }
};

module.exports = {
  authMiddleware,
  authorize,
  require2FA
}; 