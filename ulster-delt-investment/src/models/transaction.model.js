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
    enum: ['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEE', 'ADJUSTMENT'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
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
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  reference: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  fees: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Generate unique reference number
transactionSchema.pre('save', async function(next) {
  if (!this.reference) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.reference = `TRX-${timestamp}-${random}`;
  }
  next();
});

// Calculate total value
transactionSchema.virtual('totalValue').get(function() {
  return this.quantity * this.price;
});

// Calculate net amount (including fees and tax)
transactionSchema.virtual('netAmount').get(function() {
  return this.amount - this.fees - this.tax;
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 