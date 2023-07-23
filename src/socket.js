import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_BASE_URL);
const room1Socket = io(`${import.meta.env.VITE_SERVER_BASE_URL}/room1`);
const room2Socket = io(`${import.meta.env.VITE_SERVER_BASE_URL}/room2`);

function emit(socket, event, arg) {
    socket.timeout(2000).emit(event, arg, (err) => {
        if (err) {
            // no ack from the server, let's retry
            emit(socket, event, arg);
        }
    });
}

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

export {
    emit,
    room1Socket,
    room2Socket
};

export default socket;