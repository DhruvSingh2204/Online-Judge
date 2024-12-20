const express = require('express')
const problemSchema = require('../models/problems')
const peopleDB = require('../models/people')

exports.showProblems = async (req, res) => {
    try {
        const allProblems = await problemSchema.find();
        // console.log('all problems ->' , allProblems);

        return res.status(200).json({ allProblems });
    } catch {
        console.log('Internal server error');
        return res.status(500).json('Internal Server Error');
    }
}

exports.solved = async (req, res) => {
    const { correctUN } = req.body;
    // console.log('correctUN -> ' , correctUN)
    try {
        const solvedProblems = await peopleDB.find({username : correctUN});
        return res.status(200).json(solvedProblems[0].solved)
    } catch {
        console.log('Internal server error');
        return res.status(500).json('Internal Server Error');
    }
}