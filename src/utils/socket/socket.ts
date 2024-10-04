import { io, Socket } from "socket.io-client";
import config from '../../config/config'

const socket: Socket = io();

export default socket;
