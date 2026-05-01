/**
 * @file jest.config.js
 * @description Configuration for Jest testing framework. Sets up coverage thresholds,
 * module transformations, and test environments.
 */

// --- Configuration ---
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  collectCoverage: true,
  
  // --- Coverage Thresholds ---
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  
  // --- Transform Configuration ---
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ]
};
