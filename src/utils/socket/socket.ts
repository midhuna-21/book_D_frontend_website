import { io, Socket } from "socket.io-client";

const socket: Socket = io('https://www.bookd.store');

export default socket;
