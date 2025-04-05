import { io } from "socket.io-client";

const BASE_URL = import.meta.env.PROD
    ? "https://online-judge-qhtp.onrender.com"
    : "http://localhost:5000";

const socket = io(BASE_URL, {
    transports: ['websocket'],
});

export default socket;