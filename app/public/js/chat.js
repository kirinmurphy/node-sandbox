(function () {
  const elements = {
    chatForm: document.getElementById('chat-form'),
    chatMessages: document.querySelector('.chat-messages'),
    roomName: document.getElementById('room-name'),
    userList: document.getElementById('users'),
    chatCurrent: document.querySelector('.chat-current'),
    chatHistory: document.querySelector('.chat-history')
  };
  
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  
  const socket = io();
  
  socket.emit('joinRoom', { username, room });
  
  socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
  
  socket.on('getHistory', messages => {
    messages.forEach(message => outputMessage(elements.chatHistory, message));
    scrollToEndOfChat();
  });
  
  socket.on('message', message => {
    outputMessage(elements.chatCurrent, message);
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
  
  
  // HELPERS
  function outputMessage (container, message) {
    const messagesHtml = getMessageTemplate(message);
    container.appendChild(messagesHtml);
  }
  
  function getMessageTemplate ({ username, time = '???', text }) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
      <p class="meta">${username} <span>${time}</span></p>
      <p class="text">${text}</p>
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
  
  function scrollToEndOfChat () {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }  
})();
