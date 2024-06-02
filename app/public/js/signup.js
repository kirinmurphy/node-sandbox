import { redirectAfterAuth } from './utils/redirectAfterAuth.js';

document.getElementById('signupButton').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/api/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response.json())
  .then(data => {
    redirectAfterAuth({ 
      succeeded: data.success, 
      errorMessage: 'Signup Failed' 
    });
  });
});
