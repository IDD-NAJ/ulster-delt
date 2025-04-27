const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');

const transactionController = {
  // Create new transaction
  createTransaction: async (req, res) => {
    try {
      const { fromAccount, toAccount, amount, type, description } = req.body;

      // Validate accounts
      const sourceAccount = await Account.findOne({
        _id: fromAccount,
        user: req.user.id,
        status: 'ACTIVE'
      });

      if (!sourceAccount) {
        return res.status(404).json({
          status: 'error',
          message: 'Source account not found or inactive'
        });
      }

      const destinationAccount = await Account.findOne({
        _id: toAccount,
        status: 'ACTIVE'
      });

      if (!destinationAccount) {
        return res.status(404).json({
          status: 'error',
          message: 'Destination account not found or inactive'
        });
      }

      // Check if source account has sufficient balance
      if (!sourceAccount.hasSufficientBalance(amount)) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient balance'
        });
      }

      // Create transaction
      const transaction = new Transaction({
        fromAccount,
        toAccount,
        amount,
        type,
        description,
        currency: sourceAccount.currency
      });

      // Process transaction
      await transaction.process();

      res.status(201).json({
        status: 'success',
        data: {
          transaction
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get all transactions for user
  getTransactions: async (req, res) => {
    try {
      const { page = 1, limit = 10, type, startDate, endDate } = req.query;

      // Build query
      const query = {
        $or: [
          { fromAccount: { $in: await Account.find({ user: req.user.id }).select('_id') } },
          { toAccount: { $in: await Account.find({ user: req.user.id }).select('_id') } }
        ]
      };

      if (type) query.type = type;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('fromAccount toAccount');

      const total = await Transaction.countDocuments(query);

      res.json({
        status: 'success',
        data: {
          transactions,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get transaction details
  getTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        $or: [
          { fromAccount: { $in: await Account.find({ user: req.user.id }).select('_id') } },
          { toAccount: { $in: await Account.find({ user: req.user.id }).select('_id') } }
        ]
      }).populate('fromAccount toAccount');

      if (!transaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found'
        });
      }

      res.json({
        status: 'success',
        data: {
          transaction
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Cancel transaction
  cancelTransaction: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        status: 'PENDING',
        fromAccount: { $in: await Account.find({ user: req.user.id }).select('_id') }
      });

      if (!transaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found or cannot be cancelled'
        });
      }

      transaction.status = 'CANCELLED';
      await transaction.save();

      res.json({
        status: 'success',
        message: 'Transaction cancelled successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = transactionController; 