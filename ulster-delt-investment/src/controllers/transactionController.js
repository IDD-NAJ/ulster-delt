const Transaction = require('../models/transaction.model');
const Investment = require('../models/investment.model');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { logger } = require('../utils/db');
const { cache } = require('../utils/redis');

const CACHE_TTL = 300; // 5 minutes

const transactionController = {
  // Create new transaction
  create: async (req, res, next) => {
    try {
      const { investmentId, type, amount, price, quantity, date, description, fees, tax } = req.body;

      // Validate investment exists and belongs to user
      const investment = await Investment.findOne({
        _id: investmentId,
        user: req.user._id
      });

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      // Create transaction
      const transaction = new Transaction({
        user: req.user._id,
        investment: investmentId,
        type,
        amount,
        price,
        quantity,
        date: date || new Date(),
        description,
        fees: fees || 0,
        tax: tax || 0
      });

      await transaction.save();

      // Update investment based on transaction type
      if (type === 'BUY') {
        investment.quantity += quantity;
        investment.purchasePrice = price;
      } else if (type === 'SELL') {
        if (investment.quantity < quantity) {
          throw new ValidationError('Insufficient quantity to sell');
        }
        investment.quantity -= quantity;
      }

      await investment.save();

      // Clear caches
      await cache.del(`transactions:${req.user._id}`);
      await cache.del(`investments:${req.user._id}`);

      res.status(201).json({
        message: 'Transaction created successfully',
        transaction
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all transactions for a user
  getAll: async (req, res, next) => {
    try {
      // Try to get from cache first
      const cachedTransactions = await cache.get(`transactions:${req.user._id}`);
      if (cachedTransactions) {
        return res.json(cachedTransactions);
      }

      const transactions = await Transaction.find({ user: req.user._id })
        .populate('investment', 'name symbol')
        .sort({ date: -1 });

      // Cache the transactions
      await cache.set(`transactions:${req.user._id}`, transactions, CACHE_TTL);

      res.json(transactions);
    } catch (error) {
      next(error);
    }
  },

  // Get transactions for a specific investment
  getByInvestment: async (req, res, next) => {
    try {
      const { investmentId } = req.params;

      // Verify investment belongs to user
      const investment = await Investment.findOne({
        _id: investmentId,
        user: req.user._id
      });

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      const transactions = await Transaction.find({
        user: req.user._id,
        investment: investmentId
      }).sort({ date: -1 });

      res.json(transactions);
    } catch (error) {
      next(error);
    }
  },

  // Get transaction by ID
  getOne: async (req, res, next) => {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('investment', 'name symbol');

      if (!transaction) {
        throw new NotFoundError('Transaction not found');
      }

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  },

  // Update transaction status
  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!transaction) {
        throw new NotFoundError('Transaction not found');
      }

      transaction.status = status;
      await transaction.save();

      // Clear cache
      await cache.del(`transactions:${req.user._id}`);

      res.json({
        message: 'Transaction status updated successfully',
        transaction
      });
    } catch (error) {
      next(error);
    }
  },

  // Get transaction summary
  getSummary: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const query = { user: req.user._id };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const transactions = await Transaction.find(query);

      const summary = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        totalFees: transactions.reduce((sum, t) => sum + t.fees, 0),
        totalTax: transactions.reduce((sum, t) => sum + t.tax, 0),
        byType: {}
      };

      // Group by transaction type
      transactions.forEach(transaction => {
        if (!summary.byType[transaction.type]) {
          summary.byType[transaction.type] = {
            count: 0,
            totalAmount: 0
          };
        }
        summary.byType[transaction.type].count++;
        summary.byType[transaction.type].totalAmount += transaction.amount;
      });

      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transactionController; 