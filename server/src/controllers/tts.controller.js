/**
 * @file tts.controller.js
 * @description Controllers for handling Text-to-Speech requests.
 */

// --- Imports ---
const ttsService = require('../services/tts.service');
const { CivicApiError } = require('../utils/errors');

// --- Controllers ---

/**
 * Controller to handle requests to synthesize speech from text.
 * 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
const synthesizeSpeech = async (req, res, next) => {
  try {
    const { text, languageCode, ssmlGender } = req.body;

    if (!text) {
      throw new CivicApiError('Text is required for speech synthesis.', 400);
    }

    const audioContent = await ttsService.generateSpeech(text, languageCode, ssmlGender);

    // Return the base64 encoded audio string
    return res.json({ audioContent });
  } catch (error) {
    next(error);
  }
};

// --- Exports ---
module.exports = {
  synthesizeSpeech,
};
