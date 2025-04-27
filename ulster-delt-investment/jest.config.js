module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/docs/',
    '/scripts/'
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  testTimeout: 10000
}; 