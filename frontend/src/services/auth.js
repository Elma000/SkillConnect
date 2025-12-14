export function setAuth({ token, userId }) {
  localStorage.setItem("token", token);
  if (userId) localStorage.setItem("userId", userId);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

export function isLoggedIn() {
  return !!getToken();
}
