const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['STOCK', 'BOND', 'MUTUAL_FUND', 'ETF', 'CRYPTO', 'REAL_ESTATE'],
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
    quantity: {
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
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'SOLD', 'PENDING'],
        default: 'ACTIVE'
    },
    notes: {
        type: String,
        trim: true
    },
    performance: {
        totalReturn: {
            type: Number,
            default: 0
        },
        percentageReturn: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Calculate investment performance
investmentSchema.methods.calculatePerformance = function() {
    const totalValue = this.quantity * this.currentPrice;
    const totalCost = this.quantity * this.purchasePrice;
    this.performance.totalReturn = totalValue - totalCost;
    this.performance.percentageReturn = ((totalValue - totalCost) / totalCost) * 100;
    return this.performance;
};

// Update current price and recalculate performance
investmentSchema.methods.updatePrice = function(newPrice) {
    this.currentPrice = newPrice;
    this.lastUpdated = new Date();
    this.calculatePerformance();
    return this.save();
};

// Virtual for total value
investmentSchema.virtual('totalValue').get(function() {
    return this.quantity * this.currentPrice;
});

// Virtual for total cost
investmentSchema.virtual('totalCost').get(function() {
    return this.quantity * this.purchasePrice;
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment; 