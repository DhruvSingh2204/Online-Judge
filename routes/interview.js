const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController')

router.post('/startInterview' , interviewController.startInterview);
router.post('/leaveInterview' , interviewController.leaveInterview);
router.post('/sendmsg' , interviewController.sendmsg);
router.post('/loadChat' , interviewController.loadChat);

module.exports = router;