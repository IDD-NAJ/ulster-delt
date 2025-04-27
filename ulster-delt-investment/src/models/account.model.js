const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['CHECKING', 'SAVINGS', 'INVESTMENT'],
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'GBP']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'FROZEN', 'CLOSED'],
    default: 'ACTIVE'
  },
  interestRate: {
    type: Number,
    default: 0
  },
  minimumBalance: {
    type: Number,
    default: 0
  },
  overdraftLimit: {
    type: Number,
    default: 0
  },
  lastTransactionDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for formatted account number
accountSchema.virtual('formattedAccountNumber').get(function() {
  return this.accountNumber.replace(/(\d{4})/g, '$1 ').trim();
});

// Method to check if account has sufficient balance
accountSchema.methods.hasSufficientBalance = function(amount) {
  return this.balance >= amount;
};

// Method to update balance
accountSchema.methods.updateBalance = async function(amount, type) {
  if (type === 'CREDIT') {
    this.balance += amount;
  } else if (type === 'DEBIT') {
    if (!this.hasSufficientBalance(amount)) {
      throw new Error('Insufficient balance');
    }
    this.balance -= amount;
  }
  this.lastTransactionDate = new Date();
  await this.save();
};

// Static method to generate account number
accountSchema.statics.generateAccountNumber = function() {
  const prefix = 'UDI'; // Ulster Delt Investment
  const random = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${random}`;
};

// Pre-save middleware to generate account number if not provided
accountSchema.pre('save', function(next) {
  if (!this.accountNumber) {
    this.accountNumber = this.constructor.generateAccountNumber();
  }
  next();
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account; 