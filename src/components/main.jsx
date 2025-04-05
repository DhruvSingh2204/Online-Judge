import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PostModal from './postModal';
import axios from 'axios';
import BASE_URL from '../config.js';

function main({ correctUN }) {
    const [modalopen , setModalopen] = useState(0);
    const [showpost , setShowpost] = useState(1);

    useEffect(() => {
        async function showPosts() {
            try {
                const response = await axios.post(`${BASE_URL}/postRoute/showPosts`, {});
                // console.log(response.data);
                document.getElementById('posts').innerHTML = ""

                for(let i = response.data.message.length - 1;i>=0;i--) {
                    const div1 = document.createElement('div');
                    div1.innerHTML = `
                        <div class="post-sender">Shared By : ${response.data.message[i].sender} <a id='datetime'>${response.data.message[i].datetime}</a></div>
                        <div class="post-description">${response.data.message[i].description}</div>
                        <div class="post-content">${response.data.message[i].content}</div>
                    `;

                    document.getElementById('posts').appendChild(div1);
                }
            } catch (error) {
                console.log('Error in fetching all posts:', error);
            }
        }

        if (showpost) {
            setShowpost(0);
            showPosts();
        }
    }, [showpost]);

    return (
        <Container>
            <button id='makepost' onClick={() => setModalopen(true)}>
                Create Post
            </button>

            <h1 id='headingPost'>Posts</h1>

            <div id='posts'>
                
            </div>

            {modalopen ? <PostModal correctUN={correctUN} setModalopen={setModalopen} setShowpost={setShowpost} /> : ""}
        </Container>
    )
}

export default main

const Container = styled.div`
    height: 90vh;
    /* height: auto; */
    width: 100vw;
    background-color: #141420;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;

    #posts {
        height: 60vh;
        width: 70vw;
        border: 2px solid white;
        margin-top: 5vh;
        overflow-x: hidden;
        padding: 10px;
        background-color: #1e1e2e;
        border-radius: 8px;
        color: #f0f0f0;
        font-family: Arial, sans-serif;
        font-size: 0.9rem;
        line-height: 1.5;

        div {
            margin-bottom: 15px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #2e2e3e;
            color: #d1d1d1;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            position: relative;
        }

        .post-sender {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 1rem;
        }

        .post-description {
            margin-bottom: 8px;
        }

        .post-content {
            margin-bottom: 10px;
        }

        #datetime {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 0.8rem;
            color: #aaa;
        }

        div:last-child {
            margin-bottom: 0;
        }
    }

    #makepost {
        margin-top: 8vh;
        height: 5vh;
        width: 15vw;
        border: 2px solid white;
        border-radius: 50px;
        cursor: pointer;
    }

    #headingPost {
        margin-top: 20px;
    }
`;