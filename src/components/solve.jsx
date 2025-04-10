import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { SwipeableDrawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BASE_URL from '../config.js';
import Editor from '@monaco-editor/react';

function Solve({ correctUN }) {
    const location = useLocation();
    const { problem } = location.state || {};

    const code1 = `#include<bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here....
    return 0;
}`;

    const code2 = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here....
    }
}`;

    const code3 = `# Write your code here....

def main():
    pass

if __name__ == "__main__":
    main()`;

    const [code, setCode] = useState(code1);
    const [output, setOutput] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [isOutputSheetOpen, setOutputSheetOpen] = useState(false);
    const [isInputSheetOpen, setInputSheetOpen] = useState(false);
    const [iscorrect, setIscorrect] = useState(0);
    const [exampleInput, setExampleInput] = useState('');
    const [language , setLanguage] = useState('cpp');

    const handleChange = (e) => {
        setCode(e.target.value);
    };

    const handleInputChange = (e) => {
        setExampleInput(e.target.value);
        // console.log(exampleInput);
    };

    async function run() {
        try {
            document.getElementById('submitBtn').innerHTML = `<img src="https://media.tenor.com/-n8JvVIqBXkAAAAM/dddd.gif" style="height: 12px;" />`;
            const response = await axios.post(`${BASE_URL}/run/runCode`, {
                code: code,
                inputs: problem.inputs,
                output: problem.outputs,
                correctUN,
                name: problem.name,
                lang : language
            });

            console.log(response);

            if (response.status === 201) {
                document.getElementById('ans').innerText = "Compile Error";
                document.getElementById('ans').style.color = 'red';
                setOutput(response.data.details)
                setExpectedOutput(response.data.expectedOutput || 'No expected output available');
            } else if (response.status === 202) {
                document.getElementById('ans').innerText = "Runtime Error";
                document.getElementById('ans').style.color = 'red';
            } else {
                document.getElementById('ans').innerText = response.data.isOutputCorrect ? "All Test Cases Passed!!" : "Wrong Ans";
                setOutput(response.data.output || 'No output received');
                setExpectedOutput(response.data.expectedOutput || 'No expected output available');
                if (response.data.isOutputCorrect) {
                    document.getElementById('ans').style.color = '#46ef46';
                } else {
                    document.getElementById('ans').style.color = 'red';
                }
            }
            setOutputSheetOpen(true);
            document.getElementById('submitBtn').innerText = 'Submit';
        } catch (error) {
            console.error(error);
            setOutput('Error while running the code.');
            setExpectedOutput('');
            setOutputSheetOpen(true);
            document.getElementById('submitBtn').innerText = 'Submit';
        }
    }

    async function runUserInput() {
        try {
            document.getElementById('runBtn').innerHTML = `<img src="https://media.tenor.com/-n8JvVIqBXkAAAAM/dddd.gif" style="height: 12px;" />`;
            const response = await axios.post(`${BASE_URL}/run/runUserInput`, {
                code: code,
                inputs: exampleInput,
                name: problem.name,
                language : language
            });
            // console.log(response)

            if (response.status === 201) {
                document.getElementById('ans').innerText = "Compile Error";
                document.getElementById('ans').style.color = 'red';
                setOutput(response.data.details)
                setExpectedOutput(response.data.correctOutput)
            } else if (response.status === 202) {
                document.getElementById('ans').innerText = "Runtime Error";
                document.getElementById('ans').style.color = 'red';
                setExpectedOutput(response.data.correctCodeOutput)
                setOutput("")
            } else {
                document.getElementById('ans').innerText = response.data.isCorrect ? "Correct Answer" : "Wrong Ans";
                setExpectedOutput(response.data.correctCodeOutput)
                setOutput(response.data.userCodeOutput)
            }

            if (response.data.isCorrect) {
                document.getElementById('ans').style.color = '#46ef46';
            } else {
                document.getElementById('ans').style.color = 'red';
            }

            setOutputSheetOpen(true);
            document.getElementById('runBtn').innerText = 'Run';
        } catch (error) {
            console.error(error);
            setOutput('Error while running the code.');
            setExpectedOutput('');
            setOutputSheetOpen(true);
            document.getElementById('runBtn').innerText = 'Run';
        }
    }

    return (
        <Container>
            <QuestionSection>
                {problem ? (
                    <div>
                        <h1>{problem.name}</h1>
                        <p>{problem.description}</p>
                        {problem.input && (
                            <div>
                                <h2>Input:</h2>
                                <p>{problem.input}</p>
                            </div>
                        )}

                        {problem.output && (
                            <div>
                                <h2>Output:</h2>
                                <p>{problem.output}</p>
                            </div>
                        )}
                        {problem.exampleTc && problem.exampleTc.length > 0 && (
                            <div>
                                <h3>Example Test Cases</h3>
                                <ul>
                                    {problem.exampleTc.map((testCase, index) => (
                                        <li key={index}>
                                            <strong>Test Case {index + 1}:</strong> {testCase}
                                            {problem.tcAns && problem.tcAns[index] && (
                                                <div>
                                                    <strong>Answer:</strong> {problem.tcAns[index]}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <p><h2>Constraints:</h2> {problem.constraints}</p>
                        <p><h2>Topic Tags:</h2> {problem.topicTags.join(', ')}</p>
                    </div>
                ) : (
                    <p>No problem data available. Please navigate from the Problems page.</p>
                )}
            </QuestionSection>
            <CodingSection>
                <h2>Coding Area</h2>
                <select
                    onChange={(e) => {
                        const selectedLanguage = e.target.value;
                        setLanguage(selectedLanguage);
                        if (selectedLanguage === 'cpp') {
                            setCode(code1);
                        } else if (selectedLanguage === 'java') {
                            setCode(code2);
                        } else if (selectedLanguage === 'py3') {
                            setCode(code3);
                        }
                    }}
                    style={{
                        marginBottom: '10px',
                        padding: '5px',
                        borderRadius: '5px',
                        backgroundColor: '#2d2d2d',
                        color: 'white',
                        border: '1px solid white',
                    }}
                >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="py3">Python 3</option>
                </select>
                <Editor
                    height="90%"
                    defaultLanguage="cpp"
                    value={code}
                    onChange={(value) => setCode(value)}
                    theme="vs-dark"
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                    }}
                />

                <div id="run">
                    <button onClick={() => runUserInput()} id='runBtn'>Run</button>
                    <button onClick={() => run()} id='submitBtn' >Submit</button>
                    {/* Button to open the right swipeable drawer for input */}
                    <button onClick={() => setInputSheetOpen(true)} style={{ marginLeft: '10px' }}>
                        Custom Input
                    </button>
                </div>
            </CodingSection>

            <SwipeableDrawer
                anchor="bottom"
                open={isOutputSheetOpen}
                onClose={() => setOutputSheetOpen(false)}
                onOpen={() => setOutputSheetOpen(true)}
                PaperProps={{
                    style: {
                        width: '45%',
                        marginLeft: '10px',
                        borderRadius: '10px',
                        marginBottom: '10px',
                    },
                }}
            >
                <Box
                    sx={{
                        padding: 2,
                        backgroundColor: '#1e1e2e',
                        color: 'white',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <IconButton
                        onClick={() => setOutputSheetOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'white',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        Output
                    </Typography>
                    <pre
                        style={{
                            background: '#2d2d2d',
                            padding: '10px',
                            borderRadius: '5px',
                            color: '#5cfa5c',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflow: 'auto',
                        }}
                    >
                        {output}
                    </pre>
                    <Typography variant="h6" gutterBottom>
                        Expected Output
                    </Typography>
                    <pre
                        style={{
                            background: '#2d2d2d',
                            padding: '10px',
                            borderRadius: '5px',
                            color: '#ffa500',
                            marginBottom: '20px',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflow: 'auto',
                        }}
                    >
                        {expectedOutput}
                    </pre>
                    <Typography variant="h6" gutterBottom>
                        Verdict
                    </Typography>
                    <pre
                        id="ans"
                        style={{
                            background: '#2d2d2d',
                            padding: '10px',
                            borderRadius: '5px',
                            color: '#ffa500',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflow: 'auto',
                        }}
                    >
                        {iscorrect ? 'Correct Output' : 'Incorrect Output'}
                    </pre>
                </Box>
            </SwipeableDrawer>

            <SwipeableDrawer
                anchor="bottom"
                open={isInputSheetOpen}
                onClose={() => setInputSheetOpen(false)}
                onOpen={() => setInputSheetOpen(true)}
                PaperProps={{
                    style: { width: '45%', marginLeft: '10px', borderRadius: '10px', marginBottom: '10px' },
                }}
            >
                <Box
                    sx={{
                        padding: 2,
                        backgroundColor: '#1e1e2e',
                        color: 'white',
                        height: '50vh',
                        overflowY: 'auto',
                    }}
                >
                    <IconButton
                        onClick={() => setInputSheetOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'white',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        Input Example
                    </Typography>
                    <textarea
                        placeholder="Enter your input for the code"
                        value={exampleInput}
                        onChange={handleInputChange}
                        style={{ width: '95%', height: '80px', backgroundColor: '#2d2d2d', color: 'white', border: '1px solid white', borderRadius: '5px', padding: '10px' }}
                    />
                </Box>
            </SwipeableDrawer>
        </Container>
    );
}

export default Solve;

const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #141420;
    color: white;
`;

const QuestionSection = styled.div`
    width: 45%;
    padding: 20px;
    overflow-y: auto;
    border-right: 2px solid white;

    h2 {
        margin-bottom: 10px;
    }

    h3 {
        margin-top: 20px;
    }

    p, ul {
        margin-bottom: 15px;
        line-height: 1.5;
    }

    ul {
        list-style-type: none;
        padding: 0;

        li {
            background-color: #1e1e2e;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;

            div {
                margin-top: 10px;
                background-color: #2d2d2d;
                padding: 8px;
                border-radius: 5px;
                color: #5cfa5c;
            }
        }
    }
`;

const CodingSection = styled.div`
    width: 50%;
    padding: 20px;
    display: flex;
    flex-direction: column;

    h2 {
        margin-bottom: 10px;
    }

    textarea {
        flex: 1;
        width: 97.3%;
        height: 100%;
        background-color: #1e1e2e;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        font-size: 16px;
        resize: none;
        border: 1px solid white;
    }

    #run {
        display: flex;
        align-items: center;
        justify-content: space-around;

        button {
            background-color: green;
            padding: 10px;
            margin: 5px;
            border-radius: 15px;
            width: 100%;
        }
    }
`;