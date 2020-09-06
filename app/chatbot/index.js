const socketio = require('socket.io');

const { 
  databaseName,
  mongoClient
 } = require('../utils/mongoClient');

const { sendMessage } = require('./action-sendMessage');
const { joinRoom, getHistory } = require('./action-join');
const { leaveRoom } = require('./action-leave');

const MONGO_TABLE_CHATROOM = 'chatRoom';
const SOCKET_EVENT_JOIN_ROOM = 'joinRoom';
const SOCKET_EVENT_SEND_MESSAGE = 'sendMessage';

module.exports = function (server) {
  const io = socketio(server);

  mongoClient.connect(err => {
    // TODO - wire this error into a socket emitter?
    if ( err ) { throw err; }
    console.log('Mongo connected...');
  
    const collection = mongoClient.db(databaseName).collection(MONGO_TABLE_CHATROOM);
  
    io.on('connection', (socket) => {
      socket.on(SOCKET_EVENT_JOIN_ROOM, async (user) => {
        try {
          joinRoom(io, socket, user);
          const results = await getHistory(user, collection);
          socket.emit('getHistory', results);
          // mongoClient.close();  
        } catch (error) {
          // TODO - what user experience do we want here 
        }
      });
    
      socket.on(SOCKET_EVENT_SEND_MESSAGE, async (msg) => { 
        try {
          sendMessage(io, socket, msg, collection);
          // mongoClient.close();
        } catch (error) {
          // TODO - what user experience do we want here 
        }
      });
    
      socket.on('disconnect', () => leaveRoom(io, socket.id));
  
      socket.on('clear', (data) => {
        collection.remove({}, () => socket.emit('cleared'));
      });
    });    
  });
};
