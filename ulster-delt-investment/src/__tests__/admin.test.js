const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const redis = require('../utils/redis');

describe('Admin Endpoints', () => {
    let adminUser;
    let adminToken;
    let regularUser;

    beforeEach(async () => {
        // Create admin user
        adminUser = await User.create({
            email: 'admin@example.com',
            password: 'Admin123!',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isVerified: true
        });

        // Create regular user
        regularUser = await User.create({
            email: 'user@example.com',
            password: 'User123!',
            firstName: 'Regular',
            lastName: 'User',
            role: 'user',
            isVerified: true
        });

        adminToken = generateToken(adminUser._id);
    });

    describe('User Management', () => {
        it('should get all users', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });

        it('should get user by ID', async () => {
            const res = await request(app)
                .get(`/api/admin/users/${regularUser._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.user).toHaveProperty('email', 'user@example.com');
        });

        it('should update user role', async () => {
            const res = await request(app)
                .put(`/api/admin/users/${regularUser._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'admin' });

            expect(res.statusCode).toBe(200);
            expect(res.body.user).toHaveProperty('role', 'admin');
        });

        it('should delete user', async () => {
            const res = await request(app)
                .delete(`/api/admin/users/${regularUser._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);

            // Verify user is deleted
            const deletedUser = await User.findById(regularUser._id);
            expect(deletedUser).toBeNull();
        });
    });

    describe('User Activity Logs', () => {
        it('should get user activity logs', async () => {
            // Create some activity logs
            await redis.lpush('audit_logs', JSON.stringify({
                timestamp: new Date().toISOString(),
                action: 'login',
                userId: regularUser._id,
                details: { ip: '127.0.0.1' }
            }));

            const res = await request(app)
                .get(`/api/admin/users/${regularUser._id}/activity`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty('action', 'login');
        });

        it('should filter activity logs by date range', async () => {
            const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const endDate = new Date().toISOString();

            const res = await request(app)
                .get(`/api/admin/users/${regularUser._id}/activity`)
                .query({ startDate, endDate })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('System Monitoring', () => {
        it('should get system monitoring data', async () => {
            const res = await request(app)
                .get('/api/admin/monitoring')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('system');
            expect(res.body).toHaveProperty('redis');
            expect(res.body).toHaveProperty('security');
            expect(res.body).toHaveProperty('performance');
        });
    });

    describe('Backup and Restore', () => {
        it('should create system backup', async () => {
            const res = await request(app)
                .post('/api/admin/backup')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('backupId');
            expect(res.body).toHaveProperty('timestamp');
        });

        it('should restore system from backup', async () => {
            // First create a backup
            const backupRes = await request(app)
                .post('/api/admin/backup')
                .set('Authorization', `Bearer ${adminToken}`);

            const { backupId } = backupRes.body;

            // Then restore from backup
            const res = await request(app)
                .post(`/api/admin/backup/${backupId}/restore`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'System data restored successfully');
        });
    });

    describe('User Impersonation', () => {
        it('should allow admin to impersonate user', async () => {
            const res = await request(app)
                .post(`/api/admin/users/${regularUser._id}/impersonate`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'user@example.com');
        });

        it('should not allow regular user to impersonate', async () => {
            const userToken = generateToken(regularUser._id);

            const res = await request(app)
                .post(`/api/admin/users/${adminUser._id}/impersonate`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
        });
    });

    describe('Access Control', () => {
        it('should not allow regular user to access admin routes', async () => {
            const userToken = generateToken(regularUser._id);

            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
        });

        it('should not allow unauthenticated access to admin routes', async () => {
            const res = await request(app)
                .get('/api/admin/users');

            expect(res.statusCode).toBe(401);
        });
    });
}); 