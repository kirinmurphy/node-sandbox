const formatMessage = require('./messages');

const { 
  getCurrentUser, 
  addToUsersCollection,
  removeFromUsersCollection, 
  getRoomUsers 
} = require('./users');

const MSG_BOT_NAME = 'CincoChat bot';
const SOCKET_EVENT_MESSAGE = 'message';

const copy = {
  welcome: formatMessage(MSG_BOT_NAME, 'Welcome to CincoChat!'),
  newUserAdded: username => formatMessage(MSG_BOT_NAME, `${username} has joined the chat`),
  leftChat: username => formatMessage(MSG_BOT_NAME, `${username} has left the chat`)
};

function joinRoom (io, socket, user, collection) {
  connectToRoom(io, socket, user);
  getPreviousEntries(socket, user, collection);
  addToUsersCollection(socket.id, user);
  socket.emit(SOCKET_EVENT_MESSAGE, copy.welcome);
}

function sendMessage (io, socket, msg, collection) {
  const { username, room } = getCurrentUser(socket.id);
  const entry = { username, room, text:msg };
  addNewEntry(socket, collection, entry);
  io.to(room).emit(SOCKET_EVENT_MESSAGE, formatMessage(username, msg));
}

function leaveRoom (io, socketId) {
  const user = getCurrentUser(socketId);
  if ( user ) {
    removeFromUsersCollection(user);
    io.to(user.room).emit(SOCKET_EVENT_MESSAGE, copy.leftChat(user.username));
    updateRoomState(io, user.room);
  }
}

// HELPERS
function getPreviousEntries (socket, { room }, collection) {
  const results = collection.find({ room:room }).limit(100).sort({ _id:1 });
  results.toArray((err, res) => {
    if (err) throw err;
    socket.emit('getHistory', res);
  });  
}

function addNewEntry (socket, collection, entry) {
  collection.insert(entry, (err, data) => {
    socket.emit('savedMessage', [data]);
  });  
}

function connectToRoom (io, socket, { username, room }) {
  socket.join(room);
  socket.broadcast.to(room).emit(SOCKET_EVENT_MESSAGE, copy.newUserAdded(username)); 
  updateRoomState(io, room);
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
