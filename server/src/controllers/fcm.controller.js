/**
 * @file fcm.controller.js
 * @description Controllers for managing Firebase Cloud Messaging (FCM) operations,
 * including triggering bulk reminders and sending test notifications.
 */

// --- Imports ---
const { executeReminders } = require('../workers/reminders');
const { sendNotification } = require('../services/fcm.service');
const { CivicApiError } = require('../utils/errors');

// --- Controllers ---

/**
 * Invoked by Google Cloud Scheduler to trigger broad sweeps for notification reminders.
 * Authenticates the request via a shared secret header.
 * 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
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
 * Debug manual endpoint for sending a single FCM notification.
 * 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
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

// --- Exports ---
module.exports = {
  triggerReminders,
  testNotification,
};
