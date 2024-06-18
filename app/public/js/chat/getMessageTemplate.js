export function getMessageTemplate({ message, currentUserName }) {
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