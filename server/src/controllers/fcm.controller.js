const { executeReminders } = require('../workers/reminders');
const { sendNotification } = require('../services/fcm.service');
const { CivicApiError } = require('../utils/errors');

/**
 * Invoked by Google Cloud Scheduler to trigger broad sweeps.
 */
const triggerReminders = async (req, res, next) => {
  try {
    // Basic shared secret header check logic commonly used with Cloud Scheduler
    const authHeader = req.headers['x-scheduler-secret'];
    if (process.env.NODE_ENV !== 'test' && authHeader !== process.env.SCHEDULER_SECRET) {
      throw new CivicApiError('Unauthorized Scheduler Trigger', 401);
    }

    const { triggered } = await executeReminders();
    res.json({ success: true, notificationsSent: triggered });
  } catch (error) {
    next(error);
  }
};

/**
 * Debug manual endpoint.
 */
const testNotification = async (req, res, next) => {
  try {
    const { token, title, body } = req.body;
    if (!token) throw new CivicApiError('Token is required for manual send', 400);

    const success = await sendNotification(token, title || 'Test', body || 'Test Push Content');
    res.json({ success });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerReminders,
  testNotification,
};
