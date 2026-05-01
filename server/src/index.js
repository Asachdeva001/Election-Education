/**
 * @file index.js
 * @description Main entry point for the Election Server Backend.
 * Configures the Express application, sets up routing, handles static files,
 * and initializes the global error handler and database connection.
 */

// --- Imports ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Internal Utilities & DB
const { CivicApiError } = require('./utils/errors');
const { initializeDb } = require('./db/postgres');

// Route Modules
const civicRoutes = require('./routes/civic.routes');
const userRoutes = require('./routes/user.routes');
const fcmRoutes = require('./routes/fcm.routes');
const dialogflowRoutes = require('./routes/dialogflow.routes');
const translationRoutes = require('./routes/translation.routes');

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 8080;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes Registration ---
app.use('/api/civic', civicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/fcm', fcmRoutes);
app.use('/api/dialogflow', dialogflowRoutes);
app.use('/api/translation', translationRoutes);

/**
 * Basic Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Election Server is running.' });
});

// --- Static Files & Fallback ---
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Fallback for React Native Web navigation (must be placed before the error handler).
 * Serves index.html for unknown non-API routes.
 */
app.get('*', (req, res, next) => {
  // If request is for an API route that missed, go to next() to hit the global error handler
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// --- Global Error Handler ---
/**
 * Captures all unhandled errors and formats them consistently.
 */
app.use((err, req, res, next) => {
  if (err instanceof CivicApiError) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
    });
  }

  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected external error occurred.',
  });
});

// --- Server Initialization ---
/**
 * Starts the server and initializes the PostgreSQL database.
 */
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await initializeDb();
});

module.exports = app;
