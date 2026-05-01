/**
 * @file civic.routes.js
 * @description Express routing for Google Civic Information API endpoints.
 */

// --- Imports ---
const express = require('express');
const civicController = require('../controllers/civic.controller');

// --- Configuration ---
const router = express.Router();

// --- Routes ---
/**
 * GET /api/civic/elections
 * Fetches a list of upcoming elections.
 */
router.get('/elections', civicController.getElections);

/**
 * GET /api/civic/voter-info
 * Fetches detailed voter information for a specific address.
 */
router.get('/voter-info', civicController.getVoterInfo);

// --- Exports ---
module.exports = router;
