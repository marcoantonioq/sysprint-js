const { io } = require('socket.io-client');

const socket = io('http://localhost:3010');

socket.on('msg', function (message) {
  console.log(message);
});
