const request = require('supertest');
const app = require('../../app');
const monitoringService = require('../../services/monitoringService');
const redis = require('../../utils/redis');
const TestSetup = require('../helpers/testSetup');

describe('Investment Monitoring Integration', () => {
    let testUser;
    let authToken;
    let investmentAccount;

    beforeAll(async () => {
        // Ensure Redis is connected
        expect(redis.status).toBe('ready');
    });

    beforeEach(async () => {
        // Setup test environment
        const { user, token, account } = await TestSetup.setupTestEnvironment();
        testUser = user;
        authToken = token;
        investmentAccount = account;
    });

    afterEach(async () => {
        // Cleanup test environment
        await TestSetup.cleanupTestEnvironment();
    });

    afterAll(async () => {
        await redis.quit();
    });

    describe('Investment Creation Monitoring', () => {
        it('should track investment creation metrics', async () => {
            const investment = {
                accountId: investmentAccount._id,
                type: 'stocks',
                amount: 5000,
                currency: 'USD'
            };

            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send(investment);

            expect(res.statusCode).toBe(201);

            // Check monitoring metrics
            const metrics = await monitoringService.getRealTimeMetricsHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(metrics).toHaveLength(1);
            expect(metrics[0]).toHaveProperty('performance');
            expect(metrics[0].performance).toHaveProperty('activeUsers');
        });

        it('should alert on large investment amounts', async () => {
            const investment = {
                accountId: investmentAccount._id,
                type: 'stocks',
                amount: 9000,
                currency: 'USD'
            };

            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send(investment);

            expect(res.statusCode).toBe(201);

            // Check for alerts
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
            expect(alertHistory[0].alerts[0]).toMatchObject({
                type: 'investment',
                severity: 'high',
                message: expect.stringContaining('Large investment amount')
            });
        });
    });

    describe('Investment Performance Monitoring', () => {
        it('should track investment performance metrics', async () => {
            // Create an investment
            const investment = await TestSetup.createTestInvestment(
                testUser._id,
                investmentAccount._id
            );

            // Get performance metrics
            const res = await request(app)
                .get(`/api/investments/${investment._id}/returns`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);

            // Check monitoring metrics
            const metrics = await monitoringService.getRealTimeMetricsHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(metrics).toHaveLength(1);
            expect(metrics[0]).toHaveProperty('performance');
            expect(metrics[0].performance).toHaveProperty('responseTime');
        });

        it('should alert on significant price changes', async () => {
            // Create an investment with significant price change
            const investment = await TestSetup.createTestInvestment(
                testUser._id,
                investmentAccount._id,
                {
                    purchasePrice: 100,
                    currentPrice: 150 // 50% increase
                }
            );

            // Get performance metrics
            await request(app)
                .get(`/api/investments/${investment._id}/returns`)
                .set('Authorization', `Bearer ${authToken}`);

            // Check for alerts
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
            expect(alertHistory[0].alerts[0]).toMatchObject({
                type: 'price_change',
                severity: 'high',
                message: expect.stringContaining('Significant price change')
            });
        });
    });

    describe('Portfolio Monitoring', () => {
        it('should track portfolio diversification metrics', async () => {
            // Create test portfolio
            await TestSetup.createTestPortfolio(testUser._id, investmentAccount._id);

            // Get portfolio diversification
            const res = await request(app)
                .get('/api/investments/diversification')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);

            // Check monitoring metrics
            const metrics = await monitoringService.getRealTimeMetricsHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(metrics).toHaveLength(1);
            expect(metrics[0]).toHaveProperty('performance');
            expect(metrics[0].performance).toHaveProperty('activeUsers');
        });

        it('should alert on portfolio concentration', async () => {
            // Create concentrated portfolio
            await TestSetup.createConcentratedPortfolio(testUser._id, investmentAccount._id);

            // Get portfolio diversification
            await request(app)
                .get('/api/investments/diversification')
                .set('Authorization', `Bearer ${authToken}`);

            // Check for alerts
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
            expect(alertHistory[0].alerts[0]).toMatchObject({
                type: 'portfolio_concentration',
                severity: 'medium',
                message: expect.stringContaining('High portfolio concentration')
            });
        });
    });

    describe('Error Monitoring', () => {
        it('should track API errors', async () => {
            // Make invalid request
            const res = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    accountId: 'invalid_id',
                    type: 'stocks',
                    amount: 1000,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(400);

            // Check monitoring metrics
            const metrics = await monitoringService.getRealTimeMetricsHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(metrics).toHaveLength(1);
            expect(metrics[0]).toHaveProperty('performance');
            expect(metrics[0].performance).toHaveProperty('errorRate');
        });

        it('should alert on high error rates', async () => {
            // Make multiple invalid requests
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post('/api/investments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        accountId: 'invalid_id',
                        type: 'stocks',
                        amount: 1000,
                        currency: 'USD'
                    });
            }

            // Check for alerts
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
            expect(alertHistory[0].alerts[0]).toMatchObject({
                type: 'error_rate',
                severity: 'critical',
                message: expect.stringContaining('High error rate')
            });
        });
    });
}); 