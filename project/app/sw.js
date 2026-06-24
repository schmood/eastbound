/* sw.js — offline cache for the Eastbound companion app.
   App-shell + data files are precached so the itinerary, stays, and confirmations
   work with no signal (which we'll have plenty of on the Cabot Trail).
   Google Maps links open the native app and need a connection. */
var CACHE = "eastbound-v2";
var ASSETS = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./trip-days.js",
  "./weather-data.js",
  "../js/data.js",
  "../js/lodging-data.js",
  "../js/wiki.js",
  "./manifest.json"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ASSETS.map(function (u) {
      return c.add(u).catch(function () { /* tolerate a missing optional asset */ });
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  // only handle same-origin GETs; let map/font/CDN requests pass through
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // Network-first: always prefer fresh content when online so app updates show
  // immediately; fall back to cache only when the network is unavailable.
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || caches.match("./index.html");
      });
    })
  );
});
