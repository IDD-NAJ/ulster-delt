const Joi = require('joi');
const { logger } = require('../utils/db');

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation error:', { errors, body: req.body });
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    phoneNumber: Joi.string().required().pattern(/^\+?[1-9]\d{1,14}$/),
    dateOfBirth: Joi.date().required().max('now'),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      postalCode: Joi.string().required()
    })
  }),

  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      postalCode: Joi.string()
    })
  }),

  forgotPassword: Joi.object({
    email: Joi.string().required().email()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  }),

  // Investment schemas
  createInvestment: Joi.object({
    type: Joi.string().valid('stocks', 'bonds', 'mutual_funds', 'etf', 'crypto').required(),
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    purchasePrice: Joi.number().min(0).required(),
    currentPrice: Joi.number().min(0).required(),
    notes: Joi.string()
  }),

  updateInvestment: Joi.object({
    name: Joi.string(),
    amount: Joi.number().min(0),
    currentPrice: Joi.number().min(0),
    notes: Joi.string()
  }),

  // Transaction schemas
  createTransaction: Joi.object({
    investmentId: Joi.string().required(),
    type: Joi.string().valid('buy', 'sell', 'dividend', 'interest', 'fee').required(),
    amount: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    notes: Joi.string(),
    metadata: Joi.object()
  }),

  updateTransactionStatus: Joi.object({
    status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled').required()
  })
};

module.exports = {
  validate,
  schemas
}; 