// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.MONITORING_UPDATE_INTERVAL = '1000';
process.env.MONITORING_RETENTION_PERIOD = '5000';
process.env.MONITORING_MAX_DATA_POINTS = '10';

// Increase test timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to keep test output clean
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
}; 