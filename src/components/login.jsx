import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config.js';

function Login({ setCorrectUN, setCorrectEmail }) {
    const [userName, setuserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false)
    const [loginSuccess, setLoginSuccess] = useState(false)
    const navigate = useNavigate();

    async function handleSignUp(e) {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/auth/signUp`, {
                userName,
                password,
                email
            });

            // console.log(response.data)

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            } else {
                console.error('No token received');
            }

            const responseDivSignup = document.getElementById('responseDivSignUp');

            if (response.data.message == 'please input userName') {
                responseDivSignup.innerText = 'Please input userName'
                return;
            }

            if (response.data.message == 'please input password') {
                responseDivSignup.innerText = 'Please input password'
                return;
            }

            if (response.data.message == 'please input email') {
                responseDivSignup.innerText = 'Please input email'
                return;
            }

            setCorrectUN(response.data.user.userName)
            setCorrectEmail(response.data.user.email)

            localStorage.setItem('user', JSON.stringify(response.data.user.userName))
            localStorage.setItem('email', JSON.stringify(response.data.user.email))

            if (response.request.status == 200) {
                setLoginSuccess(true)
                navigate('/main')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                userName,
                password
            });

            // console.log(response.data)

            const responseDivLogin = document.getElementById('responseDivLogin');

            if (response.data.message == 'please input userName') {
                responseDivLogin.innerText = 'Please input userName';
                console.log('Please input userName')
                return;
            }

            if (response.data.message == 'please input password') {
                responseDivLogin.innerText = 'Please input password';
                return;
            }

            if (response.data.message == 'Wrong Password') {
                responseDivLogin.innerText = 'Wrong Password';
                return;
            }

            if (response.data.message == 'User not found') {
                responseDivLogin.innerText = 'User not found'
                return;
            }

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            } else {
                console.error('No token received');
            }

            setCorrectUN(response.data.user.userName)
            setCorrectEmail(response.data.user.email)

            localStorage.setItem('user', JSON.stringify(response.data.user.userName))
            localStorage.setItem('email', JSON.stringify(response.data.user.email))

            if (response.request.status == 200) {
                setLoginSuccess(true)
                navigate('/main')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Container>
            {!login ? <div id='signUp'>
                <h1>Sign Up</h1>
                <div>
                    <input placeholder='userName' value={userName} onChange={(e) => setuserName(e.target.value)} id='input1' />
                    <input placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} id='input2' />
                    <input placeholder='Email-ID' value={email} onChange={(e) => setEmail(e.target.value)} id='input3' />
                </div>

                <button onClick={handleSignUp}>Submit</button>
                <button onClick={() => setLogin(true)}>Login if already have and account</button>
                <div id='responseDivSignUp'></div>
            </div> : ''}

            {login ? <div id='Login'>
                <h1>Login</h1>

                <div>
                    <input placeholder='UserName' value={userName} onChange={(e) => setuserName(e.target.value)} id='input4' />
                    <input placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} id='input5' />
                </div>

                <button onClick={handleLogin}>Submit</button>
                <button onClick={() => setLogin(false)}>SignUp for New User</button>
                <div id='responseDivLogin'></div>
            </div> : ''}
        </Container>
    )
}

export default Login

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('https://images.pexels.com/photos/714256/pexels-photo-714256.jpeg?cs=srgb&dl=pexels-denis-linine-214373-714256.jpg&fm=jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }

    #signUp, #Login {
        position: relative;
        z-index: 2;
        background: rgba(255, 255, 255, 0.85);
        padding: 50px;
        border-radius: 30px;
        box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 35vw;
        max-width: 400px;
        min-width: 300px;

        h1 {
            color: #2C3E50;
            margin-bottom: 25px;
            font-size: 2.2rem;
            text-align: center;
        }

        div {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;

            input {
                margin: 10px 0;
                height: 50px;
                border-radius: 30px;
                padding: 0 20px;
                border: 1px solid #ddd;
                width: 80%;
                font-size: 1rem;
                box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;

                &:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
                }
            }
        }

        button {
            border-radius: 30px;
            padding: 12px;
            margin: 15px 0;
            background-color: #3498db;
            color: white;
            border: none;
            width: 80%;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;

            &:hover {
                background-color: #2980b9;
                transform: scale(1.05);
            }
        }

        #responseDivSignUp, #responseDivLogin {
            margin-top: 10px;
            color: red;
            font-size: 0.9rem;
        }
    }
`;
