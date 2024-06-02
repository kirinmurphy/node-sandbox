// app/public/js/login.js
import { redirectAfterAuth } from './utils/redirectAfterAuth.js';

document.getElementById('loginButton').addEventListener('click', () => {
  const emailOrUsername = document.getElementById('emailOrUsername').value;
  const password = document.getElementById('password').value;

  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ emailOrUsername, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      redirectAfterAuth({ 
        succeeded: data.success, 
        errorMessage: 'Login Failed' 
      });
      } else {
      alert('Login failed.');
    }
  });
});

