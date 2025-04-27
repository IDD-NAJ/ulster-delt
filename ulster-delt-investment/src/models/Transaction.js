const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell', 'dividend', 'interest', 'fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalValue: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ investment: 1, date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });

// Calculate total value before saving
transactionSchema.pre('save', function(next) {
  this.totalValue = this.amount * this.price;
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 