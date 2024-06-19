const moment = require('moment');
const { getRoomUsers } = require('./users');
const { CHATBOT_NAME } = require('./cincoBot/constants');


const chatbotCopy = {
  welcome: formatMessage(CHATBOT_NAME, 'Welcome to CincoChat!  Use <b>@computer</b> to chat with the CincoBot.'),
  newUserAdded: username => formatMessage(CHATBOT_NAME, `${username} has joined the chat`),
  leftChat: username => formatMessage(CHATBOT_NAME, `${username} has left the chat`)
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
  chatbotCopy,
  updateRoomState,
  formatMessage
};