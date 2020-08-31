const formatMessage = require('./messages');

const { 
  getCurrentUser, 
  addToUsersCollection,
  removeFromUsersCollection, 
  getRoomUsers 
} = require('./users');

const MSG_BOT_NAME = 'Chatcorn bot';
const SOCKET_EVENT_MESSAGE = 'message';

function joinRoom (io, socket, user) {
  const { username, room } = user;
  const welcomeText = 'Welcome to Chatcord!'; 
  const welcomeMessage = formatMessage(MSG_BOT_NAME, welcomeText);
  const joinedText = `${username} has joined the chat`;
  const joinedMessage = formatMessage(MSG_BOT_NAME, joinedText);

  addToUsersCollection(socket.id, user);
  socket.join(room);
  socket.emit(SOCKET_EVENT_MESSAGE, welcomeMessage);
  socket.broadcast.to(room).emit(SOCKET_EVENT_MESSAGE, joinedMessage); 
  updateRoomState(io, room);    
}

function sendMessage (io, socketId, msg) {
  const { username, room } = getCurrentUser(socketId);
  const userMessage = formatMessage(username, msg);
  io.to(room).emit(SOCKET_EVENT_MESSAGE, userMessage);
}

function leaveRoom (io, socketId) {
  const user = getCurrentUser(socketId);
  if ( user ) {
    removeFromUsersCollection(user);
    const leavingMsg = `${user.username} has left the chat`;
    const message = formatMessage(MSG_BOT_NAME, leavingMsg);
    io.to(user.room).emit(SOCKET_EVENT_MESSAGE, message);
    updateRoomState(io, user.room);
  }
}

function updateRoomState (io, room) {
  const roomState = { room, users: getRoomUsers(room) };
  io.to(room).emit('roomUsers', roomState);
}

module.exports = {
  joinRoom,
  sendMessage,
  leaveRoom,
  updateRoomState
};
