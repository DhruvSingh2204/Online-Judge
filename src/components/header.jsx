import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

function header({ setCorrectUN, setCorrectEmail }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    setCorrectUN('');
    setCorrectEmail('');
    navigate('/')
  }

  return (
    <Container>
      <div id='top'>
        <a href='#'><h1>Online Judge</h1></a>
        <div id='features'>
          <NavMenu>
            <a href="/main">
              <span>Discuss</span>
            </a>
            <a href="/problems">
              <span>Problems</span>
            </a>

            <a href="/profile">
              <span>My Profile</span>
            </a>

            <a href="/interview">
              <span>Interviews</span>
            </a>
          </NavMenu>
        </div>
        <button id='b1' onClick={() => handleLogout()}><h2>LogOut</h2></button>
      </div>
    </Container>
  )
}

export default header

const Container = styled.div`
    height: 10vh;
    width: 100%;
    background-color: #141420;
    color: white;
    overflow-x: hidden;

    #top {
        width: 100vw;
        height: 9vh;
        border-bottom: 2px solid white;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        a {
            text-decoration: none;
            color: white;
            
        }
    }

    #b1 {
      background-color: #ff4d4d;
      border: none;
      border-radius: 5px;
      color: white;
      padding: 5px 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #cc0000;
      }

      h2 {
        margin: 0;
      }
    }
`

const NavMenu = styled.div`
  height: 70px;
  display: flex;
  flex: 1;
  align-items: center;
  padding: 0 36px;
  color: white;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    padding: 0 15px;

    img {
      height: 20px;
    }
    span {
      letter-spacing: 1.42px;
      font-size: 15px;
      position: relative;

      &:after {
        content: "";
        height: 2px;
        background: white;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -8px;
        transform: scale(0);
      }
    }

    &:hover {
      span:after {
        transform: scale(1);
        transition: 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    }
  }
`;