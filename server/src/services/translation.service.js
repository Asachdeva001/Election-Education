/**
 * @file translation.service.js
 * @description Service for interacting with the Google Cloud Translation API.
 * Provides a mock fallback for isolated local development where GCP credentials 
 * might be missing.
 */

// --- Imports ---
const { Translate } = require('@google-cloud/translate').v2;

// --- State ---
let translateClient;

// --- Helpers ---

/**
 * Initializes and retrieves the Google Cloud Translate client singleton.
 * Uses default application credentials if available.
 * 
 * @returns {Translate|undefined} The Translate client, or undefined if auth fails.
 */
const getTranslateClient = () => {
    if (!translateClient) {
        try {
            // Uses GOOGLE_APPLICATION_CREDENTIALS automatically
            translateClient = new Translate({ projectId: process.env.GCP_PROJECT_ID });
        } catch(e) {
            console.warn('Translation API disabled locally due to missing auth.');
        }
    }
    return translateClient;
}

// --- Services ---

/**
 * Translates an array of text strings into the specified target language.
 * Falls back to mock translations or original text gracefully on failure.
 * 
 * @param {string[]} textArray - The array of text strings to translate.
 * @param {string} targetLanguage - The ISO language code to translate into.
 * @returns {Promise<string[]>} The translated array of strings.
 */
const translateText = async (textArray, targetLanguage) => {
   const client = getTranslateClient();
   
   if (!client) {
       // Mock fallback for isolated development where GCP credentials aren't hooked up
       console.log('Mock translation returned.');
       return textArray.map(t => `${t} (Translated to ${targetLanguage})`);
   }
   
   try {
       const [translations] = await client.translate(textArray, targetLanguage);
       // Handle single string vs array responses gracefully
       return Array.isArray(translations) ? translations : [translations];
   } catch (error) {
       console.error("Translation failed:", error.message);
       return textArray; // Fallback to English on error
   }
}

// --- Exports ---
module.exports = {
   translateText
};
