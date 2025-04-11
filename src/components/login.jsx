import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
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
                userName, password, email
            });
            const token = response.data.token;
            if (token) localStorage.setItem('token', token);
            const responseDivSignup = document.getElementById('responseDivSignUp');
            if (response.data.message == 'please input userName') return responseDivSignup.innerText = 'Please input userName'
            if (response.data.message == 'please input password') return responseDivSignup.innerText = 'Please input password'
            if (response.data.message == 'please input email') return responseDivSignup.innerText = 'Please input email'
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
                userName, password
            });
            const responseDivLogin = document.getElementById('responseDivLogin');
            if (response.data.message == 'please input userName') return responseDivLogin.innerText = 'Please input userName'
            if (response.data.message == 'please input password') return responseDivLogin.innerText = 'Please input password'
            if (response.data.message == 'Wrong Password') return responseDivLogin.innerText = 'Wrong Password'
            if (response.data.message == 'User not found') return responseDivLogin.innerText = 'User not found'
            const token = response.data.token;
            if (token) localStorage.setItem('token', token);
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
        <Page>
            <GlowBox>
                <Form>
                    <h2>{login ? 'Login' : 'Sign Up'}</h2>
                    <InputBox>
                        <input
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                        />
                        <span>Username</span>
                        <i></i>
                    </InputBox>

                    {!login && (
                        <InputBox>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span>Email</span>
                            <i></i>
                        </InputBox>
                    )}

                    <InputBox>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span>Password</span>
                        <i></i>
                    </InputBox>

                    <div className="links">
                        {login ? (
                            <>
                                <a href="#">Forgot password?</a>
                                <a href="#" onClick={() => setLogin(false)}>Sign Up</a>
                            </>
                        ) : (
                            <a href="#" onClick={() => setLogin(true)}>Already have an account? Login</a>
                        )}
                    </div>

                    <input
                        type="submit"
                        value={login ? "Login" : "Sign Up"}
                        onClick={login ? handleLogin : handleSignUp}
                    />

                    {login ? (
                        <div id="responseDivLogin" style={{ marginTop: '10px', color: 'red' }}></div>
                    ) : (
                        <div id="responseDivSignUp" style={{ marginTop: '10px', color: 'red' }}></div>
                    )}
                </Form>
            </GlowBox>
        </Page>
    )
}

export default Login

const animate = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Page = styled.div`
    height: 100vh;
    width: 100vw;
    background: #23242a;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const GlowBox = styled.div`
    position: relative;
    width: 380px;
    height: 520px;
    border-radius: 8px;
    background: #1c1c1c;
    overflow: hidden;

    &::before, &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 380px;
        height: 520px;
        background: linear-gradient(0deg, transparent, #45f4ff, #45f4ff);
        transform-origin: bottom right;
        animation: ${animate} 6s linear infinite;
    }

    &::after {
        animation-delay: -3s;
    }
`;

const Form = styled.div`
    position: absolute;
    inset: 2px;
    border-radius: 8px;
    background: #28292d;
    z-index: 10;
    padding: 50px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        color: #45f3ff;
        font-weight: 500;
        text-align: center;
        letter-spacing: 0.1em;
    }

    .links {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 0.75em;
        margin-top: 40px;
        margin-left: 10px;

        a {
            color: #8f8f8f;
            text-decoration: none;

            &:hover {
                color: #45f3ff;
            }
        }
    }

    input[type='submit'] {
        border: none;
        outline: none;
        background: #45f3ff;
        padding: 11px 25px;
        width: 100%;
        margin-top: 20px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;

        &:active {
            opacity: 0.8;
        }
    }
`;

const InputBox = styled.div`
    position: relative;
    width: 300px;
    margin-top: 35px;

    input {
        position: relative;
        width: 100%;
        padding: 10px 9px 10px;
        background: transparent;
        border: none;
        outline: none;
        color: #000000;
        font-size: 1em;
        letter-spacing: 0.05em;
        z-index: 10;
    }

    span {
        position: absolute;
        left: 0;
        padding: 10px 10px 10px;
        font-size: 1em;
        color: #8f8f8f;
        pointer-events: none;
        letter-spacing: 0.05em;
        transition: 0.5s;
    }

    input:valid ~ span,
    input:focus ~ span {
        color: #45f3ff;
        transform: translateX(0px) translateY(-34px);
        font-size: 0.75em;
    }

    i {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: #45f3ff;
        border-radius: 4px;
        transition: 0.5s;
        pointer-events: none;
        z-index: 9;
    }

    input:valid ~ i,
    input:focus ~ i {
        height: 44px;
    }
`;