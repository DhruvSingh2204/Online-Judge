import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import socket from '../socket'
import { SwipeableDrawer, TextField, Button } from '@mui/material';

function InterviewRoom() {
    const location = useLocation();
    const { role, interviewID, name } = location.state || {};
    const navigate = useNavigate();
    const [chat, setChat] = useState([]);
    const code1 = `
#include<bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here....
    return 0;
}
`;
    const [code, setCode] = useState(code1);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [customInput, setCustomInput] = useState('');

    const handleChange = (e) => {
        const code2 = e.target.value;
        setCode(code2);
        // console.log('Emitting addToCode:', { interviewID, code2 });
        socket.emit('addToCode', { interviewID, code2 });
    };

    async function leave() {
        console.log(role, interviewID)
        const response = await axios.post('http://localhost:5000/interview/leaveInterview', {
            role, interviewID
        });

        // console.log(response)
        // if(socket) {
        //     socket.emit('disconnect' , {});
        // }
        navigate('/interview');
    }

    async function sendmsg() {
        const msg = document.getElementById('chatarea').value;
        if (msg == '') return;

        document.getElementById('chatarea').value = '';

        const response = await axios.post('http://localhost:5000/interview/sendmsg', {
            role, interviewID, msg
        });

        // console.log(response);
        if (socket) {
            socket.emit('sendMessage', { interviewID, msg, role });
        }
    }

    async function loadChat() {
        const response = await axios.post('http://localhost:5000/interview/loadChat', {
            role, interviewID
        });

        // console.log(response.data)

        setChat(response.data);
    }

    async function runCode() {
        console.log(customInput);
        const response = await axios.post('http://localhost:5000/run/runUserCode' , {
            code ,
            customInput
        });
        console.log(response);
    }

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const handleCustomInputChange = (e) => {
        setCustomInput(e.target.value);
    };

    useEffect(() => {
        if (role && interviewID) {
            socket.emit('joinRoom', { interviewID });
            loadChat();
        }
    
        socket.on('receiveMessage', ({ message, sender }) => {
            loadChat();
        });
    
        socket.on('addToYourCode', ({ code }) => {
            console.log('Received addToYourCode:', code);
            setCode(code);
        });
    
        return () => {
            if (socket) {
                socket.off('receiveMessage');
                socket.off('addToYourCode');
            }
        };
    }, [role, interviewID]); 

    return (
        <Container>
            <div id='header'>
                <h1>Welcome {role} {name} </h1>
                <button id='leaveInterviewBtn' onClick={() => leave()}>Leave Interview</button>
            </div>
            <div id='main'>
                <div id='chat'>
                    <div id='chats'>
                        {chat.map((item, index) => (
                            <div id='onechat' key={index} className={item.sender === role ? 'own-message' : 'other-message'}>
                                <strong>{item.sender == role ? 'You' : item.sender}:</strong> {item.message}
                                <small>{new Date(item.dt).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                    <div id='container'>
                        <textarea id='chatarea' />
                        <button id='send' onClick={() => sendmsg()}><IoSend /></button>
                    </div>
                </div>
                <div id='codearea'>
                    <h1>Code Area</h1>
                    <textarea value={code} onChange={handleChange} />
                    <div id='runsubmitbtn'>
                        <button onClick={() => runCode()}>Run</button>
                        <button onClick={toggleDrawer(true)}>Custom Input</button>
                    </div>
                </div>
            </div>
            <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <div style={{ padding: '20px', width: '250px' }}>
                    <h2>Enter Custom Input</h2>
                    <TextField
                        label="Custom Input"
                        multiline
                        fullWidth
                        rows={4}
                        value={customInput}
                        onChange={handleCustomInputChange}
                        variant="outlined"
                    />
                    <div style={{ marginTop: '10px' }}>
                    </div>
                </div>
            </SwipeableDrawer>
        </Container>
    );
}

export default InterviewRoom;

const Container = styled.div`
    background-color: #1e1e2f;
    height: 100vh;
    color: #f0f0f0;

    #header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 10vh;
    }

    #leaveInterviewBtn {
        padding: 10px 20px;
        border-radius: 20px;
        background-color: #e63946;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;

        &:hover {
            background-color: #ff4d6d;
        }
    }

    #main {
        height: calc(100vh - 80px);
        width: 100vw;
        display: flex;
    }

    #codearea {
        height: 100%;
        width: 60%;
        background-color: #2b2b3d;
        padding: 20px;
        box-sizing: border-box;
    }

    #chat {
        border-right: 1px solid #444;
        height: 100%;
        width: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #20202f;
        padding: 20px;
        box-sizing: border-box;
    }

    #send {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: #66bb6a;
        }
    }

    #chats {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        background-color: #3c3c4e;
        border-radius: 10px;
        padding: 10px;
        overflow-y: auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    #container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
        width: 100%;
    }

    #chatarea {
        flex-grow: 1;
        height: 60px;
        border-radius: 5px;
        padding: 10px;
        border: 1px solid #444;
        background-color: #2b2b3d;
        color: #f0f0f0;
        resize: none;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

        &::placeholder {
            color: #aaa;
        }
    }

    #codearea textarea {
        width: 95%;
        height: calc(100% - 100px);
        border: 1px solid #444;
        border-radius: 5px;
        background-color: #1e1e2f;
        color: #f0f0f0;
        padding: 10px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        resize: none;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        outline: none;
        overflow-y: auto;
        line-height: 1.5;

        &::placeholder {
            color: #aaa;
        }

        &:focus {
            border-color: #4caf50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
        }
    }

    #runsubmitbtn {
        display: flex;
        width: 95%;
        justify-content: space-around;
        align-items: center;
    }

    #runsubmitbtn button {
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        color: white;
        background-color: #4caf50;
        transition: all 0.3s ease;

        &:hover {
            background-color: #66bb6a;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        &:active {
            transform: scale(0.95);
        }

        &.run {
            background-color: #007bff;
        }

        &.submit {
            background-color: #e63946;
        }

        &.run:hover {
            background-color: #339cff;
        }

        &.submit:hover {
            background-color: #ff4d6d;
        }
    }

    #onechat {
        padding: 10px;
        margin: 5px 0;
        border-radius: 10px;
        background-color: #3c3c4e;
        color: #f0f0f0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 80%;
        word-wrap: break-word;
    }

    .own-message {
        align-self: flex-end;
        background-color: #4caf50;
        color: white;
    }

    .other-message {
        align-self: flex-start;
        background-color: #20202f;
    }

    #onechat strong {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
    }

    #onechat small {
        margin-top: 5px;
        font-size: 0.8rem;
        color: white;
        align-self: flex-end;
    }

    .own-message {
        align-self: flex-end;
        background-color: #12aa17 !important;
        color: white;
    }

    .other-message {
        align-self: flex-start;
        background-color: #20202f;
    }
`;