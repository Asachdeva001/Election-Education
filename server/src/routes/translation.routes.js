const express = require('express');
const translationController = require('../controllers/translation.controller');

const router = express.Router();

router.post('/bulk', translationController.handleBulkTranslation);

module.exports = router;
