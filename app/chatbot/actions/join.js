const {
  SOCKET_EVENT_MESSAGE,
  chatbotCopy,
  updateRoomState
} = require('../helpers');

const { 
  addToUsersCollection
} = require('../users');

function joinRoom (io, socket, user) {
  const { username, room } = user;

  socket.join(room);

  socket.broadcast.to(room).emit(SOCKET_EVENT_MESSAGE, chatbotCopy.newUserAdded(username)); 

  addToUsersCollection(socket.id, user);

  updateRoomState(io, room);

  socket.emit(SOCKET_EVENT_MESSAGE, chatbotCopy.welcome);
}

async function getHistory (user, collection) {
  const results = await collection.find({ room:user.room }).limit(100).sort({ _id:1 });
  return await results.toArray();
};

module.exports = {
  getHistory,
  joinRoom
};
