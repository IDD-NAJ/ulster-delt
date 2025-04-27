const User = require('../models/User');
const Investment = require('../models/Investment');
const Account = require('../models/Account');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { securityMiddleware } = require('../middleware/security');
const { logger } = require('../utils/logger');
const monitoringService = require('../services/monitoringService');
const { generateReport } = require('../utils/reportGenerator');

const adminController = {
    // Get all users
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find()
                .select('-password -twoFactorSecret -resetPasswordToken -resetPasswordExpire')
                .sort({ createdAt: -1 });

            res.json(users);
        } catch (error) {
            next(error);
        }
    },

    // Get user by ID
    getUserById: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
                .select('-password -twoFactorSecret -resetPasswordToken -resetPasswordExpire');

            if (!user) {
                throw new NotFoundError('User not found');
            }

            // Get user's accounts
            const accounts = await Account.find({ userId: user._id });
            
            // Get user's investments
            const investments = await Investment.find({ userId: user._id });

            res.json({
                user,
                accounts,
                investments
            });
        } catch (error) {
            next(error);
        }
    },

    // Update user
    updateUser: async (req, res, next) => {
        try {
            const { role, isVerified } = req.body;
            const user = await User.findById(req.params.id);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            // Update fields if provided
            if (role !== undefined) {
                if (!['user', 'admin'].includes(role)) {
                    throw new ValidationError('Invalid role');
                }
                user.role = role;
            }

            if (isVerified !== undefined) {
                user.isVerified = isVerified;
            }

            await user.save();

            res.json({
                message: 'User updated successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete user
    deleteUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            // Delete user's accounts
            await Account.deleteMany({ userId: user._id });
            
            // Delete user's investments
            await Investment.deleteMany({ userId: user._id });

            // Delete user
            await user.remove();

            res.json({ message: 'User and associated data deleted successfully' });
        } catch (error) {
            next(error);
        }
    },

    // Get system statistics
    getSystemStats: async (req, res, next) => {
        try {
            const stats = {
                users: {
                    total: await User.countDocuments(),
                    verified: await User.countDocuments({ isVerified: true }),
                    withTwoFactor: await User.countDocuments({ twoFactorEnabled: true }),
                    byRole: {
                        user: await User.countDocuments({ role: 'user' }),
                        admin: await User.countDocuments({ role: 'admin' })
                    }
                },
                investments: {
                    total: await Investment.countDocuments(),
                    totalAmount: await Investment.aggregate([
                        { $group: { _id: null, total: { $sum: '$amount' } } }
                    ]).then(result => result[0]?.total || 0),
                    byType: await Investment.aggregate([
                        { $group: { _id: '$type', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
                    ])
                },
                accounts: {
                    total: await Account.countDocuments(),
                    totalBalance: await Account.aggregate([
                        { $group: { _id: null, total: { $sum: '$balance' } } }
                    ]).then(result => result[0]?.total || 0),
                    byType: await Account.aggregate([
                        { $group: { _id: '$type', count: { $sum: 1 }, balance: { $sum: '$balance' } } }
                    ])
                },
                activity: {
                    newUsersToday: await User.countDocuments({
                        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                    }),
                    newInvestmentsToday: await Investment.countDocuments({
                        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                    })
                }
            };

            res.json(stats);
        } catch (error) {
            next(error);
        }
    },

    // Get user activity logs
    getUserActivityLogs: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { startDate, endDate, action } = req.query;

            const query = { userId };
            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate) query.timestamp.$gte = new Date(startDate);
                if (endDate) query.timestamp.$lte = new Date(endDate);
            }
            if (action) query.action = action;

            const logs = await redis.lrange('audit_logs', 0, -1)
                .then(logs => logs.map(log => JSON.parse(log)))
                .then(logs => logs.filter(log => {
                    if (query.userId && log.userId !== query.userId) return false;
                    if (query.action && log.action !== query.action) return false;
                    if (query.timestamp) {
                        const logDate = new Date(log.timestamp);
                        if (query.timestamp.$gte && logDate < query.timestamp.$gte) return false;
                        if (query.timestamp.$lte && logDate > query.timestamp.$lte) return false;
                    }
                    return true;
                }));

            res.json(logs);
        } catch (error) {
            next(error);
        }
    },

    // Get system monitoring data
    getSystemMonitoring: async (req, res, next) => {
        try {
            const monitoringData = {
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
                security: {
                    blockedIPs: Array.from(blockedIPs),
                    rateLimits: {
                        global: await redis.get('rate_limit:global:count'),
                        auth: await redis.get('rate_limit:auth:count')
                    }
                },
                performance: {
                    responseTime: await getAverageResponseTime(),
                    errorRate: await getErrorRate(),
                    activeUsers: await getActiveUsers()
                }
            };

            res.json(monitoringData);
        } catch (error) {
            next(error);
        }
    },

    // Backup system data
    backupSystemData: async (req, res, next) => {
        try {
            const backupData = {
                users: await User.find().select('-password'),
                accounts: await Account.find(),
                investments: await Investment.find(),
                auditLogs: await redis.lrange('audit_logs', 0, -1)
            };

            const backupId = `backup_${Date.now()}`;
            await redis.set(`backup:${backupId}`, JSON.stringify(backupData), 'EX', 7 * 24 * 60 * 60); // 7 days

            res.json({
                message: 'Backup created successfully',
                backupId,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    },

    // Restore system data
    restoreSystemData: async (req, res, next) => {
        try {
            const { backupId } = req.params;
            const backupData = await redis.get(`backup:${backupId}`);

            if (!backupData) {
                throw new NotFoundError('Backup not found');
            }

            const data = JSON.parse(backupData);

            // Restore data
            await User.deleteMany({});
            await Account.deleteMany({});
            await Investment.deleteMany({});
            await redis.del('audit_logs');

            await User.insertMany(data.users);
            await Account.insertMany(data.accounts);
            await Investment.insertMany(data.investments);
            await redis.lpush('audit_logs', ...data.auditLogs);

            res.json({
                message: 'System data restored successfully',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    },

    // User impersonation for support
    impersonateUser: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            // Log impersonation
            await securityMiddleware.auditLogger.log('impersonation', req.user._id, {
                impersonatedUserId: userId,
                ip: req.ip
            });

            // Generate impersonation token
            const token = generateToken(user._id, true); // true indicates impersonation

            res.json({
                message: 'User impersonation successful',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Bulk user operations
    bulkUpdateUsers: async (req, res, next) => {
        try {
            const { userIds, updates } = req.body;

            if (!Array.isArray(userIds) || userIds.length === 0) {
                throw new ValidationError('Invalid user IDs');
            }

            const result = await User.updateMany(
                { _id: { $in: userIds } },
                { $set: updates }
            );

            // Log bulk update
            await securityMiddleware.auditLogger.log('bulk_update', req.user._id, {
                userIds,
                updates,
                ip: req.ip
            });

            res.json({
                message: 'Users updated successfully',
                modifiedCount: result.modifiedCount
            });
        } catch (error) {
            next(error);
        }
    },

    bulkDeleteUsers: async (req, res, next) => {
        try {
            const { userIds } = req.body;

            if (!Array.isArray(userIds) || userIds.length === 0) {
                throw new ValidationError('Invalid user IDs');
            }

            // Delete users and their associated data
            await Promise.all([
                User.deleteMany({ _id: { $in: userIds } }),
                Account.deleteMany({ userId: { $in: userIds } }),
                Investment.deleteMany({ userId: { $in: userIds } })
            ]);

            // Log bulk delete
            await securityMiddleware.auditLogger.log('bulk_delete', req.user._id, {
                userIds,
                ip: req.ip
            });

            res.json({
                message: 'Users deleted successfully',
                deletedCount: userIds.length
            });
        } catch (error) {
            next(error);
        }
    },

    // Reporting features
    generateUserReport: async (req, res, next) => {
        try {
            const { startDate, endDate, format = 'pdf' } = req.query;

            const query = {};
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = new Date(startDate);
                if (endDate) query.createdAt.$lte = new Date(endDate);
            }

            const users = await User.find(query)
                .select('-password -twoFactorSecret')
                .populate('accounts')
                .populate('investments');

            const report = await generateReport({
                type: 'users',
                data: users,
                format,
                options: {
                    title: 'User Report',
                    startDate,
                    endDate
                }
            });

            res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=user-report.${format}`);
            res.send(report);
        } catch (error) {
            next(error);
        }
    },

    generateSystemReport: async (req, res, next) => {
        try {
            const { startDate, endDate, format = 'pdf' } = req.query;

            const metrics = await monitoringService.getSystemMetrics();
            const performance = await monitoringService.getPerformanceMetrics();
            const alerts = await redis.lrange('system_alerts', 0, -1)
                .then(alerts => alerts.map(alert => JSON.parse(alert)));

            const report = await generateReport({
                type: 'system',
                data: {
                    metrics,
                    performance,
                    alerts
                },
                format,
                options: {
                    title: 'System Report',
                    startDate,
                    endDate
                }
            });

            res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=system-report.${format}`);
            res.send(report);
        } catch (error) {
            next(error);
        }
    },

    // Enhanced monitoring endpoints
    getSystemMetrics: async (req, res, next) => {
        try {
            const { format = 'json' } = req.query;
            const metrics = await monitoringService.exportMetrics(format);

            if (format === 'json') {
                res.json(metrics);
            } else {
                res.setHeader('Content-Type', 'text/plain');
                res.send(metrics);
            }
        } catch (error) {
            next(error);
        }
    },

    getSystemAlerts: async (req, res, next) => {
        try {
            const { severity, startDate, endDate } = req.query;

            const alerts = await redis.lrange('system_alerts', 0, -1)
                .then(alerts => alerts.map(alert => JSON.parse(alert)))
                .then(alerts => alerts.filter(alert => {
                    if (severity && !alert.alerts.some(a => a.severity === severity)) return false;
                    if (startDate && new Date(alert.timestamp) < new Date(startDate)) return false;
                    if (endDate && new Date(alert.timestamp) > new Date(endDate)) return false;
                    return true;
                }));

            res.json(alerts);
        } catch (error) {
            next(error);
        }
    },

    // Dashboard statistics
    getDashboardStats: async (req, res, next) => {
        try {
            const stats = {
                users: {
                    total: await User.countDocuments(),
                    newToday: await User.countDocuments({
                        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                    }),
                    verified: await User.countDocuments({ isVerified: true }),
                    withTwoFactor: await User.countDocuments({ twoFactorEnabled: true })
                },
                investments: {
                    total: await Investment.countDocuments(),
                    totalAmount: await Investment.aggregate([
                        { $group: { _id: null, total: { $sum: '$amount' } } }
                    ]).then(result => result[0]?.total || 0),
                    byType: await Investment.aggregate([
                        { $group: { _id: '$type', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
                    ])
                },
                system: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage()
                },
                performance: await monitoringService.getPerformanceMetrics()
            };

            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
};

// Helper functions
async function getAverageResponseTime() {
    const responseTimes = await redis.lrange('response_times', 0, -1);
    if (responseTimes.length === 0) return 0;
    return responseTimes.reduce((a, b) => a + Number(b), 0) / responseTimes.length;
}

async function getErrorRate() {
    const totalRequests = await redis.get('total_requests') || 0;
    const errorRequests = await redis.get('error_requests') || 0;
    return totalRequests === 0 ? 0 : (errorRequests / totalRequests) * 100;
}

async function getActiveUsers() {
    const activeSessions = await redis.keys('session:*');
    return activeSessions.length;
}

module.exports = adminController; 