/**
 * @file index.js
 * @description Main entry point for the Election Server Backend.
 * Configures the Express application, sets up routing, handles static files,
 * and initializes the global error handler and database connection.
 * Incorporates security (Helmet, Rate Limiting, Strict CORS) and efficiency (Compression).
 */

// --- Imports ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Internal Utilities & DB
const { CivicApiError } = require('./utils/errors');
const { initializeDb } = require('./db/postgres');
const logger = require('./utils/logger'); // Centralized GCP Logger

// Route Modules
const civicRoutes = require('./routes/civic.routes');
const userRoutes = require('./routes/user.routes');
const fcmRoutes = require('./routes/fcm.routes');
const dialogflowRoutes = require('./routes/dialogflow.routes');
const translationRoutes = require('./routes/translation.routes');
const ttsRoutes = require('./routes/tts.routes'); // New TTS Route

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 8080;

// --- Security & Performance Middleware ---
// 1. Helmet: Secures HTTP headers
app.use(helmet());

// 2. Compression: Compresses response bodies for efficiency
app.use(compression());

// 3. Strict CORS Policy
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:8080', 'http://localhost:3000'], // Replace with actual frontend domains
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// 4. Rate Limiting: Protects against abuse and DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
      error: 'TooManyRequests',
      message: 'Too many requests created from this IP, please try again after 15 minutes'
  }
});

// Apply rate limiter specifically to API routes
app.use('/api/', apiLimiter);

// --- Standard Middleware ---
app.use(express.json());

// --- Routes Registration ---
app.use('/api/civic', civicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/fcm', fcmRoutes);
app.use('/api/dialogflow', dialogflowRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/tts', ttsRoutes);

/**
 * Basic Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Election Server is running.' });
});

// --- Static Files & Fallback ---
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Fallback for React Native Web navigation.
 */
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// --- Global Error Handler ---
/**
 * Captures all unhandled errors and formats them consistently.
 * Logs to GCP via Winston.
 */
app.use((err, req, res, next) => {
  if (err instanceof CivicApiError) {
    logger.warn(`API Error: ${err.message}`, { status: err.status });
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
    });
  }

  logger.error('Unhandled Server Error:', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected external error occurred.',
  });
});

// --- Server Initialization ---
/**
 * Starts the server and initializes the PostgreSQL database.
 */
if (require.main === module) {
  app.listen(PORT, async () => {
    logger.info(`Server listening on port ${PORT}`);
    await initializeDb();
  });
}

// Exported for supertest integration testing
module.exports = app;
