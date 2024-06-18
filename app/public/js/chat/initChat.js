import { fetchRoomDetails } from './fetchRoomDetails.js';
import { getMessageTemplate } from './getMessageTemplate.js';

export async function initChat({ currentUserName, roomId }) {
  const socket = io();

  const elements = {
    chatForm: document.getElementById('chat-form'),
    chatScrollWrapper: document.querySelector('.chat-scroll-wrapper'),
    roomName: document.getElementById('room-name'),
    userList: document.getElementById('users'),
    chatCurrent: document.querySelector('.chat-current'),
    chatHistory: document.querySelector('.chat-history')
  };

  try {
    const roomData = await fetchRoomDetails(roomId);
    const roomName = roomData.name;
    elements.roomName.innerText = roomName;

    // bindSocketEvents()
    // Join room with room name
    socket.emit('joinRoom', { username: currentUserName, roomData });

    socket.on('roomUsers', ({ room, users }) => {
      outputRoomName({ elements, room });
      outputUsers({ elements, users });
    });

    socket.on('getHistory', messages => {
      messages.forEach(message => { 
        const container = elements.chatHistory;
        outputMessage({ container, message, currentUserName });
      });
      
      // TODO: end loading if need loading indicator
      scrollToEndOfChat({ elements });
    });

    socket.on('message', message => {
      const container = elements.chatCurrent;
      outputMessage({ container, message, currentUserName });
      scrollToEndOfChat({ elements });
    });

    // socket.on('savedMessage', message => {
    //   console.log('messageSaved', message);
    // });

    elements.chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const userMessage = event.target.elements.msg.value;
      socket.emit('sendMessage', { userMessage });
      event.target.elements.msg.value = '';
      event.target.elements.msg.focus();
    });
  } catch (err) {
    console.error('Initialization failed:', err);
  }
}

// HELPERS
function outputMessage ({ container, message, currentUserName }) {
  const messagesHtml = getMessageTemplate({ message, currentUserName });
  container.appendChild(messagesHtml);
}

function outputRoomName({ elements, room }) {
  elements.roomName.innerText = room;
}

function outputUsers({ elements, users }) {
  elements.userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

function scrollToEndOfChat({ elements }) {
  elements.chatScrollWrapper.scrollTop = elements.chatScrollWrapper.scrollHeight;
}
