const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const qrcode = require('qrcode');
const { config } = require('../config');
const User = require('../models/User');
const { logger } = require('../utils/db');
const { sendEmail } = require('../utils/email');
const {
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError
} = require('../utils/errors');

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

const authController = {
  // Register new user
  register: async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Login user
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current user
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const { firstName, lastName } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Request password reset
  requestPasswordReset: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      // Send reset email
      const resetUrl = `${config.app.frontendUrl}/reset-password/${resetToken}`;
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: `Please click the following link to reset your password: ${resetUrl}`
      });

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      next(error);
    }
  },

  // Reset password
  resetPassword: async (req, res, next) => {
    try {
      const { token, password } = req.body;

      // Hash token
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        throw new ValidationError('Invalid or expired reset token');
      }

      // Update password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  },

  // Verify email
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.params;
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpire: { $gt: Date.now() }
      });

      if (!user) {
        throw new ValidationError('Invalid or expired verification token');
      }

      user.isVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Request email verification
  requestEmailVerification: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (user.isVerified) {
        throw new ValidationError('Email already verified');
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
      user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      await user.save();

      // Send verification email
      const verificationUrl = `${config.app.frontendUrl}/verify-email/${verificationToken}`;
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message: `Please click the following link to verify your email: ${verificationUrl}`
      });

      res.json({ message: 'Verification email sent' });
    } catch (error) {
      next(error);
    }
  },

  // Setup 2FA
  setupTwoFactor: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.twoFactorEnabled) {
        throw new ValidationError('2FA is already enabled');
      }

      // Generate secret
      const secret = user.generateTwoFactorSecret();
      await user.save();

      // Generate QR code
      const qrCode = await qrcode.toDataURL(secret.otpauth_url);

      res.json({
        message: '2FA setup initiated',
        secret: secret.base32,
        qrCode
      });
    } catch (error) {
      next(error);
    }
  },

  // Verify and enable 2FA
  verifyAndEnableTwoFactor: async (req, res, next) => {
    try {
      const { token } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.twoFactorEnabled) {
        throw new ValidationError('2FA is already enabled');
      }

      // Verify token
      const isValid = user.verifyTwoFactorToken(token);
      if (!isValid) {
        throw new ValidationError('Invalid 2FA token');
      }

      // Enable 2FA and generate backup codes
      user.twoFactorEnabled = true;
      const backupCodes = user.generateBackupCodes();
      await user.save();

      res.json({
        message: '2FA enabled successfully',
        backupCodes: backupCodes.map(code => code.code)
      });
    } catch (error) {
      next(error);
    }
  },

  // Disable 2FA
  disableTwoFactor: async (req, res, next) => {
    try {
      const { token } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.twoFactorEnabled) {
        throw new ValidationError('2FA is not enabled');
      }

      // Verify token
      const isValid = user.verifyTwoFactorToken(token);
      if (!isValid) {
        throw new ValidationError('Invalid 2FA token');
      }

      // Disable 2FA
      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;
      user.twoFactorBackupCodes = [];
      await user.save();

      res.json({ message: '2FA disabled successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Verify 2FA token during login
  verifyTwoFactor: async (req, res, next) => {
    try {
      const { email, token } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.twoFactorEnabled) {
        throw new ValidationError('2FA is not enabled');
      }

      // Verify token
      const isValid = user.verifyTwoFactorToken(token);
      if (!isValid) {
        throw new ValidationError('Invalid 2FA token');
      }

      // Generate token
      const authToken = generateToken(user._id);

      res.json({
        message: '2FA verification successful',
        token: authToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Use backup code
  useBackupCode: async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.twoFactorEnabled) {
        throw new ValidationError('2FA is not enabled');
      }

      // Verify backup code
      const isValid = user.verifyBackupCode(code);
      if (!isValid) {
        throw new ValidationError('Invalid backup code');
      }

      await user.save();

      // Generate token
      const authToken = generateToken(user._id);

      res.json({
        message: 'Backup code verification successful',
        token: authToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController; 