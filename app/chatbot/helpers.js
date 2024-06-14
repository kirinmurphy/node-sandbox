const moment = require('moment');

const { getRoomUsers } = require('./users');

const SOCKET_EVENT_MESSAGE = 'message';
const MSG_BOT_NAME = 'CincoBot';

const chatbotCopy = {
  welcome: formatMessage(MSG_BOT_NAME, 'Welcome to CincoChat! <br/> Start your message with <b>@computer</b> to chat with the bot.'),
  newUserAdded: username => formatMessage(MSG_BOT_NAME, `${username} has joined the chat`),
  leftChat: username => formatMessage(MSG_BOT_NAME, `${username} has left the chat`)
};

function updateRoomState (io, room) {
  const roomState = { room, users: getRoomUsers(room) };
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