/**
 * @file tts.routes.js
 * @description Defines routing for the Text-to-Speech (TTS) endpoints.
 * Implements express-validator to sanitize and validate incoming payloads.
 */

// --- Imports ---
const express = require('express');
const { body, validationResult } = require('express-validator');
const ttsController = require('../controllers/tts.controller');

// --- Router Setup ---
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

/**
 * @route POST /api/tts/synthesize
 * @description Generates base64 encoded audio from the provided text string.
 * @access Public (Protected by Rate Limiter)
 */
router.post(
  '/synthesize',
  [
    body('text').isString().notEmpty().trim().escape(),
    body('languageCode').optional().isString().trim().escape(),
    body('ssmlGender').optional().isString().trim().escape(),
  ],
  validate,
  ttsController.synthesizeSpeech
);

// --- Exports ---
module.exports = router;
