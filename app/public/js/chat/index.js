import { buildMentionedEntitiesList } from './buildMentionedEntitiesList.js';
import { initChat } from './initChat.js';

(function () {
  const params = Qs.parse(location.search, { ignoreQueryPrefix: true });
  const { username: currentUserName, room: roomId } = params;  

  document.addEventListener('DOMContentLoaded', function() {
    buildMentionedEntitiesList({ roomId });
  });

  initChat({ currentUserName, roomId });

  document.addEventListener('user-data', (event) => {
    const username = event.detail.username;
    if ( username ) {
      document.getElementById('leave-room').setAttribute('href', '/home');
    }
  });
})();
