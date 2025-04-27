const mongoose = require('mongoose');
const { config } = require('../config');
const User = require('../models/user.model');

describe('Database Connection', () => {
    beforeAll(async () => {
        await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should connect to MongoDB', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });

    it('should create and retrieve a user', async () => {
        const userData = {
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
        };

        const user = await User.create(userData);
        expect(user).toHaveProperty('_id');
        expect(user.email).toBe(userData.email);

        const retrievedUser = await User.findById(user._id);
        expect(retrievedUser).toBeTruthy();
        expect(retrievedUser.email).toBe(userData.email);
    });
}); 