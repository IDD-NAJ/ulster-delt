const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    investments: [{
        investment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Investment',
            required: true
        },
        allocation: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    }],
    performance: {
        totalValue: {
            type: Number,
            default: 0
        },
        totalReturn: {
            type: Number,
            default: 0
        },
        percentageReturn: {
            type: Number,
            default: 0
        },
        dailyReturn: {
            type: Number,
            default: 0
        },
        monthlyReturn: {
            type: Number,
            default: 0
        },
        yearlyReturn: {
            type: Number,
            default: 0
        }
    },
    riskMetrics: {
        volatility: {
            type: Number,
            default: 0
        },
        sharpeRatio: {
            type: Number,
            default: 0
        },
        beta: {
            type: Number,
            default: 0
        },
        maxDrawdown: {
            type: Number,
            default: 0
        }
    },
    assetAllocation: {
        byType: {
            type: Map,
            of: Number,
            default: new Map()
        },
        bySector: {
            type: Map,
            of: Number,
            default: new Map()
        },
        byRegion: {
            type: Map,
            of: Number,
            default: new Map()
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate portfolio performance
portfolioSchema.methods.calculatePerformance = async function() {
    const investments = await this.model('Investment').find({
        _id: { $in: this.investments.map(i => i.investment) }
    });

    let totalValue = 0;
    let totalCost = 0;

    investments.forEach(investment => {
        totalValue += investment.totalValue;
        totalCost += investment.totalCost;
    });

    this.performance.totalValue = totalValue;
    this.performance.totalReturn = totalValue - totalCost;
    this.performance.percentageReturn = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

    return this.performance;
};

// Calculate risk metrics
portfolioSchema.methods.calculateRiskMetrics = async function() {
    const investments = await this.model('Investment').find({
        _id: { $in: this.investments.map(i => i.investment) }
    });

    // Calculate volatility (standard deviation of returns)
    const returns = investments.map(inv => inv.performance.percentageReturn);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    this.riskMetrics.volatility = Math.sqrt(variance);

    // Calculate Sharpe Ratio (assuming risk-free rate of 2%)
    const riskFreeRate = 2;
    this.riskMetrics.sharpeRatio = (this.performance.percentageReturn - riskFreeRate) / this.riskMetrics.volatility;

    // Calculate Beta (market sensitivity)
    // This would typically use market data, but for now we'll use a simplified approach
    this.riskMetrics.beta = 1.0; // Default value

    // Calculate Maximum Drawdown
    let maxDrawdown = 0;
    let peak = investments[0]?.performance.percentageReturn || 0;
    
    investments.forEach(inv => {
        const currentReturn = inv.performance.percentageReturn;
        if (currentReturn > peak) {
            peak = currentReturn;
        }
        const drawdown = (peak - currentReturn) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    this.riskMetrics.maxDrawdown = maxDrawdown;

    return this.riskMetrics;
};

// Calculate asset allocation
portfolioSchema.methods.calculateAssetAllocation = async function() {
    const investments = await this.model('Investment').find({
        _id: { $in: this.investments.map(i => i.investment) }
    });

    const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);

    // Reset allocation maps
    this.assetAllocation.byType = new Map();
    this.assetAllocation.bySector = new Map();
    this.assetAllocation.byRegion = new Map();

    investments.forEach(investment => {
        const allocation = (investment.totalValue / totalValue) * 100;

        // Allocation by type
        const currentTypeAllocation = this.assetAllocation.byType.get(investment.type) || 0;
        this.assetAllocation.byType.set(investment.type, currentTypeAllocation + allocation);

        // Allocation by sector (if available)
        if (investment.sector) {
            const currentSectorAllocation = this.assetAllocation.bySector.get(investment.sector) || 0;
            this.assetAllocation.bySector.set(investment.sector, currentSectorAllocation + allocation);
        }

        // Allocation by region (if available)
        if (investment.region) {
            const currentRegionAllocation = this.assetAllocation.byRegion.get(investment.region) || 0;
            this.assetAllocation.byRegion.set(investment.region, currentRegionAllocation + allocation);
        }
    });

    return this.assetAllocation;
};

// Update portfolio
portfolioSchema.methods.update = async function() {
    await this.calculatePerformance();
    await this.calculateRiskMetrics();
    await this.calculateAssetAllocation();
    this.lastUpdated = new Date();
    return this.save();
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio; 