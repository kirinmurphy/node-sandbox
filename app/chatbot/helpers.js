const moment = require('moment');

const { getRoomUsers } = require('./users');

const SOCKET_EVENT_MESSAGE = 'message';
const MSG_BOT_NAME = 'CincoChat bot';

const chatbotCopy = {
  welcome: formatMessage(MSG_BOT_NAME, 'Welcome to CincoChat!'),
  newUserAdded: username => formatMessage(MSG_BOT_NAME, `${username} has joined the chat`),
  leftChat: username => formatMessage(MSG_BOT_NAME, `${username} has left the chat`)
};

async function updateRoomState (io, room) {
  const users = await getRoomUsers(room);
  const roomState = { room, users };
  io.to(room).emit('roomUsers', roomState);
}

function formatMessage (username, text) {
  return {
    username, 
    text, 
    time: moment().format('h:mm a')
  }
}

module.exports = {
  SOCKET_EVENT_MESSAGE,
  chatbotCopy,
  updateRoomState,
  formatMessage
};