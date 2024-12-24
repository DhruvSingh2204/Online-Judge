const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController')
const verifyjwt = require('../middleware/verifyJWT')

router.post('/startInterview' , verifyjwt.verifyToken , interviewController.startInterview);
router.post('/leaveInterview' , interviewController.leaveInterview);
router.post('/sendmsg' , verifyjwt.verifyToken , interviewController.sendmsg);
router.post('/loadChat' , verifyjwt.verifyToken , interviewController.loadChat);

module.exports = router;