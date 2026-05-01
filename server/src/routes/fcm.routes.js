/**
 * @file fcm.routes.js
 * @description Express routing for Firebase Cloud Messaging notification endpoints.
 * Implements express-validator to sanitize and validate incoming payloads.
 */

// --- Imports ---
const express = require('express');
const { body, validationResult } = require('express-validator');
const fcmController = require('../controllers/fcm.controller');

// --- Configuration ---
const router = express.Router();

// --- Middleware ---
/**
 * Generic validation handler. If errors exist, returns a 400 with details.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- Routes ---
/**
 * POST /api/fcm/trigger-reminders
 * Triggers batch processing of push notification reminders.
 * Validation not strictly needed for body as it relies on a header secret, 
 * but added for consistency if payload is expanded.
 */
router.post('/trigger-reminders', fcmController.triggerReminders);

/**
 * POST /api/fcm/test-notification
 * Sends a single test notification to a specific device token.
 */
router.post(
  '/test-notification',
  [
    body('token').isString().notEmpty().trim(),
    body('title').optional().isString().trim().escape(),
    body('body').optional().isString().trim().escape(),
  ],
  validate,
  fcmController.testNotification
);

// --- Exports ---
module.exports = router;
