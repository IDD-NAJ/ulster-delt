const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Account = require('../models/Account');
const Investment = require('../models/Investment');
const { generateToken } = require('../utils/auth');
const monitoringService = require('../services/monitoringService');

describe('Investment Endpoints', () => {
    let testUser;
    let authToken;
    let investmentAccount;

    beforeEach(async () => {
        // Create a test user
        testUser = await User.create({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        });

        // Generate auth token
        authToken = generateToken(testUser);

        // Create test investment account
        investmentAccount = await Account.create({
            userId: testUser._id,
            type: 'investment',
            currency: 'USD',
            balance: 10000
        });

        monitoringService.initializeRealTimeMonitoring();
    });

    describe('GET /api/investments', () => {
        it('should get user investments', async () => {
            // Create some test investments
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active'
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'bonds',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active'
                }
            ]);

            const res = await request(app)
                .get('/api/investments')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty('type', 'stocks');
            expect(res.body[1]).toHaveProperty('type', 'bonds');
        });

        it('should filter investments by type', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active'
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'bonds',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active'
                }
            ]);

            const res = await request(app)
                .get('/api/investments')
                .query({ type: 'stocks' })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toHaveProperty('type', 'stocks');
        });
    });

    describe('POST /api/investments', () => {
        it('should create a new investment', async () => {
            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('type', 'stocks');
            expect(res.body).toHaveProperty('amount', 5000);
            expect(res.body).toHaveProperty('status', 'active');

            // Verify account balance was updated
            const updatedAccount = await Account.findById(investmentAccount._id);
            expect(updatedAccount.balance).toBe(5000);
        });

        it('should not create investment with insufficient funds', async () => {
            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 20000,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Insufficient funds');
        });

        it('should not create investment with invalid account', async () => {
            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId: 'invalidaccountid',
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/investments/:id', () => {
        it('should get investment details', async () => {
            const investment = await Investment.create({
                userId: testUser._id,
                accountId: investmentAccount._id,
                type: 'stocks',
                amount: 5000,
                currency: 'USD',
                status: 'active'
            });

            const res = await request(app)
                .get(`/api/investments/${investment._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('type', 'stocks');
            expect(res.body).toHaveProperty('amount', 5000);
        });

        it('should not get investment with invalid id', async () => {
            const res = await request(app)
                .get('/api/investments/invalidid')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /api/investments/:id', () => {
        it('should update investment status', async () => {
            const investment = await Investment.create({
                userId: testUser._id,
                accountId: investmentAccount._id,
                type: 'stocks',
                amount: 5000,
                currency: 'USD',
                status: 'active'
            });

            const res = await request(app)
                .put(`/api/investments/${investment._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'sold'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status', 'sold');

            // Verify account balance was updated
            const updatedAccount = await Account.findById(investmentAccount._id);
            expect(updatedAccount.balance).toBe(15000); // Original balance + investment amount
        });

        it('should not update investment with invalid status', async () => {
            const investment = await Investment.create({
                userId: testUser._id,
                accountId: investmentAccount._id,
                type: 'stocks',
                amount: 5000,
                currency: 'USD',
                status: 'active'
            });

            const res = await request(app)
                .put(`/api/investments/${investment._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'invalid_status'
                });

            expect(res.statusCode).toBe(400);
        });

        it('should not update investment with invalid id', async () => {
            const res = await request(app)
                .put('/api/investments/invalidid')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'sold'
                });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('GET /api/investments/performance', () => {
        it('should get investment performance metrics', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active',
                    createdAt: new Date('2024-01-01')
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'bonds',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active',
                    createdAt: new Date('2024-01-01')
                }
            ]);

            const res = await request(app)
                .get('/api/investments/performance')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('totalInvestment');
            expect(res.body).toHaveProperty('byType');
            expect(res.body.byType).toHaveProperty('stocks');
            expect(res.body.byType).toHaveProperty('bonds');
        });

        it('should get performance metrics for specific date range', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active',
                    createdAt: new Date('2024-01-01')
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'bonds',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active',
                    createdAt: new Date('2024-02-01')
                }
            ]);

            const res = await request(app)
                .get('/api/investments/performance')
                .query({
                    startDate: '2024-01-01',
                    endDate: '2024-01-31'
                })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.byType.stocks).toBe(5000);
            expect(res.body.byType.bonds).toBe(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle concurrent investment creation', async () => {
            const promises = [
                request(app)
                    .post('/api/investments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        accountId: investmentAccount._id,
                        type: 'stocks',
                        amount: 5000,
                        currency: 'USD'
                    }),
                request(app)
                    .post('/api/investments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        accountId: investmentAccount._id,
                        type: 'bonds',
                        amount: 5000,
                        currency: 'USD'
                    })
            ];

            const results = await Promise.all(promises);
            expect(results[0].statusCode).toBe(201);
            expect(results[1].statusCode).toBe(403); // Second request should fail due to insufficient funds
        });

        it('should handle investment with zero amount', async () => {
            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 0,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Investment amount must be greater than 0');
        });

        it('should handle investment with negative amount', async () => {
            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: -1000,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Investment amount must be greater than 0');
        });

        it('should handle investment with invalid currency', async () => {
            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 1000,
                    currency: 'INVALID'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid currency');
        });
    });

    describe('Investment Calculations', () => {
        it('should calculate investment returns correctly', async () => {
            const investment = await Investment.create({
                userId: testUser._id,
                accountId: investmentAccount._id,
                type: 'stocks',
                amount: 5000,
                currency: 'USD',
                status: 'active',
                purchasePrice: 100,
                currentPrice: 120,
                shares: 50
            });

            const res = await request(app)
                .get(`/api/investments/${investment._id}/returns`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('totalReturn', 1000); // (120 - 100) * 50
            expect(res.body).toHaveProperty('returnPercentage', 20); // ((120 - 100) / 100) * 100
        });

        it('should calculate portfolio diversification', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active'
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'bonds',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active'
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'etf',
                    amount: 2000,
                    currency: 'USD',
                    status: 'active'
                }
            ]);

            const res = await request(app)
                .get('/api/investments/diversification')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('stocks', 50); // 5000 / 10000 * 100
            expect(res.body).toHaveProperty('bonds', 30); // 3000 / 10000 * 100
            expect(res.body).toHaveProperty('etf', 20); // 2000 / 10000 * 100
        });

        it('should calculate risk metrics', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active',
                    volatility: 0.15
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'bonds',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active',
                    volatility: 0.05
                }
            ]);

            const res = await request(app)
                .get('/api/investments/risk')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('portfolioVolatility');
            expect(res.body).toHaveProperty('riskScore');
            expect(res.body).toHaveProperty('riskLevel');
        });
    });

    describe('Investment Reporting', () => {
        it('should generate monthly performance report', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active',
                    createdAt: new Date('2024-01-01'),
                    purchasePrice: 100,
                    currentPrice: 120
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'bonds',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active',
                    createdAt: new Date('2024-01-15'),
                    purchasePrice: 100,
                    currentPrice: 105
                }
            ]);

            const res = await request(app)
                .get('/api/investments/reports/monthly')
                .query({ month: '2024-01' })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('totalValue');
            expect(res.body).toHaveProperty('monthlyReturn');
            expect(res.body).toHaveProperty('monthlyReturnPercentage');
            expect(res.body).toHaveProperty('investments');
        });

        it('should generate tax report', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'sold',
                    createdAt: new Date('2024-01-01'),
                    soldAt: new Date('2024-03-01'),
                    purchasePrice: 100,
                    soldPrice: 120,
                    shares: 50
                }
            ]);

            const res = await request(app)
                .get('/api/investments/reports/tax')
                .query({ year: '2024' })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('totalGains');
            expect(res.body).toHaveProperty('totalLosses');
            expect(res.body).toHaveProperty('netGains');
            expect(res.body).toHaveProperty('taxableAmount');
        });

        it('should generate portfolio allocation report', async () => {
            await Investment.create([
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 5000,
                    currency: 'USD',
                    status: 'active',
                    sector: 'technology'
                },
                {
                    userId: testUser._id,
                    accountId: investmentAccount._id,
                    type: 'stocks',
                    amount: 3000,
                    currency: 'USD',
                    status: 'active',
                    sector: 'healthcare'
                }
            ]);

            const res = await request(app)
                .get('/api/investments/reports/allocation')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('byType');
            expect(res.body).toHaveProperty('bySector');
            expect(res.body).toHaveProperty('byCurrency');
        });
    });

    describe('Monitoring Service', () => {
        it('should send alerts to different channels', async () => {
            // Send alerts to different channels
            monitoringService.sendSlackAlerts('Critical alert message');
            monitoringService.sendWebhookAlerts('High priority alert');

            // Get alert history
            const alertHistory = monitoringService.getAlertHistory();
            
            // Get alert statistics
            const alertStats = monitoringService.getAlertStatistics();
        });

        it('should get historical metrics', async () => {
            // Get historical metrics
            const metrics = monitoringService.getRealTimeMetricsHistory();
        });
    });
}); 