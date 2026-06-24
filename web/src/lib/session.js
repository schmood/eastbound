/* session.js — the on-device session: { password, userId }.
   The family password doubles as the API bearer token (one shared secret, set
   server-side as FAMILY_PASSWORD). userId is which of the four you tapped. */
const KEY = "eb-auth";

export function loadSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
}
export function saveSession(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
}
export function clearSession() {
  try { localStorage.removeItem(KEY); } catch (e) {}
}
export function authToken() {
  var s = loadSession();
  return (s && s.password) || "";
}
