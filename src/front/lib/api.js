import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "api";

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
}

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.msg || "Error en la solicitud";
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API error on ${method} ${path}:`, err);
    throw err;
  }
}

async function signup(email, password) {
  return request("/signup", {
    method: "POST",
    body: { email, password },
  });
}

async function token(email, password) {
  return request("/token", {
    method: "POST",
    body: { email, password },
  });
}

async function verify() {
  return request("/verify", {
    method: "GET",
    auth: true,
  });
}

async function privateRequest() {
  return request("/private", {
    method: "GET",
    auth: true,
  });
}

export const api = {
  signup,
  token,
  verify,
  private: privateRequest,
};