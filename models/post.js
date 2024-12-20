const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    datetime: {
        type: Date,
        default: Date.now
    }
});
const PostOJ = mongoose.model('PostOJ', postSchema);
module.exports = PostOJ;