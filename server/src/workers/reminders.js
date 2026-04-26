const { getFirestore } = require('../db/firestore');
const { sendDeadlineReminder } = require('../services/fcm.service');

/**
 * Iterates through user preferences stored in Firestore, targeting those
 * who opted into notifications and possess an fcmToken.
 */
const executeReminders = async () => {
  const db = getFirestore();
  if (!db) {
      console.warn('Firestore not running, skipping reminder job.');
      return { triggered: 0 };
  }

  try {
    const preferencesSnapshot = await db.collection('preferences')
      .where('notifyMode', '==', 'all')
      .get();
      
    if (preferencesSnapshot.empty) {
      console.log('No eligible users found for reminders.');
      return { triggered: 0 };
    }

    let count = 0;
    
    // In a production environment this would be optimized heavily with batching
    for (const doc of preferencesSnapshot.docs) {
      const { fcmToken, electionId } = doc.data();

      // Dummy calculation for days left, assuming we fetch election details from cache
      const mockElectionName = `Election ${electionId}`;
      const mockDaysLeft = 3; 

      if (fcmToken) {
        // Send async message to client
        const success = await sendDeadlineReminder(fcmToken, mockElectionName, mockDaysLeft);
        if (success) count++;
      }
    }

    return { triggered: count };
  } catch (err) {
    console.error('Failed to execute reminder job', err);
    throw err;
  }
};

module.exports = {
  executeReminders,
};
