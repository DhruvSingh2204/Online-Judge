import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BASE_URL from '../config.js';

function Problems({ correctUN }) {
    const [problems, setProblems] = useState([]);
    const [solved, setSolved] = useState(new Set());
    const navigate = useNavigate();

    async function fetchProblems() {
        try {
            // console.log('Fetching problems for user:', correctUN);
            const response = await axios.post(`${BASE_URL}/problems/showProblems`, {});
            setProblems(response.data.allProblems || []);

            const response2 = await axios.post(`${BASE_URL}/problems/solved`, { correctUN });
            // console.log('Solved problems data:', response2.data);

            if (Array.isArray(response2.data)) {
                // console.log('set solved')
                setSolved(new Set(response2.data));
            } else {
                console.error('Unexpected response format: solved problems is not an array.', response2.data);
                setSolved(new Set());
            }
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    }

    useEffect(() => {
        if (correctUN) {
            fetchProblems();
        }
    }, [correctUN]);

    const handleRowClick = (problem) => {
        navigate('/solve', { state: { problem } });
    };

    return (
        <Container>
            <h1 id="heading">Problems</h1>
            <div id="problems">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Topic Tags</th>
                            <th>Solved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem, index) => (
                            <tr
                                key={index}
                                onClick={() => handleRowClick(problem)}
                                className="clickable-row"
                            >
                                <td>{index + 1}</td>
                                <td>{problem.name}</td>
                                <td>{problem.topicTags.join(', ')}</td>
                                {/* Check solved status using Set */}
                                <td>{solved.has(problem.name) ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
}

export default Problems;

const Container = styled.div`
    background-color: #141420;
    height: 90vh;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;

    #heading {
        margin-top: 50px;
    }

    #problems {
        /* border: 2px solid white; */
        width: 70vw;
        margin-top: 100px;
        margin-bottom: 50px;
        background-color: #1e1e2e;
        padding: 20px;

        table {
            width: 100%;
            border-collapse: collapse;
            color: white;

            th, td {
                border: 1px solid white;
                padding: 10px;
                text-align: left;
            }

            th {
                background-color: #27273f;
            }

            tr:nth-child(even) {
                background-color: #2e2e4f;
            }

            tr.clickable-row {
                cursor: pointer;
                background-color: #2e2e4f;
                transition: background-color 0.2s;
            }

            tr.clickable-row:hover {
                background-color: #404062;
            }
        }
    }
`;
