module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/integration/**/*.integration.test.js'],
    setupFiles: ['<rootDir>/src/__tests__/setup.js'],
    testTimeout: 30000,
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage/integration',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/**/*.integration.test.js',
        '!src/__tests__/**'
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}; 