const socketio = require('socket.io');
const cron = require('node-cron');
const { databaseName, mongoClient } = require('../utils/mongoClient');

const { sendMessage } = require('./actions/sendMessage');
const { joinRoom, getHistory } = require('./actions/join');
const { leaveRoom } = require('./actions/leave');

const { initCicoBotInteractions } = require('./initCincoBotInteractions');
const serverEvents = require('./mentionedEntities/serverEvents');
const { SOCKET_EVENT_JOIN_ROOM, SOCKET_EVENT_SEND_MESSAGE, SOCKET_EVENT_GET_HISTORY } = require('./actions/constants');
const { MONGO_TABLE_CHATROOM, MONGO_TABLE_MENTIONED_ENTITIES } = require('./constants');
const { initializeServerEvents, saveThings } = serverEvents;


module.exports = function (server, app) {
  const io = socketio(server);

  console.log('Mongo connected...');

  const db = mongoClient.db(databaseName);

  const chatRoomTable = db.collection(MONGO_TABLE_CHATROOM);

  initializeServerEvents({ app });

  let roomData;

  io.on('connection', (socket) => {
    socket.on(SOCKET_EVENT_JOIN_ROOM, async (user) => {
      try {
        roomData = user.roomData;
        const { name } = roomData;
        console.log('roomData', roomData);
        joinRoom({ io, socket, user });
        const results = await getHistory({ roomName: name, collection: chatRoomTable });
        socket.emit(SOCKET_EVENT_GET_HISTORY, results);
      } catch (error) {
        // TODO - what user experience do we want here 
      }
    });

    socket.on(SOCKET_EVENT_SEND_MESSAGE, async ({ userMessage }) => { 
      try {
        const messageConfig = { io, socket, collection: chatRoomTable };
        sendMessage({ ...messageConfig, message: userMessage });
        initCicoBotInteractions({ ...messageConfig, userMessage, saveThings, roomData });
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
    await chatRoomTable.deleteMany({});
    await db.collection(MONGO_TABLE_MENTIONED_ENTITIES).deleteMany({});
    console.log('all chats deleted!');
  });
};
