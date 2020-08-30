const socketio = require('socket.io');

const {
  joinRoom,
  sendMessage,
  leaveRoom,
} = require('./actions');
  
module.exports = function (server) {
  const io = socketio(server);

  io.on('connection', (socket) => {
    socket.on('joinRoom', (user) => joinRoom(io, socket, user));
  
    socket.on('sendMessage', (msg) => sendMessage(io, socket.id, msg));
  
    socket.on('disconnect', () => leaveRoom(io, socket.id));
  });  
};
