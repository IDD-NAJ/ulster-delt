const monitoringService = require('../../services/monitoringService');
const redis = require('../../utils/redis');
const { config } = require('../../config');

describe('Monitoring Service Integration', () => {
    beforeAll(async () => {
        // Ensure Redis is connected
        expect(redis.status).toBe('ready');
    });

    beforeEach(async () => {
        await redis.flushall();
    });

    afterAll(async () => {
        await redis.quit();
    });

    describe('Real-time Monitoring Integration', () => {
        it('should store and retrieve metrics from Redis', async () => {
            const metrics = {
                cpu: 75,
                memory: 80,
                errorRate: 2
            };

            await monitoringService.storeRealTimeMetrics(metrics);
            const storedMetrics = await monitoringService.getRealTimeMetricsHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(storedMetrics).toHaveLength(1);
            expect(storedMetrics[0]).toMatchObject(metrics);
        });

        it('should maintain data retention policy', async () => {
            const metrics = { cpu: 75 };
            const retentionPeriod = monitoringService.realTimeSettings.retentionPeriod;

            await monitoringService.storeRealTimeMetrics(metrics);
            
            // Wait for retention period to expire
            await new Promise(resolve => setTimeout(resolve, retentionPeriod + 1000));

            const storedMetrics = await monitoringService.getRealTimeMetricsHistory(
                Date.now() - retentionPeriod - 2000,
                Date.now()
            );

            expect(storedMetrics).toHaveLength(0);
        });
    });

    describe('Alert System Integration', () => {
        it('should store alerts in Redis and respect cooldown', async () => {
            const alert = {
                type: 'cpu',
                message: 'High CPU usage',
                severity: 'critical',
                value: 90
            };

            // Send first alert
            await monitoringService.sendAlerts([alert]);
            
            // Send second alert immediately
            await monitoringService.sendAlerts([alert]);

            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
        });

        it('should track alert history with timestamps', async () => {
            const alert = {
                type: 'memory',
                message: 'High memory usage',
                severity: 'high',
                value: 85
            };

            const startTime = Date.now();
            await monitoringService.sendAlerts([alert]);
            const endTime = Date.now();

            const alertHistory = await monitoringService.getAlertHistory(startTime, endTime);
            expect(alertHistory).toHaveLength(1);
            expect(new Date(alertHistory[0].timestamp).getTime()).toBeGreaterThanOrEqual(startTime);
            expect(new Date(alertHistory[0].timestamp).getTime()).toBeLessThanOrEqual(endTime);
        });
    });

    describe('System Metrics Integration', () => {
        it('should collect and store system metrics', async () => {
            const metrics = await monitoringService.getSystemMetrics();
            expect(metrics).toHaveProperty('system');
            expect(metrics).toHaveProperty('redis');
            expect(metrics).toHaveProperty('performance');
            expect(metrics).toHaveProperty('security');
            expect(metrics).toHaveProperty('custom');

            // Verify Redis metrics
            expect(metrics.redis).toHaveProperty('connected', true);
            expect(metrics.redis).toHaveProperty('memory');
            expect(metrics.redis).toHaveProperty('clients');
        });

        it('should track performance metrics over time', async () => {
            // Record some performance metrics
            await monitoringService.storeRealTimeMetrics({
                responseTime: 100,
                errorRate: 1,
                activeUsers: 50
            });

            const metrics = await monitoringService.getPerformanceMetrics();
            expect(metrics).toHaveProperty('responseTime');
            expect(metrics).toHaveProperty('errorRate');
            expect(metrics).toHaveProperty('activeUsers');
        });
    });
}); 