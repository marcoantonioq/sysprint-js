import { io } from 'socket.io-client';

const socket = io('http://localhost:3010');

export default function (context, inject) {
  inject('socket', socket);
}
