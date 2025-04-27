const redis = require('../utils/redis');
const { logger } = require('../utils/logger');
const { sendEmail } = require('../utils/email');
const { config } = require('../config');

class MonitoringService {
    constructor() {
        this.thresholds = {
            cpu: 80, // 80% CPU usage
            memory: 85, // 85% memory usage
            errorRate: 5, // 5% error rate
            responseTime: 1000, // 1 second
            activeUsers: 1000, // 1000 concurrent users
            failedLogins: 5, // 5 failed login attempts
            apiErrors: 10, // 10 API errors per minute
            diskSpace: 90 // 90% disk space usage
        };

        this.alertRules = {
            cpu: {
                condition: (value) => value > this.thresholds.cpu,
                message: (value) => `High CPU usage: ${value}%`,
                severity: 'high'
            },
            memory: {
                condition: (value) => value > this.thresholds.memory,
                message: (value) => `High memory usage: ${value}%`,
                severity: 'high'
            },
            errorRate: {
                condition: (value) => value > this.thresholds.errorRate,
                message: (value) => `High error rate: ${value}%`,
                severity: 'critical'
            },
            responseTime: {
                condition: (value) => value > this.thresholds.responseTime,
                message: (value) => `Slow response time: ${value}ms`,
                severity: 'medium'
            },
            activeUsers: {
                condition: (value) => value > this.thresholds.activeUsers,
                message: (value) => `High number of active users: ${value}`,
                severity: 'medium'
            },
            failedLogins: {
                condition: (value) => value > this.thresholds.failedLogins,
                message: (value) => `Multiple failed login attempts: ${value}`,
                severity: 'high'
            },
            apiErrors: {
                condition: (value) => value > this.thresholds.apiErrors,
                message: (value) => `High API error rate: ${value} errors/minute`,
                severity: 'critical'
            },
            diskSpace: {
                condition: (value) => value > this.thresholds.diskSpace,
                message: (value) => `Low disk space: ${value}% used`,
                severity: 'high'
            }
        };

        this.customMetrics = new Map();

        // Add real-time monitoring settings
        this.realTimeSettings = {
            updateInterval: 60000, // 1 minute
            retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
            maxDataPoints: 1440 // 24 hours * 60 minutes
        };

        // Add alert channels
        this.alertChannels = {
            email: true,
            slack: false,
            webhook: false
        };

        // Add alert cooldown periods (in milliseconds)
        this.alertCooldowns = {
            critical: 5 * 60 * 1000, // 5 minutes
            high: 15 * 60 * 1000,    // 15 minutes
            medium: 30 * 60 * 1000,  // 30 minutes
            low: 60 * 60 * 1000      // 1 hour
        };

        // Initialize real-time monitoring
        this.initializeRealTimeMonitoring();
    }

    // Initialize real-time monitoring
    async initializeRealTimeMonitoring() {
        // Start real-time monitoring loop
        setInterval(async () => {
            try {
                const metrics = await this.getSystemMetrics();
                await this.storeRealTimeMetrics(metrics);
                await this.checkThresholds(metrics);
            } catch (error) {
                logger.error('Error in real-time monitoring:', error);
            }
        }, this.realTimeSettings.updateInterval);
    }

    // Store real-time metrics
    async storeRealTimeMetrics(metrics) {
        const timestamp = Date.now();
        const key = `metrics:${timestamp}`;

        // Store metrics with timestamp
        await redis.setex(key, this.realTimeSettings.retentionPeriod / 1000, JSON.stringify(metrics));

        // Maintain data points limit
        const keys = await redis.keys('metrics:*');
        if (keys.length > this.realTimeSettings.maxDataPoints) {
            const oldestKeys = keys.slice(0, keys.length - this.realTimeSettings.maxDataPoints);
            if (oldestKeys.length > 0) {
                await redis.del(...oldestKeys);
            }
        }
    }

    // Get real-time metrics history
    async getRealTimeMetricsHistory(startTime, endTime) {
        const keys = await redis.keys('metrics:*');
        const metrics = [];

        for (const key of keys) {
            const timestamp = parseInt(key.split(':')[1]);
            if (timestamp >= startTime && timestamp <= endTime) {
                const data = await redis.get(key);
                if (data) {
                    metrics.push({
                        timestamp,
                        ...JSON.parse(data)
                    });
                }
            }
        }

        return metrics.sort((a, b) => a.timestamp - b.timestamp);
    }

    // Add custom metric
    addCustomMetric(name, value, tags = {}) {
        this.customMetrics.set(name, { value, tags, timestamp: Date.now() });
    }

    // Get custom metric
    getCustomMetric(name) {
        return this.customMetrics.get(name);
    }

    // Get all custom metrics
    getAllCustomMetrics() {
        return Array.from(this.customMetrics.entries()).map(([name, data]) => ({
            name,
            ...data
        }));
    }

    // Get system metrics with custom metrics
    async getSystemMetrics() {
        const metrics = {
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpu: process.cpuUsage()
            },
            redis: {
                connected: redis.status === 'ready',
                memory: await redis.info('memory'),
                clients: await redis.info('clients')
            },
            performance: {
                responseTime: await this.getAverageResponseTime(),
                errorRate: await this.getErrorRate(),
                activeUsers: await this.getActiveUsers(),
                requestsPerMinute: await this.getRequestsPerMinute(),
                apiErrors: await this.getAPIErrorRate()
            },
            security: {
                failedLogins: await this.getFailedLogins(),
                blockedIPs: await this.getBlockedIPs()
            },
            custom: this.getAllCustomMetrics()
        };

        // Check thresholds and trigger alerts
        await this.checkThresholds(metrics);

        return metrics;
    }

    // Get performance metrics
    async getPerformanceMetrics() {
        const metrics = {
            responseTime: await this.getAverageResponseTime(),
            errorRate: await this.getErrorRate(),
            activeUsers: await this.getActiveUsers(),
            requestsPerMinute: await this.getRequestsPerMinute(),
            endpointUsage: await this.getEndpointUsage(),
            userActivity: await this.getUserActivity()
        };

        return metrics;
    }

    // Export metrics in various formats
    async exportMetrics(format = 'json') {
        const metrics = await this.getSystemMetrics();
        const performance = await this.getPerformanceMetrics();

        switch (format.toLowerCase()) {
            case 'json':
                return { metrics, performance };
            case 'prometheus':
                return this.formatPrometheusMetrics(metrics, performance);
            case 'graphite':
                return this.formatGraphiteMetrics(metrics, performance);
            default:
                throw new Error('Unsupported metrics format');
        }
    }

    // Check thresholds with custom rules
    async checkThresholds(metrics) {
        const alerts = [];

        // Check system metrics
        for (const [metric, rule] of Object.entries(this.alertRules)) {
            const value = this.getMetricValue(metrics, metric);
            if (value !== undefined && rule.condition(value)) {
                alerts.push({
                    type: metric,
                    message: rule.message(value),
                    severity: rule.severity,
                    value
                });
            }
        }

        // Check custom metrics
        for (const [name, data] of this.customMetrics) {
            const rule = this.alertRules[name];
            if (rule && rule.condition(data.value)) {
                alerts.push({
                    type: name,
                    message: rule.message(data.value),
                    severity: rule.severity,
                    value: data.value,
                    tags: data.tags
                });
            }
        }

        // Send alerts if any
        if (alerts.length > 0) {
            await this.sendAlerts(alerts);
        }

        return alerts;
    }

    // Get metric value from metrics object
    getMetricValue(metrics, metric) {
        const paths = {
            cpu: ['system', 'cpu', 'user'],
            memory: ['system', 'memory', 'heapUsed'],
            errorRate: ['performance', 'errorRate'],
            responseTime: ['performance', 'responseTime'],
            activeUsers: ['performance', 'activeUsers'],
            failedLogins: ['security', 'failedLogins'],
            apiErrors: ['performance', 'apiErrors']
        };

        const path = paths[metric];
        if (!path) return undefined;

        return path.reduce((obj, key) => obj?.[key], metrics);
    }

    // Get API error rate
    async getAPIErrorRate() {
        const now = Date.now();
        const oneMinuteAgo = now - 60 * 1000;
        const errors = await redis.lrange('api_errors', 0, -1);
        return errors.filter(timestamp => Number(timestamp) > oneMinuteAgo).length;
    }

    // Get failed logins
    async getFailedLogins() {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;
        const failedLogins = await redis.lrange('failed_logins', 0, -1);
        return failedLogins.filter(timestamp => Number(timestamp) > oneHourAgo).length;
    }

    // Get blocked IPs
    async getBlockedIPs() {
        return await redis.smembers('blocked_ips');
    }

    // Send alerts
    async sendAlerts(alerts) {
        const now = Date.now();
        const processedAlerts = [];

        for (const alert of alerts) {
            const cooldownKey = `alert_cooldown:${alert.type}:${alert.severity}`;
            const lastAlertTime = await redis.get(cooldownKey);

            if (!lastAlertTime || (now - parseInt(lastAlertTime)) > this.alertCooldowns[alert.severity]) {
                processedAlerts.push(alert);
                await redis.setex(cooldownKey, this.alertCooldowns[alert.severity] / 1000, now.toString());
            }
        }

        if (processedAlerts.length === 0) return;

        // Log alerts
        processedAlerts.forEach(alert => {
            logger.warn(`Alert: ${alert.message}`, { alert });
        });

        // Send alerts through configured channels
        if (this.alertChannels.email) {
            const criticalAlerts = processedAlerts.filter(alert => alert.severity === 'critical');
            if (criticalAlerts.length > 0) {
                await sendEmail({
                    email: config.admin.email,
                    subject: 'Critical System Alerts',
                    message: this.formatAlertEmail(criticalAlerts)
                });
            }
        }

        if (this.alertChannels.slack) {
            await this.sendSlackAlerts(processedAlerts);
        }

        if (this.alertChannels.webhook) {
            await this.sendWebhookAlerts(processedAlerts);
        }

        // Store alerts in Redis for history
        await redis.lpush('system_alerts', JSON.stringify({
            timestamp: new Date().toISOString(),
            alerts: processedAlerts
        }));
    }

    // Send alerts to Slack
    async sendSlackAlerts(alerts) {
        if (!config.slack?.webhookUrl) return;

        const message = {
            text: 'System Alerts',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: '🚨 System Alerts'
                    }
                }
            ]
        };

        alerts.forEach(alert => {
            message.blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*${alert.type.toUpperCase()}*\n${alert.message}\nSeverity: ${alert.severity}\nValue: ${alert.value}`
                }
            });
        });

        try {
            await fetch(config.slack.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
        } catch (error) {
            logger.error('Error sending Slack alert:', error);
        }
    }

    // Send alerts to webhook
    async sendWebhookAlerts(alerts) {
        if (!config.webhook?.url) return;

        try {
            await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    alerts
                })
            });
        } catch (error) {
            logger.error('Error sending webhook alert:', error);
        }
    }

    // Get alert history
    async getAlertHistory(startTime, endTime) {
        const alerts = await redis.lrange('system_alerts', 0, -1);
        return alerts
            .map(alert => JSON.parse(alert))
            .filter(alert => {
                const timestamp = new Date(alert.timestamp).getTime();
                return timestamp >= startTime && timestamp <= endTime;
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Get alert statistics
    async getAlertStatistics() {
        const alerts = await redis.lrange('system_alerts', 0, -1);
        const statistics = {
            total: alerts.length,
            bySeverity: {},
            byType: {},
            recent: []
        };

        alerts.forEach(alert => {
            const { alerts: alertData } = JSON.parse(alert);
            alertData.forEach(a => {
                // Count by severity
                statistics.bySeverity[a.severity] = (statistics.bySeverity[a.severity] || 0) + 1;
                // Count by type
                statistics.byType[a.type] = (statistics.byType[a.type] || 0) + 1;
            });
        });

        // Get recent alerts (last 10)
        statistics.recent = alerts
            .slice(0, 10)
            .map(alert => JSON.parse(alert));

        return statistics;
    }

    // Helper methods
    async getAverageResponseTime() {
        const responseTimes = await redis.lrange('response_times', 0, -1);
        if (responseTimes.length === 0) return 0;
        return responseTimes.reduce((a, b) => a + Number(b), 0) / responseTimes.length;
    }

    async getErrorRate() {
        const totalRequests = await redis.get('total_requests') || 0;
        const errorRequests = await redis.get('error_requests') || 0;
        return totalRequests === 0 ? 0 : (errorRequests / totalRequests) * 100;
    }

    async getActiveUsers() {
        const activeSessions = await redis.keys('session:*');
        return activeSessions.length;
    }

    async getRequestsPerMinute() {
        const now = Date.now();
        const oneMinuteAgo = now - 60 * 1000;
        const requests = await redis.lrange('request_timestamps', 0, -1);
        return requests.filter(timestamp => Number(timestamp) > oneMinuteAgo).length;
    }

    async getEndpointUsage() {
        const endpointStats = await redis.hgetall('endpoint_usage');
        return Object.entries(endpointStats).map(([endpoint, count]) => ({
            endpoint,
            count: Number(count)
        }));
    }

    async getUserActivity() {
        const activityLogs = await redis.lrange('audit_logs', 0, -1);
        return activityLogs.map(log => JSON.parse(log));
    }

    // Format metrics for different systems
    formatPrometheusMetrics(metrics, performance) {
        let prometheusMetrics = '';
        
        // System metrics
        prometheusMetrics += `# HELP system_cpu_usage CPU usage in percentage\n`;
        prometheusMetrics += `# TYPE system_cpu_usage gauge\n`;
        prometheusMetrics += `system_cpu_usage ${metrics.system.cpu.user}\n\n`;

        prometheusMetrics += `# HELP system_memory_usage Memory usage in percentage\n`;
        prometheusMetrics += `# TYPE system_memory_usage gauge\n`;
        prometheusMetrics += `system_memory_usage ${(metrics.system.memory.heapUsed / metrics.system.memory.heapTotal) * 100}\n\n`;

        // Performance metrics
        prometheusMetrics += `# HELP performance_response_time Average response time in milliseconds\n`;
        prometheusMetrics += `# TYPE performance_response_time gauge\n`;
        prometheusMetrics += `performance_response_time ${performance.responseTime}\n\n`;

        prometheusMetrics += `# HELP performance_error_rate Error rate in percentage\n`;
        prometheusMetrics += `# TYPE performance_error_rate gauge\n`;
        prometheusMetrics += `performance_error_rate ${performance.errorRate}\n\n`;

        return prometheusMetrics;
    }

    formatGraphiteMetrics(metrics, performance) {
        const timestamp = Math.floor(Date.now() / 1000);
        let graphiteMetrics = '';

        // System metrics
        graphiteMetrics += `system.cpu.usage ${metrics.system.cpu.user} ${timestamp}\n`;
        graphiteMetrics += `system.memory.usage ${(metrics.system.memory.heapUsed / metrics.system.memory.heapTotal) * 100} ${timestamp}\n`;

        // Performance metrics
        graphiteMetrics += `performance.response_time ${performance.responseTime} ${timestamp}\n`;
        graphiteMetrics += `performance.error_rate ${performance.errorRate} ${timestamp}\n`;

        return graphiteMetrics;
    }

    // Enhanced alert email format
    formatAlertEmail(alerts) {
        const groupedAlerts = alerts.reduce((groups, alert) => {
            if (!groups[alert.severity]) {
                groups[alert.severity] = [];
            }
            groups[alert.severity].push(alert);
            return groups;
        }, {});

        return `
            <h2>System Alerts</h2>
            ${Object.entries(groupedAlerts).map(([severity, alerts]) => `
                <h3>${severity.toUpperCase()} Severity Alerts</h3>
                <ul>
                    ${alerts.map(alert => `
                        <li>
                            <strong>${alert.type.toUpperCase()}</strong><br>
                            ${alert.message}<br>
                            Value: ${alert.value}<br>
                            ${alert.tags ? `Tags: ${JSON.stringify(alert.tags)}<br>` : ''}
                            Time: ${new Date().toLocaleString()}
                        </li>
                    `).join('')}
                </ul>
            `).join('')}
            <p>Please check the system immediately.</p>
        `;
    }
}

module.exports = new MonitoringService(); 