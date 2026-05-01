/**
 * @file eslint.config.js
 * @description Configuration for ESLint. Defines linting rules and ignores 
 * specific directories like the build output (`dist/*`).
 */

// --- Imports ---
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// --- Configuration ---
module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
