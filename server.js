const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const connectDB = require('./config/dbConn');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

connectDB();
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/auth', require('./routes/auth'));
app.use('/postRoute', require('./routes/postRoute'));
app.use('/problems', require('./routes/problems'));
app.use('/run', require('./routes/run'));
app.use('/interview', require('./routes/interview'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', ({ interviewID }) => {
        console.log(`User ${socket.id} joined room: ${interviewID}`);
        socket.join(interviewID);

        // const socketsInRoom = io.sockets.adapter.rooms.get(interviewID) || [];
        // console.log(`Sockets in room ${interviewID}:`, Array.from(socketsInRoom));

        socket.to(interviewID).emit('userJoined', { message: 'A new user has joined the interview room!' });
    });

    socket.on('sendMessage', ({ interviewID, message, sender }) => {
        console.log(`Message from ${sender} in room ${interviewID}: ${message}`);
        io.to(interviewID).emit('receiveMessage', { sender, message });
    });

    socket.on('addToCode', (data) => {
        console.log('data ->', data);
        const { interviewID, code2 } = data;
        if (!interviewID || !code2) {
            console.log('Invalid data received:', interviewID, code2);
            return;
        }
        console.log(`Received addToCode from ${socket.id} for room ${interviewID}:`, code2);
        io.to(interviewID).emit('addToYourCode', { code: code2 });
    });    

    socket.on('leaveRoom', ({ interviewID }) => {
        console.log(`User ${socket.id} left room: ${interviewID}`);
        socket.leave(interviewID);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));