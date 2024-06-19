const { formatMessage } = require("../helpers");
const { getCurrentUser } = require("../users");
const { SOCKET_EVENT_MESSAGE } = require("./constants");

async function sendMessage(props) {
  const { io, socket, collection, message, usernameOverride } = props; 

  const { username, roomData: { name: roomName } } = getCurrentUser(socket.id);

  const senderUsername = usernameOverride || username;

  const document = { ...formatMessage(senderUsername, message), room: roomName };

  const { insertedId } = await collection.insertOne(document);

  // socket.emit('savedMessage', { status: 'saved', id: insertedId });

  io.to(roomName).emit(SOCKET_EVENT_MESSAGE, formatMessage(senderUsername, message));
};

module.exports = { sendMessage };
