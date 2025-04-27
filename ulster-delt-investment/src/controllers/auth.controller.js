const User = require('../models/user.model');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { generateOTP } = require('../utils/otp');
const { authMiddleware, authorize, require2FA } = require('../middleware/auth.middleware');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, phoneNumber, dateOfBirth } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already registered'
        });
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        dateOfBirth
      });

      await user.save();

      // Generate verification token
      const verificationToken = user.generateAuthToken();

      // Send verification email
      await sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Please check your email for verification.',
        data: {
          user: user.getProfile()
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(403).json({
          status: 'error',
          message: 'Please verify your email address'
        });
      }

      // Generate JWT token
      const token = user.generateAuthToken();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        status: 'success',
        data: {
          token,
          user: user.getProfile()
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Verify email
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find and update user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      user.isVerified = true;
      await user.save();

      res.json({
        status: 'success',
        message: 'Email verified successfully'
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
  },

  // Forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Generate password reset token
      const resetToken = user.generateAuthToken();

      // Send password reset email
      await sendPasswordResetEmail(user.email, resetToken);

      res.json({
        status: 'success',
        message: 'Password reset instructions sent to your email'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find and update user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      user.password = password;
      await user.save();

      res.json({
        status: 'success',
        message: 'Password reset successful'
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
  },

  // Enable/disable 2FA
  toggle2FA: async (req, res) => {
    try {
      const { enable } = req.body;
      const user = await User.findById(req.user.id);

      if (enable) {
        // Generate and save OTP secret
        const secret = generateOTP();
        user.twoFactorSecret = secret;
        user.twoFactorEnabled = true;
      } else {
        user.twoFactorSecret = null;
        user.twoFactorEnabled = false;
      }

      await user.save();

      res.json({
        status: 'success',
        message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'}`,
        data: enable ? { secret: user.twoFactorSecret } : null
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = authController; 