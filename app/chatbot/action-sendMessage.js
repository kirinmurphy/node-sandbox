const { getCurrentUser } = require('./users');

const { 
  SOCKET_EVENT_MESSAGE, 
  formatMessage 
} = require('./helpers');

async function sendMessage (io, socket, text, collection) {
  const { username, room } = getCurrentUser(socket.id);

  const document = { ...formatMessage(username, text), room };

  const { insertedId } = await collection.insertOne(document);

  socket.emit('savedMessage', { status: 'saved', id: insertedId });

  io.to(room).emit(SOCKET_EVENT_MESSAGE, formatMessage(username, text));  
};

module.exports = { 
  sendMessage
};
