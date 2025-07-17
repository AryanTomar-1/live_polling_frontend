import { io } from 'socket.io-client';

const socket = io('https://live-polling-backend-1-rxnh.onrender.com/'); // use your backend URL in production
export default socket;
