const { sendMessage } = require('./actions/sendMessage');
const { joinRoom, getHistory } = require('./actions/join');
const { leaveRoom } = require('./actions/leave');
const { initCicoBotInteractions } = require('./initCincoBotInteractions');
const { saveThings } = require('./mentionedEntities/serverEvents');

const { SOCKET_EVENT_JOIN_ROOM, SOCKET_EVENT_SEND_MESSAGE, SOCKET_EVENT_GET_HISTORY } = require('./actions/constants');

function bindSocketEvents({ io, socket, collection }) {
  let roomData;

  socket.on(SOCKET_EVENT_JOIN_ROOM, async (user) => {
    try {
      roomData = user.roomData;
      const { name } = roomData;
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
}

module.exports = { bindSocketEvents };