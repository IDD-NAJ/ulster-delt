const Portfolio = require('../models/portfolio.model');
const Investment = require('../models/investment.model');
const { ValidationError, NotFoundError } = require('../utils/errors');

const portfolioController = {
    // Create new portfolio
    create: async (req, res, next) => {
        try {
            const { name, description, investments } = req.body;

            // Validate investments exist and belong to user
            const investmentIds = investments.map(inv => inv.investment);
            const existingInvestments = await Investment.find({
                _id: { $in: investmentIds },
                user: req.user._id
            });

            if (existingInvestments.length !== investmentIds.length) {
                throw new ValidationError('One or more investments not found');
            }

            // Validate allocation totals 100%
            const totalAllocation = investments.reduce((sum, inv) => sum + inv.allocation, 0);
            if (Math.abs(totalAllocation - 100) > 0.01) {
                throw new ValidationError('Investment allocations must total 100%');
            }

            const portfolio = new Portfolio({
                user: req.user._id,
                name,
                description,
                investments
            });

            await portfolio.update();
            await portfolio.save();

            res.status(201).json({
                message: 'Portfolio created successfully',
                portfolio
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all portfolios for a user
    getAll: async (req, res, next) => {
        try {
            const portfolios = await Portfolio.find({ user: req.user._id })
                .populate('investments.investment', 'name symbol type')
                .sort({ createdAt: -1 });

            res.json(portfolios);
        } catch (error) {
            next(error);
        }
    },

    // Get portfolio by ID
    getOne: async (req, res, next) => {
        try {
            const portfolio = await Portfolio.findOne({
                _id: req.params.id,
                user: req.user._id
            }).populate('investments.investment', 'name symbol type');

            if (!portfolio) {
                throw new NotFoundError('Portfolio not found');
            }

            res.json(portfolio);
        } catch (error) {
            next(error);
        }
    },

    // Update portfolio
    update: async (req, res, next) => {
        try {
            const { name, description, investments } = req.body;
            const portfolio = await Portfolio.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!portfolio) {
                throw new NotFoundError('Portfolio not found');
            }

            if (investments) {
                // Validate investments exist and belong to user
                const investmentIds = investments.map(inv => inv.investment);
                const existingInvestments = await Investment.find({
                    _id: { $in: investmentIds },
                    user: req.user._id
                });

                if (existingInvestments.length !== investmentIds.length) {
                    throw new ValidationError('One or more investments not found');
                }

                // Validate allocation totals 100%
                const totalAllocation = investments.reduce((sum, inv) => sum + inv.allocation, 0);
                if (Math.abs(totalAllocation - 100) > 0.01) {
                    throw new ValidationError('Investment allocations must total 100%');
                }

                portfolio.investments = investments;
            }

            if (name) portfolio.name = name;
            if (description) portfolio.description = description;

            await portfolio.update();
            await portfolio.save();

            res.json({
                message: 'Portfolio updated successfully',
                portfolio
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete portfolio
    delete: async (req, res, next) => {
        try {
            const portfolio = await Portfolio.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            if (!portfolio) {
                throw new NotFoundError('Portfolio not found');
            }

            res.json({
                message: 'Portfolio deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    // Get portfolio performance
    getPerformance: async (req, res, next) => {
        try {
            const portfolio = await Portfolio.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!portfolio) {
                throw new NotFoundError('Portfolio not found');
            }

            await portfolio.update();
            const performance = portfolio.performance;

            res.json({
                portfolio: portfolio.name,
                performance
            });
        } catch (error) {
            next(error);
        }
    },

    // Get portfolio risk metrics
    getRiskMetrics: async (req, res, next) => {
        try {
            const portfolio = await Portfolio.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!portfolio) {
                throw new NotFoundError('Portfolio not found');
            }

            await portfolio.update();
            const riskMetrics = portfolio.riskMetrics;

            res.json({
                portfolio: portfolio.name,
                riskMetrics
            });
        } catch (error) {
            next(error);
        }
    },

    // Get portfolio asset allocation
    getAssetAllocation: async (req, res, next) => {
        try {
            const portfolio = await Portfolio.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!portfolio) {
                throw new NotFoundError('Portfolio not found');
            }

            await portfolio.update();
            const assetAllocation = portfolio.assetAllocation;

            res.json({
                portfolio: portfolio.name,
                assetAllocation
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = portfolioController; 