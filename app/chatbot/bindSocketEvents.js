const { sendMessage } = require('./actions/sendMessage');
const { joinRoom, getHistory } = require('./actions/join');
const { leaveRoom } = require('./actions/leave');
const { initCicoBotInteractions } = require('./initCincoBotInteractions');
const { SOCKET_EVENT_JOIN_ROOM, SOCKET_EVENT_SEND_MESSAGE, SOCKET_EVENT_GET_HISTORY } = require('./actions/constants');

function bindSocketEvents(messageConfig) {
  const { io, socket, collection } = messageConfig;

  let roomData;
  
  socket.on(SOCKET_EVENT_JOIN_ROOM, async (user) => {
    try {
      roomData = user.roomData;
      const { name: roomName } = roomData;
      joinRoom({ io, socket, user });
      const results = await getHistory({ roomName, collection });
      socket.emit(SOCKET_EVENT_GET_HISTORY, results);
    } catch (error) {
      // TODO - what user experience do we want here 
    }
  });
  
  socket.on(SOCKET_EVENT_SEND_MESSAGE, async ({ userMessage }) => { 
    try {
      sendMessage({ ...messageConfig, message: userMessage });
      console.log('roomData', roomData);
      initCicoBotInteractions({ ...messageConfig, userMessage, roomData });
    } catch (error) {
      // TODO - what user experience do we want here 
    }    
  });
  
  socket.on('disconnect', () => { 
    leaveRoom(io, socket.id);
  });
    
  socket.on('clear', () => {
    collection.deleteMany({}, () => socket.emit('cleared'));
  });  
}


module.exports = { bindSocketEvents };
