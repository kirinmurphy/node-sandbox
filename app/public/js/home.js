// app/public/js/home.js
import { handleLogout } from './utils/handleLogout.js';

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/users/me', {
    method: 'GET'
  })
  .then(response => {
    if (response.status === 403) {
      window.location.href = '/';
    } else {
      return response.json();
    }
  })
  .then(data => {
    if (data) {
      const username = data.username;
      document.getElementById('username').textContent = username;
      document.getElementById('content').style.display = 'block';

      const event = new CustomEvent('user-data', { detail: { username } });
      document.dispatchEvent(event);
    }
  });

  document.getElementById('logoutButton').addEventListener('click', handleLogout);
});
