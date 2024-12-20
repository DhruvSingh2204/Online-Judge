const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const peopleSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    solved: {
        type: [String]
    },
    submissions: [
        {
            name: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            time: { type: Date, required: true },
            verdict : {type : String }
        }
    ]
})

const people = mongoose.model('people', peopleSchema);

module.exports = people;