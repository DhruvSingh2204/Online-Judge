const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    name : {
        type : String ,
        required : true
    } ,
    description : {
        type : String ,
        required : true
    } ,
    constraints : {
        type : String ,
        required : true
    } ,
    topicTags : {
        type : [String] 
    } ,
    exampleTc : {
        type : [String] 
    } ,
    tcAns : {
        type : [String]
    } ,
    inputs : {
        type : String ,
        required : true
    } ,
    outputs : {
        type : String ,
        required : true
    } ,
    input : {
        type : String ,
        required : true
    } ,
    output : {
        type : String ,
        required : true
    } , 
    correctCode : {
        type : String ,
        required : true
    }
})

const problems = mongoose.model('problems', problemSchema);
module.exports = problems;