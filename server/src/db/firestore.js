/**
 * @file firestore.js
 * @description Manages the initialization and retrieval of the Google Cloud Firestore client.
 */

// --- Imports ---
const { Firestore } = require('@google-cloud/firestore');

// --- State ---
let firestore = null;

// --- Helpers ---
/**
 * Initializes and retrieves the Firestore singleton instance.
 * Automatically handles authentication locally or in Cloud Run.
 * 
 * @returns {Firestore|null} The initialized Firestore client or null if initialization fails.
 */
const getFirestore = () => {
  if (!firestore) {
    // When running in Google Cloud Run, it automatically authenticates using the service account assigned.
    // Locally, it relies on GOOGLE_APPLICATION_CREDENTIALS.
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.NODE_ENV !== 'test') {
      console.warn('Firestore GOOGLE_APPLICATION_CREDENTIALS missing. Mock DB will be used if failing.');
    }

    try {
      firestore = new Firestore({
        projectId: process.env.GCP_PROJECT_ID || 'local-fallback-project-id',
        // In native production, projectId is picked automatically if not supplied
      });
    } catch (e) {
       console.error("Failed to initialize Firestore", e);
    }
  }
  return firestore;
};

// --- Exports ---
module.exports = {
  getFirestore,
};
