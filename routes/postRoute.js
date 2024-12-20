const express = require('express');
const router = express.Router();
const postController = require('../controllers/post')

router.post('/post' , postController.post);
router.post('/showPosts' , postController.showPosts)

module.exports = router;