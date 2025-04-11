const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const problemDB = require('../models/problems')
const peopleDB = require('../models/people')
const { v4: uuidv4 } = require('uuid');

exports.run = async (req, res) => {
    const { code, inputs, output: expectedOutput, correctUN, name, lang } = req.body;

    const normalizeInput = (input) => input.trim().replace(/\r\n|\r|\n/g, '\n');
    const normalizeOutput = (output) => output.trim().replace(/\s+/g, ' ');
    const inputString = normalizeInput(inputs);
    const expectedOutputNormalized = normalizeOutput(expectedOutput);

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    let fileName, filePath, compileCommand, runCommand;

    switch (lang) {
        case 'cpp':
            fileName = 'temp_code.cpp';
            filePath = path.join(tempDir, fileName);
            fs.writeFileSync(filePath, code);
            const outputFilePath = path.join(tempDir, 'temp_code.out');
            compileCommand = `g++ "${filePath}" -o "${outputFilePath}"`;
            runCommand = `"${outputFilePath}"`;
            break;

        case 'py3':
            fileName = 'temp_code.py';
            filePath = path.join(tempDir, fileName);
            fs.writeFileSync(filePath, code);
            compileCommand = null;
            runCommand = `python3 "${filePath}"`;
            break;

        case 'java':
            fileName = 'Main.java';
            filePath = path.join(tempDir, fileName);
            fs.writeFileSync(filePath, code);
            compileCommand = `javac "${filePath}"`;
            runCommand = `java -cp "${tempDir}" Main`;
            break;

        default:
            return res.status(400).json({ error: 'Unsupported language' });
    }

    const cleanup = () => {
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (err) {
            console.error('Cleanup failed:', err);
        }
    };

    const runProgram = () => {
        const runProcess = exec(runCommand, { timeout: 5000 }, (err) => {
            if (err && err.killed) {
                wrongSubmission(correctUN, name, "Time Limit Exceeded");
                cleanup();
                return res.status(408).json({ error: 'Time Limit Exceeded', expectedOutput });
            }
        });

        runProcess.stdin.write(inputString + '\n');
        runProcess.stdin.end();

        let output = '';
        let errorOutput = '';

        runProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        runProcess.on('close', (code) => {
            if (code !== 0) {
                wrongSubmission(correctUN, name, "Runtime Error");
                cleanup();
                return res.status(202).json({
                    error: 'Execution failed',
                    stderr: errorOutput,
                    expectedOutput
                });
            }

            const programOutputNormalized = normalizeOutput(output);
            const isOutputCorrect = programOutputNormalized === expectedOutputNormalized;

            if (isOutputCorrect) {
                markInDatabase(correctUN, name);
            } else {
                wrongSubmission(correctUN, name, "Wrong Answer");
            }

            cleanup();
            return res.status(200).json({
                output: output.trim(),
                expectedOutput,
                isOutputCorrect,
                programOutputNormalized,
                expectedOutputNormalized
            });
        });
    };

    if (compileCommand) {
        exec(compileCommand, (compileErr, stdout, stderr) => {
            if (compileErr) {
                wrongSubmission(correctUN, name, "Compile Error");
                cleanup();
                return res.status(201).json({
                    error: 'Compilation failed',
                    details: stderr,
                    expectedOutput
                });
            }
            runProgram();
        });
    } else {
        runProgram();
    }
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

        user.submissions.push({ name: name, isCorrect: true, time: new Date(), verdict: "Accepted" });

        if (!user.solved.includes(name)) {
            user.solved.push(name);
        }

        await user.save();

        console.log(`Problem "${name}" marked as solved for user "${correctUN}".`);
    } catch (error) {
        console.error(`Error in markInDatabase: ${error.message}`);
        throw error;
    }
}

async function wrongSubmission(correctUN, name, verdict1) {
    const user = await peopleDB.findOne({ username: correctUN });

    if (!Array.isArray(user.submissions)) {
        user.submissions = [];
    }

    user.submissions.push({ name: name, isCorrect: false, time: new Date(), verdict: verdict1 });

    await user.save();
}

// Normalize output for comparison
const normalizeOutput = (output) =>
    output
        .trim()
        .split('\n')
        .map(line => line.trim().toLowerCase())
        .join('\n');

// Get file name and executable name based on language
const getFileInfo = (base, language) => {
    switch (language) {
        case 'cpp':
            return { file: `${base}.cpp`, exec: `${base}.out` };
        case 'java':
            return { file: `${base}.java`, exec: `Main.class` };
        case 'py3':
            return { file: `${base}.py`, exec: null };
        default:
            throw new Error('Unsupported language');
    }
};

// Compile command based on language
const getCompileCommand = (filePath, language) => {
    switch (language) {
        case 'cpp': return `g++ "${filePath}" -o "${filePath.replace('.cpp', '.out')}"`;
        case 'java': return `javac "${filePath}"`;
        case 'py3': return null;
    }
};

// Run command based on language
const getRunCommand = (filePath, language) => {
    switch (language) {
        case 'cpp': return `"${filePath.replace('.cpp', '.out')}"`;
        case 'java': return `java -cp "${path.dirname(filePath)}" Main`;
        case 'py3': return `python3 "${filePath}"`;
    }
};

// Execute (and optionally compile) the code
const executeCode = async (filePath, inputs, language) => {
    const compileCmd = getCompileCommand(filePath, language);

    return new Promise((resolve, reject) => {
        const runAfterCompile = () => {
            const runCmd = getRunCommand(filePath, language);
            const process = exec(runCmd, { timeout: 5000 });

            let output = '', error = '';

            process.stdin.write(inputs.trim() + '\n');
            process.stdin.end();

            process.stdout.on('data', data => output += data.toString());
            process.stderr.on('data', data => error += data.toString());

            process.on('close', code => {
                if (error && language === 'py3') {
                    return reject({ type: 'runtime', error });
                }

                if (code !== 0 && language !== 'py3') {
                    return reject({ type: 'runtime', error });
                }

                resolve(normalizeOutput(output));
            });
        };

        if (compileCmd) {
            exec(compileCmd, (err, stdout, stderr) => {
                if (err) {
                    return reject({ type: 'compile', error: stderr });
                }

                if (language === 'java') {
                    const compiledClassPath = path.join(path.dirname(filePath), 'Main.class');
                    if (!fs.existsSync(compiledClassPath)) {
                        return reject({ type: 'compile', error: 'Java compilation failed: Main.class not created' });
                    }
                }

                runAfterCompile();
            });
        } else {
            runAfterCompile();
        }
    });
};

// Delete files after code execution
const cleanupFiles = (fileInfo, language) => {
    try {
        const delay = process.platform === 'win32' ? 200 : 0;
        setTimeout(() => {
            try {
                fs.rmSync(fileInfo.file, { force: true });
                if (language === 'cpp') fs.rmSync(fileInfo.exec, { force: true });
                if (language === 'java') fs.rmSync(path.join(path.dirname(fileInfo.file), 'Main.class'), { force: true });
            } catch (err) {
                console.warn('Cleanup warning:', err.message);
            }
        }, delay);
    } catch (err) {
        console.warn('Initial cleanup scheduling failed:', err.message);
    }
};

// Handle code errors (compile/runtime)
const handleCodeError = (err, res) => {
    if (err.type === 'compile') return res.status(201).json({ error: 'Compilation failed', details: err.error });
    if (err.type === 'runtime') return res.status(202).json({ error: 'Execution failed', details: err.error });
    return res.status(500).json({ error: 'Unexpected error', err });
};

// Compare user output with correct output
exports.runUserInput = async (req, res) => {
    const { code, inputs, name: problemName, language } = req.body;

    try {
        if(!inputs) return res.status(400).json({ message: 'No input provided' });
        const problem = await problemDB.findOne({ name: problemName });
        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        const correctCode = problem.correctCode;
        const tempDir = path.join(__dirname, 'temp_run_input');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const id = uuidv4();
        const correctBase = path.join(tempDir, `correct_code_${id}`);
        const userBase = path.join(tempDir, `user_code_${id}`);
        const correctInfo = getFileInfo(correctBase, 'cpp');
        const userInfo = getFileInfo(userBase, language);

        fs.writeFileSync(correctInfo.file, correctCode);
        fs.writeFileSync(userInfo.file, code);

        let correctOutput, userOutput;

        try {
            correctOutput = await executeCode(correctInfo.file, inputs, 'cpp');
            userOutput = await executeCode(userInfo.file, inputs, language);
        } catch (err) {
            return handleCodeError(err, res);
        } finally {
            cleanupFiles(correctInfo, 'cpp');
            cleanupFiles(userInfo, language);
        }

        return res.status(200).json({
            isCorrect: correctOutput === userOutput,
            correctCodeOutput: correctOutput,
            userCodeOutput: userOutput
        });
    } catch (err) {
        console.error('Error in runUserInput:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
};

// Just run the user's code with custom input (for interview mode)
exports.runUserCode = async (req, res) => {
    const { code, customInput: inputs, language } = req.body;

    try {
        const tempDir = path.join(__dirname, 'temp_run_user');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const id = uuidv4();
        const base = path.join(tempDir, `interview_code_${id}`);
        const fileInfo = getFileInfo(base, language);

        fs.writeFileSync(fileInfo.file, code);

        let output;
        try {
            output = await executeCode(fileInfo.file, inputs, language);
        } catch (err) {
            return handleCodeError(err, res);
        } finally {
            cleanupFiles(fileInfo, language);
        }

        return res.status(200).json({ output });
    } catch (err) {
        console.error('Error in runUserCode:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
};