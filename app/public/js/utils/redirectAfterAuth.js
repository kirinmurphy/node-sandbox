export function redirectAfterAuth({ succeeded, errorMessage }) {
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirect") || "/";

  if (succeeded) {
    window.location.href = redirectUrl || "/home";
  } else {
    console.log("you might want to come take a look at this");
    alert("errrrrr" + errorMessage);
  }
}
