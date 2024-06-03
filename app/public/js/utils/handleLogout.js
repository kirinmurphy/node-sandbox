export function handleLogout() {
  fetch('/api/users/logout', {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = '/';
    } else {
      alert('Logout failed.');
    }
  });
}
