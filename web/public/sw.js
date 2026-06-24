/* sw.js — offline cache for the Eastbound companion app.
   The app shell + Vite-built assets are cached at runtime (asset names are
   content-hashed, so we cache-on-fetch rather than precache a fixed list).
   Strategy: network-first for same-origin GETs so a new deploy shows up
   immediately when online, falling back to cache when there's no signal —
   which we'll have plenty of on the Cabot Trail. /api requests bypass the
   worker entirely (the app handles note sync + its own offline outbox), and
   Google Maps / Fonts are cross-origin and pass straight through. */
var CACHE = "eastbound-v1";
var SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-32.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (u) {
        return c.add(u).catch(function () { /* tolerate a missing optional asset */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  // Only same-origin GETs. Let the network handle the family-journal API
  // (the app caches notes itself) and any cross-origin maps/fonts requests.
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.indexOf("/api/") === 0) return;

  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.status === 200 && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        // For SPA navigations, fall back to the cached shell.
        return hit || (e.request.mode === "navigate" ? caches.match("/index.html") : undefined);
      });
    })
  );
});
