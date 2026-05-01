/**
 * @file user.routes.js
 * @description Express routing for user-related API endpoints.
 */

// --- Imports ---
const express = require('express');
const userController = require('../controllers/user.controller');

// --- Configuration ---
const router = express.Router();

// --- Routes ---
/**
 * POST /api/user/preferences
 * Saves user notification preferences.
 */
router.post('/preferences', userController.saveUserPreferences);

// --- Exports ---
module.exports = router;
