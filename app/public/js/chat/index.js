import { fetchRoomDetails } from './fetchRoomDetails.js';

(function () {
  const elements = {
    chatForm: document.getElementById('chat-form'),
    chatScrollWrapper: document.querySelector('.chat-scroll-wrapper'),
    roomName: document.getElementById('room-name'),
    userList: document.getElementById('users'),
    chatCurrent: document.querySelector('.chat-current'),
    chatHistory: document.querySelector('.chat-history')
  };

  const params = Qs.parse(location.search, { ignoreQueryPrefix: true });
  const { username: currentUserName, room: roomId } = params;  

  const socket = io();

  document.addEventListener('user-data', (event) => {
    const username = event.detail.username;
    if ( username ) {
      document.getElementById('leave-room').setAttribute('href', '/home');
    }
  });

  initChat({ currentUserName, roomId });

  async function initChat({ currentUserName, roomId }) {
    try {

      const roomData = await fetchRoomDetails(roomId);
      const roomName = roomData.name;
      elements.roomName.innerText = roomName;

      // Join room with room name
      socket.emit('joinRoom', { username: currentUserName, room: roomName });

      socket.on('roomUsers', ({ room, users }) => {
        outputRoomName(room);
        outputUsers(users);
      });

      socket.on('getHistory', messages => {
        messages.forEach(message => { 
          const container = elements.chatHistory;
          outputMessage({ container, message, currentUserName });
        });
        
        // TODO: end loading if need loading indicator
        scrollToEndOfChat();
      });

      socket.on('message', message => {
        const container = elements.chatCurrent;
        outputMessage({ container, message, currentUserName });
        scrollToEndOfChat();
      });

      socket.on('savedMessage', message => {
        console.log('messageSaved', message);
      });

      elements.chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const msg = event.target.elements.msg.value;
        socket.emit('sendMessage', msg);
        event.target.elements.msg.value = '';
        event.target.elements.msg.focus();
      });
    } catch (err) {
      console.error('Initialization failed:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    
    const updatesDiv = document.getElementById('mentioned-entities');
    const eventSource = new EventSource('/events');
    console.log('YOOOOOOOOOO');
    // eventSource.addEventListener('message', event => {
    eventSource.onmessage = function(event) {

      const data = JSON.parse(event.data);
      console.log('DATAAA', data);
      data.forEach(({ entity, fact }) => {
        const div = document.createElement('div');
        div.classList.add('mentioned-entity');
        const template = `<strong>${entity}</strong> ${fact}`;
        div.innerHTML = template;
        updatesDiv.insertBefore(div, updatesDiv.firstChild);
      });
    }
  
    eventSource.onerror = function(err) {
      console.error('EventSource failed:', err);
    };
  });

  // HELPERS
  function outputMessage ({ container, message, currentUserName }) {
    const messagesHtml = getMessageTemplate({ message, currentUserName });
    container.appendChild(messagesHtml);
  }

  function getMessageTemplate({ message, currentUserName }) {
    const { username, time = '???', text } = message;
    const isFromCurrentUser = currentUserName === username;
    const div = document.createElement('div');
    div.classList.add(`message`);
    if ( isFromCurrentUser ) div.classList.add(`me`); 

    div.innerHTML = `
      <div class="meta">${username} <span>${time}</span></div>
      <div class="text">${text}</div>
    `;
    return div;
  }

  function outputRoomName(room) {
    elements.roomName.innerText = room;
  }

  function outputUsers(users) {
    elements.userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
  }

  function scrollToEndOfChat() {
    elements.chatScrollWrapper.scrollTop = elements.chatScrollWrapper.scrollHeight;
  }
})();
