const { Firestore } = require('@google-cloud/firestore');

let firestore = null;

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

module.exports = {
  getFirestore,
};
