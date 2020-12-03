export default function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.auth) {
    return { 'x-access-token': user.auth };
  } else {
    return {};
  }
}