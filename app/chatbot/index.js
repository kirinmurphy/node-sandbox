const socketio = require('socket.io');
const cron = require('node-cron');
const { databaseName, mongoClient } = require('../utils/mongoClient');

const { sendMessage } = require('./actions/sendMessage');
const { joinRoom, getHistory } = require('./actions/join');
const { leaveRoom } = require('./actions/leave');

const { initCicoBotInteractions } = require('./initCincoBotInteractions');
const serverEvents = require('./mentionedEntities/serverEvents');
const { initializeServerEvents, getThings, saveThings } = serverEvents;

const MONGO_TABLE_CHATROOM = 'chatRoom';
const SOCKET_EVENT_JOIN_ROOM = 'joinRoom';
const SOCKET_EVENT_SEND_MESSAGE = 'sendMessage';
const SOCKET_EVENT_GET_HISTORY = 'getHistory';

module.exports = function (server, app) {
  const io = socketio(server);

  console.log('Mongo connected...');

  const db = mongoClient.db(databaseName);

  const chatCollection = db.collection(MONGO_TABLE_CHATROOM);

  initializeServerEvents({ app });

  io.on('connection', (socket) => {
    socket.on(SOCKET_EVENT_JOIN_ROOM, async (user) => {
      try {
        joinRoom(io, socket, user);
        const results = await getHistory(user, chatCollection);
        socket.emit(SOCKET_EVENT_GET_HISTORY, results);

        const things = await getThings();
        console.log('things', things);
        socket.emit('initial_things', things);        
      } catch (error) {
        // TODO - what user experience do we want here 
      }
    });

    socket.on(SOCKET_EVENT_SEND_MESSAGE, async (userMessage) => { 
      const messageConfig = { io, socket, collection: chatCollection };

      try {
        sendMessage({ ...messageConfig, message: userMessage });
        initCicoBotInteractions({ ...messageConfig, userMessage, saveThings });
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
    await chatCollection.deleteMany({});
    console.log('all chats deleted!');
  });
};
