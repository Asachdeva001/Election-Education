/**
 * @file user.routes.js
 * @description Express routing for user-related API endpoints.
 * Implements express-validator to strictly sanitize and validate incoming payloads.
 */

// --- Imports ---
const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/user.controller');

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
 * POST /api/user/preferences
 * Saves user notification preferences.
 */
router.post(
  '/preferences',
  [
    body('deviceId').isString().notEmpty().trim().escape(),
    body('electionId').isString().notEmpty().trim().escape(),
    body('notifyMode').optional().isString().trim().escape(),
    body('fcmToken').optional().isString().trim(),
  ],
  validate,
  userController.saveUserPreferences
);

// --- Exports ---
module.exports = router;
