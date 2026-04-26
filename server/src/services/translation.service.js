const { Translate } = require('@google-cloud/translate').v2;

let translateClient;

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

/**
 * Translates text into the target language.
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

module.exports = {
   translateText
};
