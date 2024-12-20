const express = require('express');
const router = express.Router();
const authController = require('../controllers/people')

router.post('/signUp' , authController.signUp);
router.post('/login' , authController.login);
router.post('/fetchUserData' , authController.fetchUserData)

module.exports = router;