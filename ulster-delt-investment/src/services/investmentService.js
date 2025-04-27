const Investment = require('../models/Investment');
const { logger } = require('../utils/db');
const { cache } = require('../utils/redis');
const { AppError } = require('../utils/errorHandler');

const CACHE_TTL = 300; // 5 minutes

const investmentService = {
  // Create new investment
  createInvestment: async (userId, investmentData) => {
    try {
      const investment = new Investment({
        ...investmentData,
        user: userId
      });

      await investment.save();
      await cache.del(`investments:${userId}`);
      return investment;
    } catch (error) {
      logger.error('Error creating investment:', error);
      throw error;
    }
  },

  // Get user investments
  getUserInvestments: async (userId) => {
    try {
      // Try to get from cache first
      const cachedInvestments = await cache.get(`investments:${userId}`);
      if (cachedInvestments) {
        return cachedInvestments;
      }

      const investments = await Investment.find({ user: userId })
        .sort({ purchaseDate: -1 });

      // Cache the investments
      await cache.set(`investments:${userId}`, investments, CACHE_TTL);
      return investments;
    } catch (error) {
      logger.error('Error getting user investments:', error);
      throw error;
    }
  },

  // Get investment by ID
  getInvestmentById: async (userId, investmentId) => {
    try {
      const investment = await Investment.findOne({
        _id: investmentId,
        user: userId
      });

      if (!investment) {
        throw new Error('Investment not found');
      }

      return investment;
    } catch (error) {
      logger.error('Error getting investment by ID:', error);
      throw error;
    }
  },

  // Update investment
  updateInvestment: async (userId, investmentId, updateData) => {
    try {
      const investment = await Investment.findOneAndUpdate(
        { _id: investmentId, user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!investment) {
        throw new Error('Investment not found');
      }

      await cache.del(`investments:${userId}`);
      return investment;
    } catch (error) {
      logger.error('Error updating investment:', error);
      throw error;
    }
  },

  // Delete investment
  deleteInvestment: async (userId, investmentId) => {
    try {
      const investment = await Investment.findOneAndDelete({
        _id: investmentId,
        user: userId
      });

      if (!investment) {
        throw new Error('Investment not found');
      }

      await cache.del(`investments:${userId}`);
      return investment;
    } catch (error) {
      logger.error('Error deleting investment:', error);
      throw error;
    }
  },

  // Calculate investment performance
  calculatePerformance: async (userId) => {
    try {
      const investments = await Investment.find({ user: userId });
      
      const performance = {
        totalValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        byType: {}
      };

      investments.forEach(investment => {
        // Add to total values
        performance.totalValue += investment.totalValue;
        performance.totalProfitLoss += investment.profitLoss;

        // Group by type
        if (!performance.byType[investment.type]) {
          performance.byType[investment.type] = {
            totalValue: 0,
            totalProfitLoss: 0,
            count: 0
          };
        }

        performance.byType[investment.type].totalValue += investment.totalValue;
        performance.byType[investment.type].totalProfitLoss += investment.profitLoss;
        performance.byType[investment.type].count++;
      });

      // Calculate overall percentage
      const totalInvestment = investments.reduce((sum, inv) => sum + (inv.amount * inv.purchasePrice), 0);
      performance.totalProfitLossPercentage = totalInvestment > 0 
        ? (performance.totalProfitLoss / totalInvestment) * 100 
        : 0;

      return performance;
    } catch (error) {
      logger.error('Error calculating investment performance:', error);
      throw error;
    }
  },

  // Update investment prices
  updatePrices: async (userId, updates) => {
    try {
      const operations = updates.map(update => ({
        updateOne: {
          filter: { _id: update.id, user: userId },
          update: { $set: { currentPrice: update.price } }
        }
      }));

      await Investment.bulkWrite(operations);
      await cache.del(`investments:${userId}`);
    } catch (error) {
      logger.error('Error updating investment prices:', error);
      throw error;
    }
  },

  // Calculate investment returns
  calculateReturns: (investment) => {
    if (!investment) {
      throw new AppError('Investment not found', 404);
    }

    const totalReturn = investment.currentPrice - investment.purchasePrice;
    const returnPercentage = (totalReturn / investment.purchasePrice) * 100;

    return {
      totalReturn,
      returnPercentage,
      purchasePrice: investment.purchasePrice,
      currentPrice: investment.currentPrice,
      shares: investment.shares
    };
  },

  // Calculate portfolio diversification
  calculateDiversification: (investments) => {
    if (!investments || investments.length === 0) {
      return {
        stocks: 0,
        bonds: 0,
        etf: 0,
        mutual_funds: 0
      };
    }

    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const diversification = {};

    investments.forEach(investment => {
      diversification[investment.type] = (diversification[investment.type] || 0) + 
        (investment.amount / totalAmount * 100);
    });

    return diversification;
  },

  // Calculate risk metrics
  calculateRiskMetrics: (investments) => {
    if (!investments || investments.length === 0) {
      return {
        portfolioVolatility: 0,
        riskScore: 0,
        riskLevel: 'low'
      };
    }

    // Calculate portfolio volatility
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    let portfolioVolatility = 0;

    investments.forEach(investment => {
      const weight = investment.amount / totalAmount;
      portfolioVolatility += (investment.volatility || 0) * weight;
    });

    // Calculate risk score (0-100)
    const riskScore = Math.min(100, Math.max(0, portfolioVolatility * 100));

    // Determine risk level
    let riskLevel;
    if (riskScore < 30) {
      riskLevel = 'low';
    } else if (riskScore < 70) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }

    return {
      portfolioVolatility,
      riskScore,
      riskLevel
    };
  },

  // Calculate monthly returns
  calculateMonthlyReturns: (investments, month) => {
    const startDate = new Date(month);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const monthlyInvestments = investments.filter(inv => 
      inv.createdAt >= startDate && inv.createdAt <= endDate
    );

    const totalValue = monthlyInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const monthlyReturn = monthlyInvestments.reduce((sum, inv) => 
      sum + (inv.currentPrice - inv.purchasePrice), 0
    );

    return {
      totalValue,
      monthlyReturn,
      monthlyReturnPercentage: totalValue > 0 ? (monthlyReturn / totalValue) * 100 : 0,
      investments: monthlyInvestments
    };
  },

  // Calculate tax implications
  calculateTaxImplications: (investments, year) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const yearlyInvestments = investments.filter(inv => 
      inv.status === 'sold' && 
      inv.soldAt >= startDate && 
      inv.soldAt <= endDate
    );

    const report = {
      totalGains: 0,
      totalLosses: 0,
      netGains: 0,
      taxableAmount: 0,
      investments: yearlyInvestments
    };

    yearlyInvestments.forEach(investment => {
      const gain = investment.soldPrice - investment.purchasePrice;
      if (gain > 0) {
        report.totalGains += gain;
      } else {
        report.totalLosses += Math.abs(gain);
      }
    });

    report.netGains = report.totalGains - report.totalLosses;
    report.taxableAmount = Math.max(0, report.netGains);

    return report;
  },

  // Calculate portfolio allocation
  calculatePortfolioAllocation: (investments) => {
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);

    const allocation = {
      byType: {},
      bySector: {},
      byCurrency: {}
    };

    investments.forEach(investment => {
      // Allocation by type
      allocation.byType[investment.type] = (allocation.byType[investment.type] || 0) + 
        (investment.amount / totalAmount * 100);

      // Allocation by sector
      if (investment.sector) {
        allocation.bySector[investment.sector] = (allocation.bySector[investment.sector] || 0) + 
          (investment.amount / totalAmount * 100);
      }

      // Allocation by currency
      allocation.byCurrency[investment.currency] = (allocation.byCurrency[investment.currency] || 0) + 
        (investment.amount / totalAmount * 100);
    });

    return allocation;
  }
};

module.exports = investmentService; 