const { formatMessage, SOCKET_EVENT_MESSAGE } = require("./helpers");
const { getCurrentUser } = require("./users");

async function sendMessage(props) {
  const { io, socket, message, collection, usernameOverride } = props;

  const { username, room } = getCurrentUser(socket.id);

  const senderUsername = usernameOverride || username;

  const document = { ...formatMessage(senderUsername, message), room };

  const { insertedId } = await collection.insertOne(document);

  socket.emit('savedMessage', { status: 'saved', id: insertedId });

  io.to(room).emit(SOCKET_EVENT_MESSAGE, formatMessage(senderUsername, message));
};

module.exports = { sendMessage };
