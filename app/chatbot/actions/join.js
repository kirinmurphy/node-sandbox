const {
  SOCKET_EVENT_MESSAGE,
  chatbotCopy,
  updateRoomState
} = require('../helpers');

const { 
  addToUsersCollection
} = require('../users');

function joinRoom ({ io, socket, user }) {
  const { username, roomData } = user;
  const { name: roomName } = roomData;
  socket.join(roomName);

  socket.broadcast.to(roomName).emit(SOCKET_EVENT_MESSAGE, chatbotCopy.newUserAdded(username)); 

  addToUsersCollection(socket.id, user);

  updateRoomState(io, roomName);

  socket.emit(SOCKET_EVENT_MESSAGE, chatbotCopy.welcome);
}

async function getHistory ({ roomName, collection }) {
  const results = await collection.find({ room: roomName }).limit(100).sort({ _id:1 });
  return await results.toArray();
};

module.exports = {
  getHistory,
  joinRoom
};
