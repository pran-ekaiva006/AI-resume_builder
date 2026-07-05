

'use strict';

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  testTimeout: 30000,
  forceExit: true,
  verbose: true,
};
