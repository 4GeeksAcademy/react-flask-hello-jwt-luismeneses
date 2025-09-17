import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

/**
 * Guarda el token JWT en sessionStorage
 */
export function setToken(token) {
  if (typeof token === "string") {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    console.warn("Intento de guardar un token inválido:", token);
  }
}

/**
 * Recupera el token JWT desde sessionStorage
 */
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Elimina el token JWT del sessionStorage
 */
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Verifica si el usuario está autenticado y el token no ha expirado
 */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    const now = Date.now() / 1000;
    return exp > now;
  } catch {
    return false;
  }
}

/**
 * Extrae los datos del usuario desde el token JWT
 */
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token); // Devuelve { sub, email, exp }
  } catch {
    return null;
  }
}