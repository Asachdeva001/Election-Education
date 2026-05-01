/**
 * @file fcm.routes.js
 * @description Express routing for Firebase Cloud Messaging notification endpoints.
 */

// --- Imports ---
const express = require('express');
const fcmController = require('../controllers/fcm.controller');

// --- Configuration ---
const router = express.Router();

// --- Routes ---
/**
 * POST /api/fcm/trigger-reminders
 * Triggers batch processing of push notification reminders.
 */
router.post('/trigger-reminders', fcmController.triggerReminders);

/**
 * POST /api/fcm/test-notification
 * Sends a single test notification to a specific device token.
 */
router.post('/test-notification', fcmController.testNotification);

// --- Exports ---
module.exports = router;
