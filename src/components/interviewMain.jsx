import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styled from 'styled-components';

function InterviewMain({ socket }) {
    const [role, setRole] = useState('Interviewer');
    const navigate = useNavigate();

    const handleDropdownChange = (event) => {
        setRole(event.target.value);
    };

    async function startInterview() {
        const name = document.getElementById('name').value;
        const interviewID = document.getElementById('interviewID').value;

        try {
            const response = await axios.post('http://localhost:5000/interview/startInterview', {
                name,
                interviewID,
                role,
            });

            if (response.status !== 201) {
                const interviewID = document.getElementById('interviewID').value
                // Join the room
                socket.emit('joinRoom', { interviewID });
                navigate('/room', { state: { interviewID, role: document.getElementById('dropd').value, name } });
            } else {
                document.getElementById('verdict').innerText = response.data;
                document.getElementById('verdict').style.color = 'red';
            }

            // return () => {
            //     newSocket.emit('leaveRoom', { interviewID });
            //     newSocket.disconnect();
            // };
        } catch (error) {
            console.error('Error starting the interview:', error);
        }
    }

    return (
        <Container>
            <Input placeholder="Your Name" id="name" />
            <Input placeholder="Interview ID" id="interviewID" />
            <Dropdown value={role} onChange={handleDropdownChange} id='dropd' >
                <option value="Interviewer">Login As Interviewer</option>
                <option value="Interviewee">Login As Interviewee</option>
            </Dropdown>
            <button onClick={() => startInterview()}>Submit</button>
            <div id="verdict"></div>
        </Container>
    );
}

export default InterviewMain;

const Container = styled.div`
    background-color: #141420;
    height: 90vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    #verdict {
        margin: 20px;
    }
`;

const Input = styled.input`
    background-color: #2a2a3a;
    border: none;
    border-radius: 8px;
    padding: 20px 15px;
    margin: 10px 0;
    color: white;
    font-size: 16px;
    outline: none;
    width: 500px;
    margin-bottom: 100px;

    ::placeholder {
        color: #888;
    }
`;

const Dropdown = styled.select`
    background-color: #1f1f2e;
    border: none;
    border-radius: 12px;
    padding: 20px 25px;
    margin: 20px 0;
    color: white;
    font-size: 20px;
    outline: none;
    width: 500px;
    appearance: none;

    option {
        background-color: #1f1f2e;
        color: white;
    }
`;