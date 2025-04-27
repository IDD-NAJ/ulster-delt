const monitoringService = require('../services/monitoringService');
const mockRedis = require('./mocks/redis');
const mockSlack = require('./mocks/slack');
const mockEmail = require('./mocks/email');
const { config } = require('../config');

// Mock the Redis, Slack, and Email modules
jest.mock('../utils/redis', () => mockRedis);
jest.mock('../utils/slack', () => mockSlack);
jest.mock('../utils/email', () => mockEmail);

describe('Monitoring Service', () => {
    beforeEach(async () => {
        // Clear all mocks before each test
        await mockRedis.flushall();
        mockSlack.clearMessages();
        mockEmail.clearSentEmails();
    });

    describe('Real-time Monitoring', () => {
        it('should initialize real-time monitoring', async () => {
            await monitoringService.initializeRealTimeMonitoring();
            // Verify that the monitoring interval is set
            expect(monitoringService.realTimeSettings.updateInterval).toBeDefined();
        });

        it('should store and retrieve real-time metrics', async () => {
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

        it('should respect max data points limit', async () => {
            const metrics = { cpu: 75 };
            const maxPoints = monitoringService.realTimeSettings.maxDataPoints;

            // Store more than max data points
            for (let i = 0; i < maxPoints + 10; i++) {
                await monitoringService.storeRealTimeMetrics(metrics);
            }

            const storedMetrics = await monitoringService.getRealTimeMetricsHistory(
                Date.now() - 86400000,
                Date.now()
            );

            expect(storedMetrics.length).toBeLessThanOrEqual(maxPoints);
        });
    });

    describe('Alert System', () => {
        it('should send alerts to configured channels', async () => {
            const alerts = [
                {
                    type: 'cpu',
                    message: 'High CPU usage: 90%',
                    severity: 'critical',
                    value: 90
                }
            ];

            await monitoringService.sendAlerts(alerts);
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
            expect(alertHistory[0].alerts).toHaveLength(1);
            expect(alertHistory[0].alerts[0]).toMatchObject(alerts[0]);
        });

        it('should respect alert cooldown periods', async () => {
            const alert = {
                type: 'memory',
                message: 'High memory usage: 95%',
                severity: 'high',
                value: 95
            };

            // Send first alert
            await monitoringService.sendAlerts([alert]);
            
            // Send second alert immediately
            await monitoringService.sendAlerts([alert]);

            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            // Should only have one alert due to cooldown
            expect(alertHistory).toHaveLength(1);
        });

        it('should send alerts to Slack and verify message content', async () => {
            config.slack.webhookUrl = 'https://hooks.slack.com/services/test';

            const alert = {
                type: 'error',
                message: 'Critical error rate detected',
                severity: 'critical',
                value: 10
            };

            await monitoringService.sendSlackAlerts([alert]);
            const messages = mockSlack.getMessages();

            expect(messages).toHaveLength(1);
            expect(messages[0]).toHaveProperty('text', 'System Alerts');
            expect(messages[0].blocks).toContainEqual(
                expect.objectContaining({
                    type: 'section',
                    text: expect.objectContaining({
                        text: expect.stringContaining('Critical error rate detected')
                    })
                })
            );
        });

        it('should send alerts to webhook when configured', async () => {
            // Mock webhook URL
            config.webhook.url = 'https://api.example.com/webhook';

            const alert = {
                type: 'disk',
                message: 'Low disk space',
                severity: 'high',
                value: 95
            };

            await monitoringService.sendWebhookAlerts([alert]);
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
        });

        it('should send email alerts when configured', async () => {
            config.alertChannels.email = true;
            config.admin = { email: 'admin@example.com' };

            const alert = {
                type: 'cpu',
                message: 'Critical CPU usage detected',
                severity: 'critical',
                value: 95
            };

            await monitoringService.sendAlerts([alert]);
            const sentEmails = mockEmail.getSentEmails();

            expect(sentEmails).toHaveLength(1);
            expect(sentEmails[0]).toMatchObject({
                email: 'admin@example.com',
                subject: 'Critical System Alerts',
                message: expect.stringContaining('Critical CPU usage detected')
            });
        });

        it('should not send email alerts for non-critical alerts', async () => {
            config.alertChannels.email = true;
            config.admin = { email: 'admin@example.com' };

            const alert = {
                type: 'memory',
                message: 'High memory usage',
                severity: 'high',
                value: 85
            };

            await monitoringService.sendAlerts([alert]);
            const sentEmails = mockEmail.getSentEmails();

            expect(sentEmails).toHaveLength(0);
        });

        it('should send alerts to multiple channels', async () => {
            config.alertChannels.email = true;
            config.alertChannels.slack = true;
            config.alertChannels.webhook = true;
            config.admin = { email: 'admin@example.com' };
            config.slack.webhookUrl = 'https://hooks.slack.com/services/test';
            config.webhook.url = 'https://api.example.com/webhook';

            const alert = {
                type: 'error',
                message: 'Critical error rate detected',
                severity: 'critical',
                value: 10
            };

            await monitoringService.sendAlerts([alert]);

            const sentEmails = mockEmail.getSentEmails();
            const slackMessages = mockSlack.getMessages();
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(sentEmails).toHaveLength(1);
            expect(slackMessages).toHaveLength(1);
            expect(alertHistory).toHaveLength(1);
        });
    });

    describe('Alert History and Statistics', () => {
        it('should track alert history', async () => {
            const alerts = [
                {
                    type: 'cpu',
                    message: 'High CPU usage',
                    severity: 'critical',
                    value: 90
                },
                {
                    type: 'memory',
                    message: 'High memory usage',
                    severity: 'high',
                    value: 85
                }
            ];

            await monitoringService.sendAlerts(alerts);
            const alertHistory = await monitoringService.getAlertHistory(
                Date.now() - 60000,
                Date.now()
            );

            expect(alertHistory).toHaveLength(1);
            expect(alertHistory[0].alerts).toHaveLength(2);
        });

        it('should calculate alert statistics', async () => {
            const alerts = [
                {
                    type: 'cpu',
                    message: 'High CPU usage',
                    severity: 'critical',
                    value: 90
                },
                {
                    type: 'memory',
                    message: 'High memory usage',
                    severity: 'high',
                    value: 85
                },
                {
                    type: 'disk',
                    message: 'Low disk space',
                    severity: 'medium',
                    value: 95
                }
            ];

            await monitoringService.sendAlerts(alerts);
            const stats = await monitoringService.getAlertStatistics();

            expect(stats.total).toBe(1); // One alert event with multiple alerts
            expect(stats.bySeverity).toHaveProperty('critical', 1);
            expect(stats.bySeverity).toHaveProperty('high', 1);
            expect(stats.bySeverity).toHaveProperty('medium', 1);
            expect(stats.byType).toHaveProperty('cpu', 1);
            expect(stats.byType).toHaveProperty('memory', 1);
            expect(stats.byType).toHaveProperty('disk', 1);
            expect(stats.recent).toHaveLength(1);
        });
    });

    describe('Custom Metrics', () => {
        it('should add and retrieve custom metrics', () => {
            const metricName = 'custom_metric';
            const metricValue = 42;
            const tags = { environment: 'test' };

            monitoringService.addCustomMetric(metricName, metricValue, tags);
            const retrievedMetric = monitoringService.getCustomMetric(metricName);

            expect(retrievedMetric).toMatchObject({
                value: metricValue,
                tags
            });
        });

        it('should get all custom metrics', () => {
            monitoringService.addCustomMetric('metric1', 1);
            monitoringService.addCustomMetric('metric2', 2);

            const allMetrics = monitoringService.getAllCustomMetrics();
            expect(allMetrics).toHaveLength(2);
            expect(allMetrics[0]).toHaveProperty('name', 'metric1');
            expect(allMetrics[1]).toHaveProperty('name', 'metric2');
        });
    });

    describe('System Metrics', () => {
        it('should get system metrics', async () => {
            const metrics = await monitoringService.getSystemMetrics();

            expect(metrics).toHaveProperty('system');
            expect(metrics).toHaveProperty('redis');
            expect(metrics).toHaveProperty('performance');
            expect(metrics).toHaveProperty('security');
            expect(metrics).toHaveProperty('custom');
        });

        it('should get performance metrics', async () => {
            const metrics = await monitoringService.getPerformanceMetrics();

            expect(metrics).toHaveProperty('responseTime');
            expect(metrics).toHaveProperty('errorRate');
            expect(metrics).toHaveProperty('activeUsers');
            expect(metrics).toHaveProperty('requestsPerMinute');
            expect(metrics).toHaveProperty('endpointUsage');
            expect(metrics).toHaveProperty('userActivity');
        });
    });

    describe('Metrics Export', () => {
        it('should export metrics in JSON format', async () => {
            const metrics = await monitoringService.exportMetrics('json');
            expect(metrics).toHaveProperty('metrics');
            expect(metrics).toHaveProperty('performance');
        });

        it('should export metrics in Prometheus format', async () => {
            const metrics = await monitoringService.exportMetrics('prometheus');
            expect(typeof metrics).toBe('string');
            expect(metrics).toContain('system_cpu_usage');
            expect(metrics).toContain('system_memory_usage');
        });

        it('should export metrics in Graphite format', async () => {
            const metrics = await monitoringService.exportMetrics('graphite');
            expect(typeof metrics).toBe('string');
            expect(metrics).toContain('system.cpu.usage');
            expect(metrics).toContain('system.memory.usage');
        });

        it('should throw error for unsupported format', async () => {
            await expect(monitoringService.exportMetrics('unsupported'))
                .rejects
                .toThrow('Unsupported metrics format');
        });
    });
}); 