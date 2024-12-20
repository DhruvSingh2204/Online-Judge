const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController')

router.post('/showProblems' , problemController.showProblems);
router.post('/solved' , problemController.solved);

module.exports = router;