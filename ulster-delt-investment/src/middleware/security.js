const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const { config } = require('../config');
const { logger } = require('../utils/logger');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Initialize Redis client
const redis = new Redis(config.redis.url);

// IP blocking middleware
const blockedIPs = new Set();
const ipBlockDuration = 24 * 60 * 60 * 1000; // 24 hours

const securityMiddleware = {
    // Apply rate limiting
    applyRateLimit: (app) => {
        // Global rate limiter
        const globalLimiter = rateLimit({
            store: new RedisStore({
                client: redis,
                prefix: 'rate_limit:global:'
            }),
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later'
        });

        // Auth endpoints rate limiter (more strict)
        const authLimiter = rateLimit({
            store: new RedisStore({
                client: redis,
                prefix: 'rate_limit:auth:'
            }),
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 5, // Limit each IP to 5 requests per windowMs
            message: 'Too many authentication attempts, please try again later'
        });

        // Apply rate limiters
        app.use('/api/auth', authLimiter);
        app.use(globalLimiter);
    },

    // Apply security headers
    applySecurityHeaders: (app) => {
        app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            res.setHeader('Content-Security-Policy', "default-src 'self'");
            next();
        });
    },

    // Apply input sanitization
    applySanitization: (app) => {
        app.use((req, res, next) => {
            if (req.body) {
                Object.keys(req.body).forEach(key => {
                    if (typeof req.body[key] === 'string') {
                        req.body[key] = req.body[key].trim();
                    }
                });
            }
            next();
        });
    },

    // Apply CORS
    applyCORS: (app) => {
        app.use(cors({
            origin: config.app.allowedOrigins,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
    },

    // IP blocking middleware
    blockIP: (req, res, next) => {
        const ip = req.ip;
        if (blockedIPs.has(ip)) {
            return res.status(403).json({
                status: 'error',
                message: 'IP address has been blocked due to suspicious activity'
            });
        }
        next();
    },

    // Track failed login attempts
    trackFailedLogins: async (ip, userId) => {
        const key = `failed_logins:${ip}`;
        const attempts = await redis.incr(key);
        await redis.expire(key, 3600); // Expire after 1 hour

        if (attempts >= 5) {
            blockedIPs.add(ip);
            setTimeout(() => blockedIPs.delete(ip), ipBlockDuration);
            logger.warn(`IP ${ip} has been blocked due to multiple failed login attempts`);
        }
    },

    // Session management
    sessionManager: {
        // Create session
        createSession: async (userId, token) => {
            const sessionKey = `session:${userId}`;
            await redis.set(sessionKey, token, 'EX', 24 * 60 * 60); // 24 hours
        },

        // Validate session
        validateSession: async (userId, token) => {
            const sessionKey = `session:${userId}`;
            const storedToken = await redis.get(sessionKey);
            return storedToken === token;
        },

        // Invalidate session
        invalidateSession: async (userId) => {
            const sessionKey = `session:${userId}`;
            await redis.del(sessionKey);
        }
    },

    // Audit logging
    auditLogger: {
        log: async (action, userId, details) => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                action,
                userId,
                details,
                ip: details.ip
            };

            await redis.lpush('audit_logs', JSON.stringify(logEntry));
            logger.info('Audit log entry created', logEntry);
        }
    }
};

module.exports = securityMiddleware; 