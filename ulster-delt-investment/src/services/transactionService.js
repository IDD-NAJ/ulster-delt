const Transaction = require('../models/Transaction');
const Investment = require('../models/Investment');
const { logger } = require('../utils/db');
const { cache } = require('../utils/redis');

const CACHE_TTL = 300; // 5 minutes

const transactionService = {
  // Create new transaction
  createTransaction: async (userId, transactionData) => {
    try {
      const { investmentId, type, amount, price } = transactionData;

      // Verify investment exists and belongs to user
      const investment = await Investment.findOne({
        _id: investmentId,
        user: userId
      });

      if (!investment) {
        throw new Error('Investment not found');
      }

      // Create transaction
      const transaction = new Transaction({
        user: userId,
        investment: investmentId,
        type,
        amount,
        price,
        notes: transactionData.notes,
        metadata: transactionData.metadata
      });

      await transaction.save();

      // Update investment based on transaction type
      if (type === 'buy') {
        investment.amount += amount;
        investment.purchasePrice = (investment.purchasePrice * (investment.amount - amount) + price * amount) / investment.amount;
      } else if (type === 'sell') {
        if (investment.amount < amount) {
          throw new Error('Insufficient investment amount');
        }
        investment.amount -= amount;
      }

      investment.currentPrice = price;
      await investment.save();

      // Clear caches
      await cache.del(`transactions:${userId}`);
      await cache.del(`investments:${userId}`);

      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Get user transactions
  getUserTransactions: async (userId, options = {}) => {
    try {
      const { startDate, endDate, type, status } = options;
      const query = { user: userId };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (type) query.type = type;
      if (status) query.status = status;

      const transactions = await Transaction.find(query)
        .populate('investment', 'name symbol type')
        .sort({ date: -1 });

      return transactions;
    } catch (error) {
      logger.error('Error getting user transactions:', error);
      throw error;
    }
  },

  // Get investment transactions
  getInvestmentTransactions: async (userId, investmentId) => {
    try {
      // Verify investment belongs to user
      const investment = await Investment.findOne({
        _id: investmentId,
        user: userId
      });

      if (!investment) {
        throw new Error('Investment not found');
      }

      const transactions = await Transaction.find({
        user: userId,
        investment: investmentId
      })
        .sort({ date: -1 });

      return transactions;
    } catch (error) {
      logger.error('Error getting investment transactions:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (userId, transactionId) => {
    try {
      const transaction = await Transaction.findOne({
        _id: transactionId,
        user: userId
      }).populate('investment', 'name symbol type');

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    } catch (error) {
      logger.error('Error getting transaction by ID:', error);
      throw error;
    }
  },

  // Update transaction status
  updateTransactionStatus: async (userId, transactionId, status) => {
    try {
      const transaction = await Transaction.findOne({
        _id: transactionId,
        user: userId
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      transaction.status = status;
      await transaction.save();

      // Clear cache
      await cache.del(`transactions:${userId}`);

      return transaction;
    } catch (error) {
      logger.error('Error updating transaction status:', error);
      throw error;
    }
  },

  // Calculate transaction summary
  calculateSummary: async (userId, options = {}) => {
    try {
      const { startDate, endDate } = options;
      const query = { user: userId };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const transactions = await Transaction.find(query);

      const summary = {
        totalTransactions: transactions.length,
        totalValue: 0,
        byType: {},
        byStatus: {}
      };

      transactions.forEach(transaction => {
        // Add to total value
        summary.totalValue += transaction.totalValue;

        // Group by type
        if (!summary.byType[transaction.type]) {
          summary.byType[transaction.type] = {
            count: 0,
            totalValue: 0
          };
        }
        summary.byType[transaction.type].count++;
        summary.byType[transaction.type].totalValue += transaction.totalValue;

        // Group by status
        if (!summary.byStatus[transaction.status]) {
          summary.byStatus[transaction.status] = {
            count: 0,
            totalValue: 0
          };
        }
        summary.byStatus[transaction.status].count++;
        summary.byStatus[transaction.status].totalValue += transaction.totalValue;
      });

      return summary;
    } catch (error) {
      logger.error('Error calculating transaction summary:', error);
      throw error;
    }
  }
};

module.exports = transactionService; 