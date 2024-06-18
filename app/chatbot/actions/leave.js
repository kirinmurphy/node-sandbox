const {
  SOCKET_EVENT_MESSAGE,
  chatbotCopy,
  updateRoomState
} = require('../helpers');

const { 
  getCurrentUser, 
  removeFromUsersCollection
} = require('../users');

function leaveRoom (io, socketId) {
  const user = getCurrentUser(socketId);
  if ( user ) {
    removeFromUsersCollection(user);
    io.to(user.room).emit(SOCKET_EVENT_MESSAGE, chatbotCopy.leftChat(user.username));
    updateRoomState(io, user.roomData.name);
  }
};

module.exports = { 
  leaveRoom 
};
