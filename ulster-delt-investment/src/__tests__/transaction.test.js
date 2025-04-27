const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { generateToken } = require('../utils/auth');

describe('Transaction Endpoints', () => {
    let testUser;
    let authToken;
    let sourceAccount;
    let destinationAccount;

    beforeEach(async () => {
        // Create a test user
        testUser = await User.create({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        });

        // Generate auth token
        authToken = generateToken(testUser);

        // Create test accounts
        sourceAccount = await Account.create({
            userId: testUser._id,
            type: 'checking',
            currency: 'USD',
            balance: 1000
        });

        destinationAccount = await Account.create({
            userId: testUser._id,
            type: 'savings',
            currency: 'USD',
            balance: 500
        });
    });

    describe('GET /api/transactions', () => {
        it('should get user transactions', async () => {
            // Create some test transactions
            await Transaction.create([
                {
                    fromAccount: sourceAccount._id,
                    toAccount: destinationAccount._id,
                    amount: 100,
                    currency: 'USD',
                    type: 'transfer',
                    status: 'completed'
                },
                {
                    fromAccount: sourceAccount._id,
                    toAccount: destinationAccount._id,
                    amount: 200,
                    currency: 'USD',
                    type: 'transfer',
                    status: 'completed'
                }
            ]);

            const res = await request(app)
                .get('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty('amount', 100);
            expect(res.body[1]).toHaveProperty('amount', 200);
        });

        it('should filter transactions by date range', async () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');

            await Transaction.create({
                fromAccount: sourceAccount._id,
                toAccount: destinationAccount._id,
                amount: 100,
                currency: 'USD',
                type: 'transfer',
                status: 'completed',
                createdAt: new Date('2024-06-15')
            });

            const res = await request(app)
                .get('/api/transactions')
                .query({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });

    describe('POST /api/transactions', () => {
        it('should create a new transaction', async () => {
            const res = await request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    fromAccount: sourceAccount._id,
                    toAccount: destinationAccount._id,
                    amount: 100,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('amount', 100);
            expect(res.body).toHaveProperty('status', 'completed');

            // Verify account balances were updated
            const updatedSourceAccount = await Account.findById(sourceAccount._id);
            const updatedDestinationAccount = await Account.findById(destinationAccount._id);
            expect(updatedSourceAccount.balance).toBe(900);
            expect(updatedDestinationAccount.balance).toBe(600);
        });

        it('should not create transaction with insufficient funds', async () => {
            const res = await request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    fromAccount: sourceAccount._id,
                    toAccount: destinationAccount._id,
                    amount: 2000,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Insufficient funds');
        });

        it('should not create transaction with invalid account', async () => {
            const res = await request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    fromAccount: 'invalidaccountid',
                    toAccount: destinationAccount._id,
                    amount: 100,
                    currency: 'USD'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/transactions/:id', () => {
        it('should get transaction details', async () => {
            const transaction = await Transaction.create({
                fromAccount: sourceAccount._id,
                toAccount: destinationAccount._id,
                amount: 100,
                currency: 'USD',
                type: 'transfer',
                status: 'completed'
            });

            const res = await request(app)
                .get(`/api/transactions/${transaction._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('amount', 100);
            expect(res.body).toHaveProperty('type', 'transfer');
        });

        it('should not get transaction with invalid id', async () => {
            const res = await request(app)
                .get('/api/transactions/invalidid')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
}); 