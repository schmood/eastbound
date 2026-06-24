/* push.js — client side of the self-hosted daily-fact Web Push.
   Subscribes the device with the server's VAPID key and registers the
   PushSubscription with the backend. The service worker (public/sw.js) shows
   the notification when the server pushes it. */
import { api } from "./api.js";

export function pushSupported() {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator &&
    typeof window !== "undefined" && "PushManager" in window && "Notification" in window;
}

// iOS only delivers Web Push to PWAs installed to the Home Screen (standalone)
export function isStandalone() {
  return (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;
}
export function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }

function urlB64ToUint8Array(base64) {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

// "unsupported" | "denied" | "on" | "off"
export async function getPushState() {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  return sub ? "on" : "off";
}

export async function enablePush() {
  if (!pushSupported()) throw new Error("This browser can't do notifications.");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Notifications weren't allowed.");
  const key = await api.pushKey();
  if (!key) throw new Error("The server isn't set up for notifications yet.");
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(key) });
  }
  await api.subscribePush(sub);
  return sub;
}

export async function disablePush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    try { await api.unsubscribePush(sub.endpoint); } catch (e) { /* best effort */ }
    await sub.unsubscribe();
  }
}
