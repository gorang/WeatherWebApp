const TOKEN_KEY = "weather_token";

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isTokenExpired(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1];
    const payloadJson = JSON.parse(atob(payloadPart));
    const exp = payloadJson?.exp; // seconds since epoch
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true; // if token is malformed, treat as expired
  }
}

export function isLoggedIn(): boolean {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    clearToken();
    return false;
  }
  return true;
}
