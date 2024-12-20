const express = require('express')
const router = express.Router()
const PostDB = require('../models/post')

exports.post = async(req , res) => {
    const {correctUN , topic , content} = req.body;
    
    try {
        if(!correctUN) {
            return res.status(400).json({'message' : "Unauthorized Access"});
        }
        if(!topic) {
            return res.status(400).json({'message' : "Input Topic"});
        }

        const newPost = await PostDB.create({
            sender : correctUN ,
            description : topic ,
            content : content
        })

        // console.log(newPost);

        return res.status(200).json({'message' : "posted"});
    } catch {
        console.log('Internal server error');
        return res.status(500).json('Internal Server Error');
    }
}

exports.showPosts = async(req , res) => {
    try {
        const allPosts = await PostDB.find();

        // console.log(allPosts);

        return res.status(200).json({'message' : allPosts})
    } catch {
        console.log('Internal server error');
        return res.status(500).json('Internal Server Error');
    }
}