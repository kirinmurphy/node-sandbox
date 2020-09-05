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
  return new Promise ((resolve, reject) => {
    connectToRoom(io, socket, user);
    socket.emit(SOCKET_EVENT_MESSAGE, copy.welcome);

    const results = collection.find({ room:user.room }).limit(100).sort({ _id:1 });
    results.toArray((err, res) => {
      if (err) reject(err);
      socket.emit('getHistory', res);
      resolve();
    });
  });
}

function sendMessage (io, socket, msg, collection) {
  return new Promise ((resolve, reject) => {
    const { username, room } = getCurrentUser(socket.id);
    const entry = { username, room, text:msg };
  
    collection.insertOne(entry, (err, data) => {
      if ( err ) reject(err);
      socket.emit('savedMessage', [data]);
      resolve();
    });  
  
    io.to(room).emit(SOCKET_EVENT_MESSAGE, formatMessage(username, msg));  
  });
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
function connectToRoom (io, socket, user) {
  const { username, room } = user;
  socket.join(room);
  socket.broadcast.to(room).emit(SOCKET_EVENT_MESSAGE, copy.newUserAdded(username)); 
  addToUsersCollection(socket.id, user);
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
