const socketio = require('socket.io');
const { schedule } = require('node-cron');
const { initMentionedEntitiesEvent } = require('./mentionedEntities/serverEvent');
const { MONGO_TABLE_CHATROOM, MONGO_TABLE_MENTIONED_ENTITIES } = require('./constants');
const { bindSocketEvents } = require('./bindSocketEvents');
const { getMongoTable } = require('./utils/getMongoTable');

module.exports = function (server, app) {
  const io = socketio(server);
  console.log('Mongo connected...');
  const chatRoomTable = getMongoTable(MONGO_TABLE_CHATROOM);

  initMentionedEntitiesEvent({ app });

  io.on('connection', (socket) => {
    bindSocketEvents({ io, socket, collection: chatRoomTable });
  });   

  schedule('0 0 23 * * *', async () => {
    const mentionedEntitiesTable = getMongoTable(MONGO_TABLE_MENTIONED_ENTITIES);
    await mentionedEntitiesTable.deleteMany({});
    await chatRoomTable.deleteMany({});
    console.log('all chats deleted!');
  });
};
