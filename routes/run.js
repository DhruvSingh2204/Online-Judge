const express = require('express');
const router = express.Router();
const runController = require('../controllers/run')

router.post('/runCode' , runController.run);
router.post('/runUserInput' , runController.runUserInput);

module.exports = router;