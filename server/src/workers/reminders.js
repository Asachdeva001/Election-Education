/**
 * @file reminders.js
 * @description Worker functions for executing scheduled background tasks.
 * Upgraded to use Firebase Admin sendEachForMulticast() for high efficiency.
 */

// --- Imports ---
const { getFirestore } = require('../db/firestore');
const { sendMulticast } = require('../services/fcm.service');
const logger = require('../utils/logger'); // Centralized GCP Logger

// --- Workers ---

/**
 * Iterates through user preferences stored in Firestore, targeting those
 * who opted into notifications and possess an fcmToken. Uses bulk multicast
 * sending to minimize network overhead.
 * 
 * @returns {Promise<Object>} An object containing the count of triggered notifications.
 */
const executeReminders = async () => {
  const db = getFirestore();
  if (!db) {
      logger.warn('Firestore not running, skipping reminder job.');
      return { triggered: 0 };
  }

  try {
    const preferencesSnapshot = await db.collection('preferences')
      .where('notifyMode', '==', 'all')
      .get();
      
    if (preferencesSnapshot.empty) {
      logger.info('No eligible users found for reminders.');
      return { triggered: 0 };
    }

    const tokens = [];
    
    // Extract tokens for multicast grouping
    for (const doc of preferencesSnapshot.docs) {
      const { fcmToken } = doc.data();
      if (fcmToken) {
         tokens.push(fcmToken);
      }
    }

    let count = 0;
    
    if (tokens.length > 0) {
      // Chunk tokens into groups of 500 (Firebase API limits)
      const chunkSize = 500;
      
      const mockElectionName = `Upcoming Election`;
      const mockDaysLeft = 3; 
      const title = 'Election Deadline Approaching!';
      const body = `The deadline for ${mockElectionName} is in ${mockDaysLeft} days. Ensure you are registered!`;

      for (let i = 0; i < tokens.length; i += chunkSize) {
        const chunk = tokens.slice(i, i + chunkSize);
        // Dispatch bulk push notifications efficiently
        const successCount = await sendMulticast(chunk, title, body, { type: 'deadline' });
        count += successCount;
      }
    }

    return { triggered: count };
  } catch (err) {
    logger.error('Failed to execute reminder job', { error: err.message, stack: err.stack });
    throw err;
  }
};

// --- Exports ---
module.exports = {
  executeReminders,
};
