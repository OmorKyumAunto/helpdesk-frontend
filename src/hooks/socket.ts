import { io } from "socket.io-client";
import { socket_url } from "../app/slice/baseQuery";

export const socket = io(socket_url, { autoConnect: false });
