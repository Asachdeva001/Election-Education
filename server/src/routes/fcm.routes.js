const express = require('express');
const fcmController = require('../controllers/fcm.controller');

const router = express.Router();

router.post('/trigger-reminders', fcmController.triggerReminders);
router.post('/test-notification', fcmController.testNotification);

module.exports = router;
