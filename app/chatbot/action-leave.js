const {
  SOCKET_EVENT_MESSAGE,
  chatbotCopy,
  updateRoomState
} = require('./helpers');

const { 
  getCurrentUser, 
  removeFromUsersCollection
} = require('./users');

async function leaveRoom (io, socketId) {
  const user = await getCurrentUser(socketId);
  if ( user ) {
    removeFromUsersCollection(user);
    io.to(user.room).emit(SOCKET_EVENT_MESSAGE, chatbotCopy.leftChat(user.username));
    updateRoomState(io, user.room);
  }
};

module.exports = { 
  leaveRoom 
};
