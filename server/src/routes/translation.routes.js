/**
 * @file translation.routes.js
 * @description Express routing for translation API endpoints.
 */

// --- Imports ---
const express = require('express');
const translationController = require('../controllers/translation.controller');

// --- Configuration ---
const router = express.Router();

// --- Routes ---
/**
 * POST /api/translation/bulk
 * Translates an array of strings to a specified target language.
 */
router.post('/bulk', translationController.handleBulkTranslation);

// --- Exports ---
module.exports = router;
