const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatCurrent = document.querySelector('.chat-current');
const chatHistory = document.querySelector('.chat-history');

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
  console.log('messages', messages);
  messages.map(message => outputMessage(chatHistory, message));
});

socket.on('message', message => {
  outputMessage(chatCurrent, message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('savedMessage', message => {
  console.log('messageSaved', message);
});

chatForm.addEventListener('submit', (event) => {
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
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
