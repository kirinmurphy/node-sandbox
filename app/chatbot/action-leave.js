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
  try {
    const user = await getCurrentUser(socketId);
    await removeFromUsersCollection(user);
    io.to(user.room).emit(SOCKET_EVENT_MESSAGE, chatbotCopy.leftChat(user.username));
    updateRoomState(io, user.room);  
  } catch (err) {
    console.log('error leaving room...');
  }
};

module.exports = { 
  leaveRoom 
};
