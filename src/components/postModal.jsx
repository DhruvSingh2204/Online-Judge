import React from 'react';
import styled from 'styled-components';
import { RxCross1 } from "react-icons/rx";
import axios from 'axios';
import BASE_URL from '../config.js';

function PostModal({ correctUN , setModalopen , setShowpost }) {
    async function post() {
        const topic = document.getElementById('topic').value;
        const content = document.getElementById('content').value;
        
        try {
            if (!correctUN) {
                alert("Please log in to post");
            }
            if (!topic) {
                alert("Please write topic name");
            }
            const response = await axios.post(`${BASE_URL}/postRoute/post` , {
                correctUN , topic , content
            });

            // console.log(response);

            document.getElementById('topic').value = "";
            document.getElementById('content').value = "";

            setShowpost(1);
            setModalopen(0);
        } catch {
            console.log('Error in posting')
        }
    }

    return (
        <Container>
            <div className="modal-content">
                <button className="close-button" onClick={() => setModalopen(false)}><RxCross1 /></button>
                <h2>Create Your Post</h2>

                <input className="input-field" id='topic' placeholder='Post Topic'/><br />
                <input className="input-field" id='content' placeholder='Content'/>

                <button className="send-button" onClick={() => post()}><h1>Send</h1></button>
            </div>
        </Container>
    );
}

export default PostModal;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        width: 50vw;
        max-width: 500px;
        text-align: center;
        color: #141420;
        position: relative;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #141420;
    }

    .input-field {
        width: 90%;
        margin: 10px 0;
        padding: 10px;
        font-size: 1.2rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        outline: none;
    }

    .input-field:focus {
        border-color: #007BFF;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .send-button {
        width: 90%;
        margin: 20px 0;
        padding: 10px;
        background-color: #007BFF;
        color: white;
        font-size: 1.2rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .send-button:hover {
        background-color: #0056b3;
    }

    .send-button h1 {
        margin: 0;
        font-size: 1.2rem;
    }
`;