const { translateText } = require('../services/translation.service');
const { CivicApiError } = require('../utils/errors');

/**
 * Endpoint for front-end clients to bulk translate generic strings.
 */
const handleBulkTranslation = async (req, res, next) => {
    try {
        const { texts, targetLanguage } = req.body;
        
        if (!texts || !Array.isArray(texts) || !targetLanguage) {
            throw new CivicApiError('Invalid payload. Expected { texts: [], targetLanguage: "string" }', 400);
        }

        if (targetLanguage === 'en') {
            return res.json({ translations: texts });
        }

        const translations = await translateText(texts, targetLanguage);
        res.json({ translations });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleBulkTranslation
};
