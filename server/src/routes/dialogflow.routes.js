const express = require('express');
const dialogflowController = require('../controllers/dialogflow.controller');

const router = express.Router();

router.post('/webhook', dialogflowController.handleWebhook);

module.exports = router;
