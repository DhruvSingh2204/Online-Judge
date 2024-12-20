const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
    interviewername : {
        type : String ,
        required : false
    } ,
    intervieweename : {
        type : String ,
        required : false
    } ,
    interviewID : {
        type : String ,
        required : true ,
        unique : true
    } ,
    chat : [
        {
            sender : {type : String , required : true} ,
            message : {type : String , required : true} ,
            dt : {type : Date , required : true}
        }
    ]
})

const interview = mongoose.model('interview', interviewSchema);

module.exports = interview;