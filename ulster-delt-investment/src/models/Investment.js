const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['stocks', 'bonds', 'mutual_funds', 'etf', 'crypto'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'pending'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  },
  performance: {
    daily: {
      type: Number,
      default: 0
    },
    weekly: {
      type: Number,
      default: 0
    },
    monthly: {
      type: Number,
      default: 0
    },
    yearly: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Calculate total value
investmentSchema.virtual('totalValue').get(function() {
  return this.amount * this.currentPrice;
});

// Calculate profit/loss
investmentSchema.virtual('profitLoss').get(function() {
  return (this.currentPrice - this.purchasePrice) * this.amount;
});

// Calculate profit/loss percentage
investmentSchema.virtual('profitLossPercentage').get(function() {
  return ((this.currentPrice - this.purchasePrice) / this.purchasePrice) * 100;
});

// Indexes
investmentSchema.index({ user: 1, symbol: 1 });
investmentSchema.index({ type: 1 });
investmentSchema.index({ status: 1 });

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment; 