const admin = require('firebase-admin');

let fcmInitialized = false;

const initFCM = () => {
  if (!fcmInitialized) {
    // Will automatically use GOOGLE_APPLICATION_CREDENTIALS
    try {
      if (!admin.apps.length) {
        admin.initializeApp();
      }
      fcmInitialized = true;
    } catch (e) {
      console.warn('FCM App failed to initialize. Push notifications will be disabled locally.');
    }
  }
};

/**
 * Sends a generic global notification to a specific token.
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
    console.log(`Successfully sent message: ${response}`);
    return true;
  } catch (error) {
    console.error('Error sending message:', error.message);
    return false;
  }
};

/**
 * Specifically formats and fires an election deadline reminder.
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

module.exports = {
  sendNotification,
  sendDeadlineReminder,
};
