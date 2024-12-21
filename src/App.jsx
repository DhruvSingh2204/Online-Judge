import { useEffect, useState } from 'react'
import Login from './components/login'
import Main from './components/main';
import Header from './components/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Problems from './components/problems';
import ImgSlider from './components/imgSlider';
import Solve from './components/solve';
import './App.css'
import Profile from './components/profile'
import InterviewMain from './components/interviewMain'
import InterviewRoom from './components/interviewRoom'
import { io } from 'socket.io-client';
// const newSocket = io('http://localhost:5000');

function App() {
  const [correctUN, setCorrectUN] = useState('');
  const [correctEmail, setCorrectEmail] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Get the userName from localStorage
    const storedEmail = JSON.parse(localStorage.getItem('email')); // Get the email from localStorage

    if (storedUser) {
      setCorrectUN(storedUser); // Since storedUser is just the username string
    }

    if (storedEmail) {
      setCorrectEmail(storedEmail); // Since storedEmail is just the email string
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login setCorrectUN={setCorrectUN} setCorrectEmail={setCorrectEmail} />} />
          <Route
            path="/main"
            element={<><Header /><Main correctUN={correctUN} /></>} />
          <Route
            path="/problems"
            // element={<><Header /><Problems correctUN={correctUN} /></>} />
            element={<><Header /><ImgSlider /><Problems correctUN={correctUN} /></>} />
          <Route
            path="/solve"
            element={<><Solve correctUN={correctUN} /></>} />
          <Route
            path="/profile"
            element={<><Header /><Profile correctUN={correctUN} /></>} />
          <Route
            path="/interview"
            element={<><Header /><InterviewMain /></>} />
          <Route
            path="/room"
            element={<><InterviewRoom /></>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
