/**
 * @file logger.js
 * @description Centralized logging utility that pipes server logs to Google Cloud Logging
 * (formerly Stackdriver) while echoing to the console in development.
 */

// --- Imports ---
const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

// --- Configuration ---
const transports = [];

// If we're not in a test environment, add the Google Cloud Logging transport
if (process.env.NODE_ENV !== 'test') {
  try {
    const loggingWinston = new LoggingWinston({
      projectId: process.env.GCP_PROJECT_ID || 'local-fallback-project-id',
      logName: 'election-assistant-server',
    });
    transports.push(loggingWinston);
  } catch (e) {
    console.warn('Google Cloud Logging initialization failed, falling back to console only.', e.message);
  }
}

// If we're not in production (or we are in test), log to the console with simpler formatting
if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Create the Winston logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports,
});

// --- Exports ---
module.exports = logger;
