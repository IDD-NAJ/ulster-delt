const Joi = require('joi');
const { AppError } = require('./errorHandler');

// Investment validation schemas
const investmentSchemas = {
    // Schema for creating a new investment
    create: Joi.object({
        accountId: Joi.string().required().messages({
            'string.empty': 'Account ID is required',
            'any.required': 'Account ID is required'
        }),
        type: Joi.string().valid('stocks', 'bonds', 'etf', 'mutual_funds').required().messages({
            'string.empty': 'Investment type is required',
            'any.only': 'Investment type must be one of: stocks, bonds, etf, mutual_funds'
        }),
        amount: Joi.number().positive().required().messages({
            'number.base': 'Amount must be a number',
            'number.positive': 'Amount must be greater than 0',
            'any.required': 'Amount is required'
        }),
        currency: Joi.string().valid('USD', 'EUR', 'GBP').required().messages({
            'string.empty': 'Currency is required',
            'any.only': 'Currency must be one of: USD, EUR, GBP'
        }),
        sector: Joi.string().valid(
            'technology',
            'healthcare',
            'finance',
            'energy',
            'consumer',
            'industrial',
            'materials',
            'utilities',
            'real_estate'
        ).optional().messages({
            'any.only': 'Invalid sector'
        }),
        purchasePrice: Joi.number().positive().optional().messages({
            'number.base': 'Purchase price must be a number',
            'number.positive': 'Purchase price must be greater than 0'
        }),
        shares: Joi.number().positive().optional().messages({
            'number.base': 'Shares must be a number',
            'number.positive': 'Shares must be greater than 0'
        })
    }),

    // Schema for updating an investment
    update: Joi.object({
        status: Joi.string().valid('active', 'sold', 'pending').required().messages({
            'string.empty': 'Status is required',
            'any.only': 'Status must be one of: active, sold, pending'
        }),
        currentPrice: Joi.number().positive().optional().messages({
            'number.base': 'Current price must be a number',
            'number.positive': 'Current price must be greater than 0'
        }),
        soldPrice: Joi.number().positive().optional().messages({
            'number.base': 'Sold price must be a number',
            'number.positive': 'Sold price must be greater than 0'
        })
    }),

    // Schema for investment returns query
    returns: Joi.object({
        startDate: Joi.date().iso().optional().messages({
            'date.base': 'Start date must be a valid date',
            'date.format': 'Start date must be in ISO format'
        }),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
            'date.base': 'End date must be a valid date',
            'date.format': 'End date must be in ISO format',
            'date.min': 'End date must be after start date'
        })
    }),

    // Schema for performance report query
    performance: Joi.object({
        month: Joi.date().iso().required().messages({
            'date.base': 'Month must be a valid date',
            'date.format': 'Month must be in ISO format',
            'any.required': 'Month is required'
        })
    }),

    // Schema for tax report query
    tax: Joi.object({
        year: Joi.number().integer().min(2000).max(new Date().getFullYear()).required().messages({
            'number.base': 'Year must be a number',
            'number.integer': 'Year must be an integer',
            'number.min': 'Year must be 2000 or later',
            'number.max': 'Year cannot be in the future',
            'any.required': 'Year is required'
        })
    })
};

// Validation middleware
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const schema = investmentSchemas[schemaName];
        if (!schema) {
            return next(new AppError('Invalid validation schema', 500));
        }

        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(errorMessage, 400));
        }

        next();
    };
};

// Business rule validation
const validateBusinessRules = {
    // Validate investment creation
    createInvestment: async (req, res, next) => {
        try {
            const { amount, type } = req.body;

            // Check minimum investment amount based on type
            const minimumAmounts = {
                stocks: 100,
                bonds: 1000,
                etf: 50,
                mutual_funds: 500
            };

            if (amount < minimumAmounts[type]) {
                throw new AppError(
                    `Minimum investment amount for ${type} is ${minimumAmounts[type]} ${req.body.currency}`,
                    400
                );
            }

            // Check maximum investment amount
            const maximumAmount = 1000000; // $1M
            if (amount > maximumAmount) {
                throw new AppError(
                    `Maximum investment amount is ${maximumAmount} ${req.body.currency}`,
                    400
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    },

    // Validate investment update
    updateInvestment: async (req, res, next) => {
        try {
            const { status, currentPrice } = req.body;
            const investment = req.investment; // Set by previous middleware

            // Validate status transition
            const validTransitions = {
                active: ['sold', 'pending'],
                pending: ['active', 'sold'],
                sold: []
            };

            if (!validTransitions[investment.status].includes(status)) {
                throw new AppError(
                    `Cannot change status from ${investment.status} to ${status}`,
                    400
                );
            }

            // Validate price update
            if (currentPrice) {
                const maxPriceChange = 0.5; // 50% maximum price change
                const priceChange = Math.abs(currentPrice - investment.currentPrice) / investment.currentPrice;

                if (priceChange > maxPriceChange) {
                    throw new AppError(
                        `Price change exceeds maximum allowed change of ${maxPriceChange * 100}%`,
                        400
                    );
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = {
    validateRequest,
    validateBusinessRules,
    investmentSchemas
}; 