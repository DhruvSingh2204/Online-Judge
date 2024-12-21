const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const problemDB = require('../models/problems')
const peopleDB = require('../models/people')

exports.run = async (req, res) => {
    // function for submit
    const { code, inputs, output: expectedOutput, correctUN, name } = req.body;

    // console.log('Code received: ', code);
    // console.log('Inputs received: ', inputs);
    // console.log('Expected Output: ', expectedOutput);

    const normalizeInput = (input) => input.trim().replace(/\r\n|\r|\n/g, '\n');
    const inputString = normalizeInput(inputs);

    const filePath = path.join(__dirname, 'temp_code.cpp');
    fs.writeFileSync(filePath, code);

    const outputFilePath = path.join(__dirname, 'temp_code.out');
    const compileCommand = `g++ "${filePath}" -o "${outputFilePath}"`;

    exec(compileCommand, (compileErr, stdout, stderr) => {
        if (compileErr) {
            // console.error(`Compilation error: ${stderr}`);
            wrongSubmission(correctUN , name , "Compile Error")
            return res.status(201).json({ error: 'Compilation failed', details: stderr, expectedOutput: expectedOutput });
        }

        const runCommand = `"${outputFilePath}"`;
        const runProcess = exec(runCommand);

        // console.log('Normalized Input String:\n', inputString);
        runProcess.stdin.write(inputString + '\n');
        runProcess.stdin.end();

        let output = '';
        runProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
            // console.error('Error:', data.toString());
        });

        runProcess.on('close', (code) => {
            if (code !== 0) {
                wrongSubmission(correctUN , name , "Runtime Error")
                return res.status(202).json({ error: 'Execution failed', expectedOutput: expectedOutput });
            }

            const normalizeOutput = (output) => output.trim().replace(/\s+/g, ' ');
            const programOutputNormalized = normalizeOutput(output);
            const expectedOutputNormalized = normalizeOutput(expectedOutput);

            // console.log('Program Output:\n', output.trim());
            // console.log('Normalized Program Output:', programOutputNormalized);
            // console.log('Normalized Expected Output:', expectedOutputNormalized);

            const isOutputCorrect = programOutputNormalized === expectedOutputNormalized;

            if (isOutputCorrect) {
                markInDatabase(correctUN, name)
            } else {
                wrongSubmission(correctUN , name , "Wrong Answer")
            }

            return res.status(200).json({
                output: output.trim(),
                isOutputCorrect,
                expectedOutput: expectedOutput
            });
        });
    });
};

async function markInDatabase(correctUN, name) {
    try {
        const user = await peopleDB.findOne({ username: correctUN });

        if (!user) {
            throw new Error(`User with username ${correctUN} not found`);
        }

        if (!Array.isArray(user.solved)) {
            user.solved = [];
        }
        if (!Array.isArray(user.submissions)) {
            user.submissions = [];
        }

        user.submissions.push({ name: name, isCorrect: true, time: new Date() , verdict : "Accepted" });

        if(!user.solved.includes(name)) {
            user.solved.push(name);
        }

        await user.save();

        console.log(`Problem "${name}" marked as solved for user "${correctUN}".`);
    } catch (error) {
        console.error(`Error in markInDatabase: ${error.message}`);
        throw error;
    }
}

async function wrongSubmission(correctUN, name , verdict1) {
    const user = await peopleDB.findOne({ username: correctUN });

    if (!Array.isArray(user.submissions)) {
        user.submissions = [];
    }

    user.submissions.push({ name: name, isCorrect: false, time: new Date() , verdict : verdict1 });

    await user.save();
}

exports.runUserInput = async (req, res) => {
    const { code, inputs, name: problemName } = req.body;
    // console.log(code);

    try {
        // Fetch the problem from the database
        const problem = await problemDB.find({ name: problemName });
        if (problem.length === 0) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Get the correct code from the database
        const correctCode = problem[0].correctCode;

        // console.log('correct code -> ' , correctCode);

        // Paths for correct code, user code, and their output files
        const correctCodeFile = path.join(__dirname, 'correct_code.cpp');
        const userCodeFile = path.join(__dirname, 'user_code.cpp');
        const correctOutputFile = path.join(__dirname, 'correct_output.txt');
        const userOutputFile = path.join(__dirname, 'user_output.txt');

        // Write correct code and user code to files
        fs.writeFileSync(correctCodeFile, correctCode);
        fs.writeFileSync(userCodeFile, code);

        // Helper to normalize outputs
        const normalizeOutput = (output) => output.trim().replace(/\s+/g, ' ').toLowerCase();

        // Function to compile, run code, and save its output
        const executeCode = async (filePath, outputFile, inputs) => {
            const outputFilePath = filePath.replace('.cpp', '.out');
            const compileCommand = `g++ "${filePath}" -o "${outputFilePath}"`;

            return new Promise((resolve, reject) => {
                exec(compileCommand, (compileErr, stdout, stderr) => {
                    if (compileErr) {
                        console.log(compileErr)
                        return res.status(201).json({ error: `Compilation failed`, details: stderr, correctOutput: correctOutput });
                    }

                    const runCommand = `"${outputFilePath}"`;
                    const runProcess = exec(runCommand);

                    runProcess.stdin.write(inputs.trim() + '\n');
                    runProcess.stdin.end();

                    let output = '';
                    runProcess.stdout.on('data', (data) => {
                        output += data.toString();
                    });

                    runProcess.stderr.on('data', (data) => {
                        console.error('Execution Error:', data.toString());
                    });

                    runProcess.on('close', (code) => {
                        if (code !== 0) {
                            return res.status(202).json({ error: `Execution failed with code ${code}` });
                        }
                        fs.writeFileSync(outputFile, output.trim());
                        resolve(normalizeOutput(output));
                    });
                });
            });
        };

        // Execute correct code and user code
        const correctOutput = await executeCode(correctCodeFile, correctOutputFile, inputs);
        const userOutput = await executeCode(userCodeFile, userOutputFile, inputs);

        // console.log('correct output -> ' , correctOutput)
        // console.log('user output -> ' , userOutput)

        // Compare the outputs
        const isCorrect = correctOutput === userOutput;

        return res.status(200).json({
            isCorrect,
            correctCodeOutput: correctOutput,
            userCodeOutput: userOutput
        });
    } catch (error) {
        console.error('Error in runUserInput:', error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

exports.runUserCode = async(req , res) => {
    const {code , customInput} = req.body;

    console.log(code , customInput);


    
    return res.status(200).json('dekh')
}