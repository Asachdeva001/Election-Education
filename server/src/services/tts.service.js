/**
 * @file tts.service.js
 * @description Service for interacting with the Google Cloud Text-to-Speech API.
 */

// --- Imports ---
const textToSpeech = require('@google-cloud/text-to-speech');
const { CivicApiError } = require('../utils/errors');

// --- State ---
let ttsClient = null;

// --- Helpers ---

/**
 * Initializes and retrieves the Google Cloud TTS client.
 * Includes a fallback mechanism for local development without credentials.
 * 
 * @returns {Object|null} The TTS Client instance.
 */
const getClient = () => {
  if (!ttsClient) {
    // Rely on GOOGLE_APPLICATION_CREDENTIALS
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.NODE_ENV !== 'test') {
      console.warn('TTS GOOGLE_APPLICATION_CREDENTIALS missing. Audio synthesis will fall back to mock data.');
      return null;
    }

    try {
      ttsClient = new textToSpeech.TextToSpeechClient({
          projectId: process.env.GCP_PROJECT_ID || 'local-fallback-project-id'
      });
    } catch (e) {
      console.warn('Failed to initialize TTS Client:', e.message);
    }
  }
  return ttsClient;
};

// --- Services ---

/**
 * Generates an audio stream (base64) from text using Google Cloud TTS.
 * 
 * @param {string} text - The text to synthesize.
 * @param {string} [languageCode='en-US'] - The BCP-47 language code.
 * @param {string} [ssmlGender='NEUTRAL'] - The preferred gender of the voice.
 * @returns {Promise<string>} Base64 encoded MP3 audio content.
 * @throws {CivicApiError} If the API call fails.
 */
const generateSpeech = async (text, languageCode = 'en-US', ssmlGender = 'NEUTRAL') => {
  const client = getClient();

  if (!client) {
      // Mock Base64 audio for dev environments missing credentials (this is a valid, very short silent MP3)
      console.log('TTS Mock Fallback triggered for text:', text.substring(0, 20) + '...');
      return 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjE2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIwADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP//OEAAAAAABpXkIAAAABQAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAIAAAACAA=';
  }

  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: languageCode, ssmlGender: ssmlGender },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    // Return the binary audio content represented as a base64 string
    return response.audioContent.toString('base64');
  } catch (error) {
    console.error('TTS Synthesis Error:', error);
    throw new CivicApiError('Failed to generate speech from text.', 500);
  }
};

// --- Exports ---
module.exports = {
  generateSpeech,
};
