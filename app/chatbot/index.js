const socketio = require('socket.io');
const cron = require('node-cron');

const { 
  databaseName,
  mongoClient
 } = require('../utils/mongoClient');

const { sendMessage } = require('./action-sendMessage');
const { joinRoom, getHistory } = require('./action-join');
const { leaveRoom } = require('./action-leave');
const { initCincoBotResponse } = require('./getCincoBotResponse');

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

    socket.on(SOCKET_EVENT_SEND_MESSAGE, async (rawMsg) => { 
      const messageConfig = { io, socket, collection };
      const isAiPrompt = rawMsg && rawMsg.startsWith('@computer');

      try {
        sendMessage({ ...messageConfig, message: rawMsg });

        if ( isAiPrompt ) {
          await initCincoBotResponse({ ...messageConfig, message: rawMsg });
        }
        // mongoClient.close();
      } catch (error) {
        // TODO - what user experience do we want here 
      }    
    });
    
    socket.on('disconnect', () => leaveRoom(io, socket.id));
      
    socket.on('clear', (data) => {
      collection.deleteMany({}, () => socket.emit('cleared'));
    });
  });   

  cron.schedule('0 0 23 * * *', async () => {
    await collection.deleteMany({});
    console.log('all chats deleted!');
  });
};

