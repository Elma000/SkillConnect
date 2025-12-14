import { getToken } from "./auth";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = options.headers || {};
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch (e) {
    body = text;
  }
  if (!res.ok) {
    const err = new Error(body || res.statusText);
    err.status = res.status;
    throw err;
  }
  return body;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
