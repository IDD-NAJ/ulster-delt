const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const { generateToken } = require('../utils/auth');

describe('Additional Authentication Features', () => {
    let testUser;
    let authToken;

    beforeEach(async () => {
        await User.deleteMany({});
        
        // Create a test user
        testUser = await User.create({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'Password123!',
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

    describe('Password Reset Flow', () => {
        it('should send password reset email', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Password reset email sent');
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
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: resetToken,
                    password: 'NewPassword123!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Password reset successful');

            // Try logging in with new password
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'NewPassword123!'
                });

            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body).toHaveProperty('token');
        });
    });

    describe('Email Verification Flow', () => {
        it('should verify email with valid token', async () => {
            // Generate verification token
            const verificationToken = testUser.generateEmailVerificationToken();
            await testUser.save();

            const response = await request(app)
                .get(`/api/auth/verify-email/${verificationToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Email verified successfully');

            // Check if user is verified
            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.isVerified).toBe(true);
        });

        it('should not verify email with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/verify-email/invalid-token');

            expect(response.status).toBe(400);
        });
    });

    describe('Two-Factor Authentication Flow', () => {
        it('should setup 2FA', async () => {
            const response = await request(app)
                .post('/api/auth/2fa/setup')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('secret');
            expect(response.body).toHaveProperty('qrCode');
        });

        it('should verify and enable 2FA', async () => {
            // Setup 2FA first
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

            const response = await request(app)
                .post('/api/auth/2fa/verify')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ token });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', '2FA enabled successfully');
            expect(response.body).toHaveProperty('backupCodes');
            expect(response.body.backupCodes).toHaveLength(10);
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
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!'
                });

            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body).not.toHaveProperty('token');
            expect(loginResponse.body).toHaveProperty('requiresTwoFactor', true);

            // Verify 2FA
            const verifyResponse = await request(app)
                .post('/api/auth/verify-2fa')
                .send({
                    email: 'test@example.com',
                    token: require('speakeasy').totp({
                        secret: user.twoFactorSecret,
                        encoding: 'base32'
                    })
                });

            expect(verifyResponse.status).toBe(200);
            expect(verifyResponse.body).toHaveProperty('token');
        });
    });
}); 