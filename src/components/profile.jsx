import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BASE_URL from '../config.js';

function Profile({ correctUN }) {
    const [email, setEmail] = useState('');
    const [solvedn, setSolvedn] = useState('');
    const [qsSolved, setQsSolved] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    async function fetchUserData() {
        try {
            const response = await axios.post(`${BASE_URL}/auth/fetchUserData`, { correctUN });
            console.log(response.data[0]);

            setEmail(response.data[0].email);
            setSolvedn(response.data[0].solved.length);
            setQsSolved(response.data[0].solved);
            setSubmissions(response.data[0].submissions.reverse());
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    useEffect(() => {
        if (correctUN) {
            fetchUserData();
        }
    }, [correctUN]);

    return (
        <Container>
            <ProfileImage
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="Profile"
                height="100px"
            />
            <UserInfo>
                <p>Email: {email}</p>
                <p>Questions Solved: {solvedn}</p>
            </UserInfo>
            <SolvedQuestions>
                <h3>Solved Questions:</h3>
                <table>
                    <tbody>
                        {qsSolved.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </SolvedQuestions>

            <Submissions>
                <h3>Submissions</h3>
                <table>
                    <tbody>
                        {submissions.reverse().map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.isCorrect ? 'Correct' : 'Incorrect'}</td>
                                <td>{new Date(item.time).toLocaleString()}</td>
                                <td>{item.verdict}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Submissions>
        </Container>
    );
}

export default Profile;

const Container = styled.div`
    background-color: #141420;
    color: white;
    padding: 20px;
    height: auto;
    min-height: 90vh;
`;

const ProfileImage = styled.img`
    border: 2px solid white;
    border-radius: 50%;
    padding: 5px;
`;

const UserInfo = styled.div`
    margin-top: 10px;
    p {
        margin: 5px 0;
    }
`;

const SolvedQuestions = styled.div`
    margin-top: 20px;
    h3 {
        margin-bottom: 10px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    td {
        padding: 8px;
        border: 1px solid white;
    }
`;

const Submissions = styled.div`
    margin-top: 20px;
    h3 {
        margin-bottom: 10px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    td {
        padding: 8px;
        border: 1px solid white;
    }
    tr:nth-child(even) {
        background-color: #333;
    }
    tr:nth-child(odd) {
        background-color: #222;
    }
    th {
        background-color: #444;
        padding: 10px;
        text-align: left;
    }
    td {
        padding: 10px;
        text-align: left;
    }
    overflow-y: auto;
    max-height: 60vh;
`;