const CHATBOT_NAME = 'CincoBot';

export function getMessageTemplate({ message, currentUserName }) {
  const { username, time = '???', text } = message;
  const div = document.createElement('div');
  div.classList.add(`message`);

  const isFromCurrentUser = currentUserName === username;
  if ( isFromCurrentUser ) div.classList.add(`me`); 

  const isCincoBot = username === CHATBOT_NAME;
  if ( isCincoBot ) div.classList.add(`bot`);

  const isOtherUser = !(isFromCurrentUser || isCincoBot);
  const displayName = isOtherUser ? username : '';
  const displayNameHtml = isOtherUser ? `<div class="meta">${displayName}</div>` : '';
  div.innerHTML = `<div>${displayNameHtml}</div><div class="text">${text}</div>`;

  return div;
}
