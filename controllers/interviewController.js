const express = require('express')
const router = express.Router()
const interviewDB = require('../models/interview');
const interview = require('../models/interview');

exports.startInterview = async(req , res) => {
    const {name , interviewID , role} = req.body;

    // console.log(name , interviewID , role)
    
    const interview = await interviewDB.findOne({interviewID : interviewID});
    
    if(!interview) { // create an interview room with this ID
        const makeInterviewRoom = await interviewDB.create({
            interviewID: interviewID,
            ...(role === 'Interviewer'
                ? { interviewername: name }
                : { intervieweename: name })
        });

        return res.status(200).json({verdict : 'new Room Created' , start : false});
    } else if((!interview.interviewername || interview.interviewername == '') && role == 'Interviewer') {
        interview.interviewername = name;

        await interview.save();
        let start = false;
        if(interview.intervieweename && interview.intervieweename != '') start = true;
        return res.status(200).json({verdict : 'Interviewer Joined ' , start});
    } else if((!interview.intervieweename || interview.intervieweename == '') && role == 'Interviewee') {
        interview.intervieweename = name;

        await interview.save();
        let start = false;
        if(interview.interviewername && interview.interviewername != '') start = true;
        return res.status(200).json({verdict : 'Interviewee Joined ' , start});
    }

    return res.status(201).json('Interview Room Filled');
}

exports.leaveInterview = async(req , res) => {
    const {role , interviewID} = req.body;

    // console.log(role , interviewID)

    const interview = await interviewDB.findOne({interviewID : interviewID});

    console.log(interview)

    if(role == 'Interviewer') {
        interview.interviewername = ''
        await interview.save();
    } else {
        interview.intervieweename = ''
        await interview.save();
    }

    if(!interview.intervieweename && !interview.interviewername) {
        // delete interview from interviewDB
        await interviewDB.deleteOne({ interviewID : interview.interviewID });
    }

    return res.status(200).json(`${role} left the interview`);
}

exports.sendmsg = async(req , res) => {
    const {role , interviewID , msg} = req.body;

    const interview = await interviewDB.findOne({interviewID : interviewID});

    if(!interview.chat) {
        interview.chat = []
    }

    interview.chat.push({
        sender: role,
        message: msg,
        dt: new Date(),
    });
    // console.log(interview);
    await interview.save();

    return res.status(200).json('bhej dia msg bhauu');
}

exports.loadChat = async(req , res) => {
    const {role , interviewID} = req.body;

    const interview = await interviewDB.findOne({interviewID : interviewID});

    return res.status(200).json(interview.chat);
}