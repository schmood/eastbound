/* api.js — thin client for the family-journal backend (/api).
   The shared family password rides along as a bearer token on every call. */
import { authToken } from "./session.js";

const BASE = "/api";

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

async function http(method, path, body) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + authToken()
      },
      body: body != null ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    // network down — surface a distinct offline error so callers can queue
    throw new ApiError("offline", 0);
  }
  if (!res.ok) throw new ApiError("http " + res.status, res.status);
  const ct = res.headers.get("content-type") || "";
  return ct.indexOf("application/json") >= 0 ? res.json() : null;
}

export const api = {
  // verify the family password without storing anything (login gate)
  async verify(password) {
    try {
      const res = await fetch(BASE + "/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      return res.ok;
    } catch (e) {
      return null; // null = couldn't reach server (distinct from false = wrong password)
    }
  },
  getNotes() { return http("GET", "/notes"); },
  addNote(note) { return http("POST", "/notes", note); },
  delNote(id) { return http("DELETE", "/notes/" + encodeURIComponent(id)); }
};
