const prometheus = require('prom-client');
const express = require('express');

// Create a Registry to register metrics
const register = new prometheus.Registry();

// Add default metrics (CPU, memory, etc.)
prometheus.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const activeUsers = new prometheus.Gauge({
    name: 'active_users',
    help: 'Number of active users'
});

const transactionVolume = new prometheus.Counter({
    name: 'transaction_volume_total',
    help: 'Total volume of transactions',
    labelNames: ['type', 'currency']
});

const investmentAmount = new prometheus.Gauge({
    name: 'investment_amount',
    help: 'Total amount of investments',
    labelNames: ['type', 'currency']
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeUsers);
register.registerMetric(transactionVolume);
register.registerMetric(investmentAmount);

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const route = req.route ? req.route.path : req.path;
        
        httpRequestDurationMicroseconds
            .labels(req.method, route, res.statusCode.toString())
            .observe(duration / 1000);
        
        httpRequestsTotal
            .labels(req.method, route, res.statusCode.toString())
            .inc();
    });
    next();
};

// Metrics endpoint
const metricsEndpoint = express.Router();
metricsEndpoint.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = {
    register,
    metricsMiddleware,
    metricsEndpoint,
    httpRequestDurationMicroseconds,
    httpRequestsTotal,
    activeUsers,
    transactionVolume,
    investmentAmount
}; 