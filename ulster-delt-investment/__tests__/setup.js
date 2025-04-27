const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { config } = require('../src/config');

let mongoServer;

// Connect to the in-memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clear database between tests
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Disconnect and stop server
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Mock Redis client
jest.mock('../src/utils/redis', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  }
}));

// Mock logger
jest.mock('../src/utils/db', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
})); 