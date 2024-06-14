const socketio = require('socket.io');
const cron = require('node-cron');
const { databaseName, mongoClient } = require('../utils/mongoClient');

const { sendMessage } = require('./actions/sendMessage');
const { joinRoom, getHistory } = require('./actions/join');
const { leaveRoom } = require('./actions/leave');
const { initCicoBotInteractions } = require('./initCincoBotInteractions');

const MONGO_TABLE_CHATROOM = 'chatRoom';
const SOCKET_EVENT_JOIN_ROOM = 'joinRoom';
const SOCKET_EVENT_SEND_MESSAGE = 'sendMessage';

module.exports = function (server) {
  const io = socketio(server);

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

    socket.on(SOCKET_EVENT_SEND_MESSAGE, async (userMessage) => { 
      const messageConfig = { io, socket, collection };

      try {
        sendMessage({ ...messageConfig, message: userMessage });
        initCicoBotInteractions({ ...messageConfig, userMessage });
        // mongoClient.close();
      } catch (error) {
        // TODO - what user experience do we want here 
      }    
    });
    
    socket.on('disconnect', () => leaveRoom(io, socket.id));
      
    socket.on('clear', () => {
      collection.deleteMany({}, () => socket.emit('cleared'));
    });
  });   

  cron.schedule('0 0 23 * * *', async () => {
    await collection.deleteMany({});
    console.log('all chats deleted!');
  });
};
