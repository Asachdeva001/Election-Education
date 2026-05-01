/**
 * @file fcm.service.js
 * @description Service for Firebase Cloud Messaging operations.
 * Handles the initialization of the Firebase Admin SDK and pushing notifications.
 * Upgraded to support multicast bulk messaging for efficiency.
 */

// --- Imports ---
const admin = require('firebase-admin');
const logger = require('../utils/logger'); // Centralized GCP Logger

// --- State ---
let fcmInitialized = false;

// --- Helpers ---

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * Relies on GOOGLE_APPLICATION_CREDENTIALS in the environment.
 */
const initFCM = () => {
  if (!fcmInitialized) {
    // Will automatically use GOOGLE_APPLICATION_CREDENTIALS
    try {
      if (!admin.apps.length) {
        admin.initializeApp();
      }
      fcmInitialized = true;
    } catch (e) {
      logger.warn('FCM App failed to initialize. Push notifications will be disabled locally.');
    }
  }
};

// --- Services ---

/**
 * Sends a generic global notification to a specific device token.
 * 
 * @param {string} token - The FCM device registration token.
 * @param {string} title - The notification title.
 * @param {string} body - The notification body text.
 * @param {Object} [data={}] - Additional custom data payload.
 * @returns {Promise<boolean>} True if successfully sent, false otherwise.
 */
const sendNotification = async (token, title, body, data = {}) => {
  initFCM();
  if (!fcmInitialized) return false;

  const payload = {
    notification: { title, body },
    data,
    token, // device registration token
  };

  try {
    const response = await admin.messaging().send(payload);
    logger.info(`Successfully sent message: ${response}`);
    return true;
  } catch (error) {
    logger.error('Error sending message:', { error: error.message });
    return false;
  }
};

/**
 * Sends a batch of notifications efficiently using multicast.
 * 
 * @param {Array<string>} tokens - Array of FCM device registration tokens.
 * @param {string} title - The notification title.
 * @param {string} body - The notification body text.
 * @param {Object} [data={}] - Additional custom data payload.
 * @returns {Promise<number>} Number of successfully sent messages.
 */
const sendMulticast = async (tokens, title, body, data = {}) => {
  initFCM();
  if (!fcmInitialized || !tokens || tokens.length === 0) return 0;

  const payload = {
    notification: { title, body },
    data,
    tokens, // Array of tokens (max 500 per call)
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(payload);
    logger.info(`Successfully sent ${response.successCount} messages via multicast.`);
    if (response.failureCount > 0) {
      logger.warn(`${response.failureCount} multicast messages failed.`);
    }
    return response.successCount;
  } catch (error) {
    logger.error('Error sending multicast message:', { error: error.message });
    return 0;
  }
};

/**
 * Specifically formats and fires an election deadline reminder notification.
 * 
 * @param {string} token - The FCM device registration token.
 * @param {string} electionName - The name of the approaching election.
 * @param {number} daysLeft - Number of days until the deadline.
 * @returns {Promise<boolean>} True if successfully sent, false otherwise.
 */
const sendDeadlineReminder = async (token, electionName, daysLeft) => {
  let title = 'Election Deadline Approaching!';
  let body = `The deadline for ${electionName} is in ${daysLeft} days. Ensure you are registered!`;

  if (daysLeft === 0) {
    title = 'Today is Election Day!';
    body = `The ${electionName} is today. Make sure your voice is heard at the polls!`;
  }

  return await sendNotification(token, title, body, { type: 'deadline', electionName });
};

// --- Exports ---
module.exports = {
  sendNotification,
  sendMulticast,
  sendDeadlineReminder,
};
