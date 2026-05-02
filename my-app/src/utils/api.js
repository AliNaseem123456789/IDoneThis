// src/utils/api.js
// export const API_BASE = "https://idonethis.onrender.com/"; // your backend
export const API_BASE = "http://localhost:5000";

export async function apiRequest(endpoint, method = "GET", body = null, token) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
