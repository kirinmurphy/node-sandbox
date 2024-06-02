export function redirectAfterAuth({ succeeded, errorMessage }) {
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get('redirect') || '/';

  if (succeeded) {
    window.location.href = redirectUrl || '/home';
  } else {
    alert(errorMessage);
  }
}
