const User = require('../../models/User');
const Account = require('../../models/Account');
const Investment = require('../../models/Investment');
const { generateToken } = require('../../utils/auth');
const redis = require('../../utils/redis');
const monitoringService = require('../../services/monitoringService');

class TestSetup {
    static async createTestUser() {
        return await User.create({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        });
    }

    static async createTestAccount(userId, type = 'investment', balance = 10000) {
        return await Account.create({
            userId,
            type,
            currency: 'USD',
            balance
        });
    }

    static async createTestInvestment(userId, accountId, options = {}) {
        const defaultOptions = {
            type: 'stocks',
            amount: 5000,
            currency: 'USD',
            status: 'active',
            purchasePrice: 100,
            currentPrice: 120,
            shares: 50
        };

        return await Investment.create({
            userId,
            accountId,
            ...defaultOptions,
            ...options
        });
    }

    static async setupTestEnvironment() {
        // Clear Redis
        await redis.flushall();

        // Create test user
        const user = await this.createTestUser();
        const token = generateToken(user);

        // Create test account
        const account = await this.createTestAccount(user._id);

        // Initialize monitoring
        await monitoringService.initializeRealTimeMonitoring();

        return {
            user,
            token,
            account
        };
    }

    static async cleanupTestEnvironment() {
        // Clear Redis
        await redis.flushall();

        // Clear database collections
        await User.deleteMany({});
        await Account.deleteMany({});
        await Investment.deleteMany({});
    }

    static async createTestPortfolio(userId, accountId) {
        return await Investment.create([
            {
                userId,
                accountId,
                type: 'stocks',
                amount: 5000,
                currency: 'USD',
                status: 'active'
            },
            {
                userId,
                accountId,
                type: 'bonds',
                amount: 3000,
                currency: 'USD',
                status: 'active'
            },
            {
                userId,
                accountId,
                type: 'etf',
                amount: 2000,
                currency: 'USD',
                status: 'active'
            }
        ]);
    }

    static async createConcentratedPortfolio(userId, accountId) {
        return await Investment.create([
            {
                userId,
                accountId,
                type: 'stocks',
                amount: 8000,
                currency: 'USD',
                status: 'active'
            },
            {
                userId,
                accountId,
                type: 'bonds',
                amount: 1000,
                currency: 'USD',
                status: 'active'
            }
        ]);
    }
}

module.exports = TestSetup; 