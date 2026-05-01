/**
 * @file translation.controller.js
 * @description Controller handling incoming API requests for translation.
 */

// --- Imports ---
const { translateText } = require('../services/translation.service');
const { CivicApiError } = require('../utils/errors');

// --- Controllers ---

/**
 * Endpoint for front-end clients to bulk translate generic strings.
 * Validates the payload and utilizes the translation service.
 * 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
const handleBulkTranslation = async (req, res, next) => {
    try {
        const { texts, targetLanguage } = req.body;
        
        // Input validation
        if (!texts || !Array.isArray(texts) || !targetLanguage) {
            throw new CivicApiError('Invalid payload. Expected { texts: [], targetLanguage: "string" }', 400);
        }

        // Short-circuit for English
        if (targetLanguage === 'en') {
            return res.json({ translations: texts });
        }

        // Process translation
        const translations = await translateText(texts, targetLanguage);
        res.json({ translations });

    } catch (error) {
        next(error);
    }
};

// --- Exports ---
module.exports = {
    handleBulkTranslation
};
