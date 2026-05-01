/**
 * @file dialogflow.routes.js
 * @description Express routing for Dialogflow webhook integration.
 */

// --- Imports ---
const express = require('express');
const dialogflowController = require('../controllers/dialogflow.controller');

// --- Configuration ---
const router = express.Router();

// --- Routes ---
/**
 * POST /api/dialogflow/webhook
 * Handles incoming webhook requests from the Dialogflow agent.
 */
router.post('/webhook', dialogflowController.handleWebhook);

// --- Exports ---
module.exports = router;
