const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const { generateToken } = require('../utils/auth');

describe('Authentication System', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                phoneNumber: '+1234567890',
                dateOfBirth: '1990-01-01',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    postalCode: '10001'
                }
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', userData.email);
        });

        it('should not register a user with existing email', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                phoneNumber: '+1234567890',
                dateOfBirth: '1990-01-01',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    postalCode: '10001'
                }
            };

            // First registration
            await request(app)
                .post('/api/auth/register')
                .send(userData);

            // Second registration with same email
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                phoneNumber: '+1234567890',
                dateOfBirth: '1990-01-01',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    postalCode: '10001'
                }
            };

            await request(app)
                .post('/api/auth/register')
                .send(userData);
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john.doe@example.com',
                    password: 'Password123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should not login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john.doe@example.com',
                    password: 'WrongPassword123!'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('Authentication Endpoints', () => {
        let testUser;
        let authToken;

        beforeEach(async () => {
            // Create a test user
            testUser = await User.create({
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'Test',
                lastName: 'User',
                phoneNumber: '+1234567890',
                dateOfBirth: '1990-01-01',
                address: {
                    street: '123 Test St',
                    city: 'Test City',
                    state: 'Test State',
                    country: 'Test Country',
                    postalCode: '12345'
                }
            });

            authToken = generateToken(testUser._id);
        });

        describe('Two-Factor Authentication', () => {
            it('should setup 2FA', async () => {
                const res = await request(app)
                    .post('/api/auth/2fa/setup')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('secret');
                expect(res.body).toHaveProperty('qrCode');
            });

            it('should verify and enable 2FA', async () => {
                // First setup 2FA
                await request(app)
                    .post('/api/auth/2fa/setup')
                    .set('Authorization', `Bearer ${authToken}`);

                // Get the user to access the secret
                const user = await User.findById(testUser._id);
                
                // Generate a valid TOTP token using the secret
                const token = require('speakeasy').totp({
                    secret: user.twoFactorSecret,
                    encoding: 'base32'
                });

                const res = await request(app)
                    .post('/api/auth/2fa/verify')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ token });

                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('message', '2FA enabled successfully');
                expect(res.body).toHaveProperty('backupCodes');
                expect(res.body.backupCodes).toHaveLength(10);
            });

            it('should require 2FA verification during login when enabled', async () => {
                // Setup and enable 2FA first
                await request(app)
                    .post('/api/auth/2fa/setup')
                    .set('Authorization', `Bearer ${authToken}`);

                const user = await User.findById(testUser._id);
                const token = require('speakeasy').totp({
                    secret: user.twoFactorSecret,
                    encoding: 'base32'
                });

                await request(app)
                    .post('/api/auth/2fa/verify')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ token });

                // Try to login
                const loginRes = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'test@example.com',
                        password: 'Password123!'
                    });

                expect(loginRes.statusCode).toBe(200);
                expect(loginRes.body).not.toHaveProperty('token');
                expect(loginRes.body).toHaveProperty('requiresTwoFactor', true);

                // Verify 2FA
                const verifyRes = await request(app)
                    .post('/api/auth/verify-2fa')
                    .send({
                        email: 'test@example.com',
                        token: require('speakeasy').totp({
                            secret: user.twoFactorSecret,
                            encoding: 'base32'
                        })
                    });

                expect(verifyRes.statusCode).toBe(200);
                expect(verifyRes.body).toHaveProperty('token');
            });

            it('should allow login with backup code when 2FA is enabled', async () => {
                // Setup and enable 2FA first
                await request(app)
                    .post('/api/auth/2fa/setup')
                    .set('Authorization', `Bearer ${authToken}`);

                const user = await User.findById(testUser._id);
                const token = require('speakeasy').totp({
                    secret: user.twoFactorSecret,
                    encoding: 'base32'
                });

                const verifyRes = await request(app)
                    .post('/api/auth/2fa/verify')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ token });

                const backupCode = verifyRes.body.backupCodes[0];

                // Try to login with backup code
                await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'test@example.com',
                        password: 'Password123!'
                    });

                const backupRes = await request(app)
                    .post('/api/auth/use-backup-code')
                    .send({
                        email: 'test@example.com',
                        code: backupCode
                    });

                expect(backupRes.statusCode).toBe(200);
                expect(backupRes.body).toHaveProperty('token');
            });
        });

        describe('Role-Based Access Control', () => {
            it('should allow admin access to protected routes', async () => {
                // Update user to admin role
                testUser.role = 'admin';
                await testUser.save();

                const adminToken = generateToken(testUser._id);

                const res = await request(app)
                    .get('/api/admin/users')
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(res.statusCode).toBe(200);
            });

            it('should deny regular user access to admin routes', async () => {
                const res = await request(app)
                    .get('/api/admin/users')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(res.statusCode).toBe(403);
            });
        });

        describe('Password Reset', () => {
            it('should send password reset email', async () => {
                const res = await request(app)
                    .post('/api/auth/forgot-password')
                    .send({ email: 'test@example.com' });

                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('message', 'Password reset email sent');
            });

            it('should reset password with valid token', async () => {
                // Request password reset
                await request(app)
                    .post('/api/auth/forgot-password')
                    .send({ email: 'test@example.com' });

                // Get the reset token from the user
                const user = await User.findById(testUser._id);
                const resetToken = user.resetPasswordToken;

                // Reset password
                const res = await request(app)
                    .post('/api/auth/reset-password')
                    .send({
                        token: resetToken,
                        password: 'NewPassword123!'
                    });

                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('message', 'Password reset successful');

                // Try logging in with new password
                const loginRes = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: 'test@example.com',
                        password: 'NewPassword123!'
                    });

                expect(loginRes.statusCode).toBe(200);
            });
        });
    });
}); 