const express = require('express');
const civicController = require('../controllers/civic.controller');

const router = express.Router();

router.get('/elections', civicController.getElections);
router.get('/voter-info', civicController.getVoterInfo);

module.exports = router;
