const Investment = require('../models/investment.model');
const Account = require('../models/Account');
const { calculateReturns, calculateDiversification, calculateRiskMetrics } = require('../services/investmentService');
const { validateInvestment } = require('../utils/validation');
const { AppError } = require('../utils/errorHandler');
const { logger } = require('../utils/db');
const { cache } = require('../utils/redis');
const { ValidationError, NotFoundError } = require('../utils/errors');

const CACHE_TTL = 300; // 5 minutes

const investmentController = {
  // Create new investment
  create: async (req, res, next) => {
    try {
      const investmentData = {
        ...req.body,
        user: req.user._id
      };

      const investment = new Investment(investmentData);
      await investment.save();

      res.status(201).json({
        message: 'Investment created successfully',
        investment
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all investments for a user
  getAll: async (req, res, next) => {
    try {
      const investments = await Investment.find({ user: req.user._id })
        .sort({ createdAt: -1 });

      res.json(investments);
    } catch (error) {
      next(error);
    }
  },

  // Get single investment
  getOne: async (req, res, next) => {
    try {
      const investment = await Investment.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      res.json(investment);
    } catch (error) {
      next(error);
    }
  },

  // Update investment
  update: async (req, res, next) => {
    try {
      const investment = await Investment.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      // Update fields
      Object.keys(req.body).forEach(key => {
        if (key !== 'user' && key !== '_id') {
          investment[key] = req.body[key];
        }
      });

      await investment.save();

      res.json({
        message: 'Investment updated successfully',
        investment
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete investment
  delete: async (req, res, next) => {
    try {
      const investment = await Investment.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      res.json({
        message: 'Investment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Update investment price
  updatePrice: async (req, res, next) => {
    try {
      const { price } = req.body;
      
      if (!price || price <= 0) {
        throw new ValidationError('Invalid price');
      }

      const investment = await Investment.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      await investment.updatePrice(price);

      res.json({
        message: 'Price updated successfully',
        investment
      });
    } catch (error) {
      next(error);
    }
  },

  // Get investment performance
  getPerformance: async (req, res, next) => {
    try {
      const investment = await Investment.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      const performance = investment.calculatePerformance();

      res.json({
        investment: investment.symbol,
        performance
      });
    } catch (error) {
      next(error);
    }
  },

  // Get investment returns
  getInvestmentReturns: async (req, res, next) => {
    try {
      const investment = await Investment.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!investment) {
        throw new AppError('Investment not found', 404);
      }

      const returns = calculateReturns(investment);

      res.status(200).json({
        status: 'success',
        data: returns
      });
    } catch (error) {
      next(error);
    }
  },

  // Get portfolio diversification
  getDiversification: async (req, res, next) => {
    try {
      const investments = await Investment.find({
        userId: req.user._id,
        status: 'active'
      });

      const diversification = calculateDiversification(investments);

      res.status(200).json({
        status: 'success',
        data: diversification
      });
    } catch (error) {
      next(error);
    }
  },

  // Get risk metrics
  getRiskMetrics: async (req, res, next) => {
    try {
      const investments = await Investment.find({
        userId: req.user._id,
        status: 'active'
      });

      const riskMetrics = calculateRiskMetrics(investments);

      res.status(200).json({
        status: 'success',
        data: riskMetrics
      });
    } catch (error) {
      next(error);
    }
  },

  // Get monthly performance report
  getMonthlyReport: async (req, res, next) => {
    try {
      const { month } = req.query;
      const startDate = new Date(month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      const investments = await Investment.find({
        userId: req.user._id,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      const report = {
        totalValue: investments.reduce((sum, inv) => sum + inv.amount, 0),
        monthlyReturn: investments.reduce((sum, inv) => sum + (inv.currentPrice - inv.purchasePrice), 0),
        monthlyReturnPercentage: 0,
        investments
      };

      report.monthlyReturnPercentage = (report.monthlyReturn / report.totalValue) * 100;

      res.status(200).json({
        status: 'success',
        data: report
      });
    } catch (error) {
      next(error);
    }
  },

  // Get tax report
  getTaxReport: async (req, res, next) => {
    try {
      const { year } = req.query;
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      const investments = await Investment.find({
        userId: req.user._id,
        status: 'sold',
        soldAt: { $gte: startDate, $lte: endDate }
      });

      const report = {
        totalGains: 0,
        totalLosses: 0,
        netGains: 0,
        taxableAmount: 0
      };

      investments.forEach(investment => {
        const gain = investment.soldPrice - investment.purchasePrice;
        if (gain > 0) {
          report.totalGains += gain;
        } else {
          report.totalLosses += Math.abs(gain);
        }
      });

      report.netGains = report.totalGains - report.totalLosses;
      report.taxableAmount = Math.max(0, report.netGains);

      res.status(200).json({
        status: 'success',
        data: report
      });
    } catch (error) {
      next(error);
    }
  },

  // Get portfolio allocation report
  getAllocationReport: async (req, res, next) => {
    try {
      const investments = await Investment.find({
        userId: req.user._id,
        status: 'active'
      });

      const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);

      const allocation = {
        byType: {},
        bySector: {},
        byCurrency: {}
      };

      investments.forEach(investment => {
        // Allocation by type
        allocation.byType[investment.type] = (allocation.byType[investment.type] || 0) + 
          (investment.amount / totalAmount * 100);

        // Allocation by sector
        if (investment.sector) {
          allocation.bySector[investment.sector] = (allocation.bySector[investment.sector] || 0) + 
            (investment.amount / totalAmount * 100);
        }

        // Allocation by currency
        allocation.byCurrency[investment.currency] = (allocation.byCurrency[investment.currency] || 0) + 
          (investment.amount / totalAmount * 100);
      });

      res.status(200).json({
        status: 'success',
        data: allocation
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = investmentController; 