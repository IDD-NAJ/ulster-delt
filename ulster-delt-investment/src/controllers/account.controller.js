const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');

const accountController = {
  // Create new account
  createAccount: async (req, res) => {
    try {
      const { type, currency } = req.body;
      const userId = req.user.id;

      // Check if user already has an account of this type
      const existingAccount = await Account.findOne({
        user: userId,
        type,
        status: 'ACTIVE'
      });

      if (existingAccount) {
        return res.status(400).json({
          status: 'error',
          message: `You already have an active ${type.toLowerCase()} account`
        });
      }

      // Create new account
      const account = new Account({
        user: userId,
        type,
        currency
      });

      await account.save();

      res.status(201).json({
        status: 'success',
        data: {
          account
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get all accounts for user
  getAccounts: async (req, res) => {
    try {
      const accounts = await Account.find({ user: req.user.id });
      
      res.json({
        status: 'success',
        data: {
          accounts
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get account details
  getAccount: async (req, res) => {
    try {
      const account = await Account.findOne({
        _id: req.params.id,
        user: req.user.id
      });

      if (!account) {
        return res.status(404).json({
          status: 'error',
          message: 'Account not found'
        });
      }

      res.json({
        status: 'success',
        data: {
          account
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Update account
  updateAccount: async (req, res) => {
    try {
      const { minimumBalance, overdraftLimit } = req.body;
      
      const account = await Account.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { minimumBalance, overdraftLimit },
        { new: true, runValidators: true }
      );

      if (!account) {
        return res.status(404).json({
          status: 'error',
          message: 'Account not found'
        });
      }

      res.json({
        status: 'success',
        data: {
          account
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Close account
  closeAccount: async (req, res) => {
    try {
      const account = await Account.findOne({
        _id: req.params.id,
        user: req.user.id
      });

      if (!account) {
        return res.status(404).json({
          status: 'error',
          message: 'Account not found'
        });
      }

      // Check if account has balance
      if (account.balance > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot close account with remaining balance'
        });
      }

      // Update account status
      account.status = 'CLOSED';
      await account.save();

      res.json({
        status: 'success',
        message: 'Account closed successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get account transactions
  getTransactions: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const transactions = await Transaction.find({
        $or: [
          { fromAccount: req.params.id },
          { toAccount: req.params.id }
        ]
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

      const total = await Transaction.countDocuments({
        $or: [
          { fromAccount: req.params.id },
          { toAccount: req.params.id }
        ]
      });

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
  }
};

module.exports = accountController; 