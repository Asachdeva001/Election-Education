const { getFirestore } = require('../db/firestore');
const { CivicApiError } = require('../utils/errors');

/**
 * Controller to save anon/pseudonymized user timeline preferences
 * Proves Firestore connectivity and serves as foundation for Task 6.
 */
const saveUserPreferences = async (req, res, next) => {
  try {
    const { deviceId, electionId, notifyMode, fcmToken } = req.body;

    if (!deviceId || !electionId) {
       throw new CivicApiError('Missing required properties: deviceId, electionId', 400);
    }

    // Fetch Firestore native client
    const firestore = getFirestore();

    if (!firestore) {
        throw new CivicApiError('Firestore is not configured.', 500);
    }

    // The collection 'preferences' tracks generic settings indexed by an anonymized device ID
    const docRef = firestore.collection('preferences').doc(String(deviceId));
    
    const payload = {
      electionId: String(electionId),
      notifyMode: notifyMode || 'none',
      updatedAt: new Date(),
    };
    
    if (fcmToken) {
        payload.fcmToken = fcmToken;
    }
    
    await docRef.set(payload, { merge: true });

    return res.json({ success: true, message: 'Preferences saved securely.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveUserPreferences,
};
