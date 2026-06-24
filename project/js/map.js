/* map.js — the active plan's route on a real map (Leaflet + CARTO tiles, no key).
   Rebuilt whenever the plan changes (window.buildActiveMap). Numbered waypoints,
   a two-tone route (out vs. the drive home) in the plan's accent colour, clickable
   pins that scroll to each stop, and date popups. */
(function (global) {
  var ACCENT = {
    E: { out: "#2f7d44", ret: "#1d5430" }
  };

  var map = null;
  var markers = {};
  var activeId = null;

  function pinIcon(L, n, color, state) {
    return L.divIcon({
      className: "",
      html: '<div class="wp ' + (state || "") + '" style="--wp:' + color + '"><span>' + n + '</span></div>',
      iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -18]
    });
  }

  global.buildActiveMap = function (plan) {
    var L = global.L;
    var mount = document.getElementById("mapStage");
    if (!L || !mount || !plan) return;

    if (map) { try { map.remove(); } catch (e) {} map = null; }
    markers = {}; activeId = null;
    mount.innerHTML = "";

    var host = document.createElement("div");
    host.className = "leaflet-host";
    mount.appendChild(host);

    var home = global.TRIP_META.home.coord;
    var col = ACCENT[plan.id] || ACCENT.E;

    map = L.map(host, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19, crossOrigin: "anonymous", subdomains: "abcd",
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    // ordered latlngs: home → stops → home
    var arr = [home].concat(plan.stops.map(function (s) { return s.coord; })).concat([home]);

    // pivot for the homeward (dashed) leg = the last coastal stop before Edmundston
    var edmIdx = -1;
    plan.stops.forEach(function (s, i) { if (s.id === "edmundston") edmIdx = i; });
    var pivotStopIdx = edmIdx > 0 ? edmIdx - 1 : plan.stops.length - 2;
    var pivotArrIdx = pivotStopIdx + 1; // +1 for leading home

    var outbound = arr.slice(0, pivotArrIdx + 1);
    var homeward = arr.slice(pivotArrIdx);

    L.polyline(outbound, { color: col.out, weight: 3.6, opacity: 0.95, lineJoin: "round" }).addTo(map);
    L.polyline(homeward, { color: col.ret, weight: 3, opacity: 0.9, dashArray: "3 9", lineJoin: "round" }).addTo(map);

    // home marker
    L.marker(home, {
      icon: L.divIcon({ className: "", html: '<div class="wp wp--home">⌂</div>', iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -16] }),
      keyboard: false
    }).addTo(map).bindPopup('<b>Kitchener</b><br>Home — start &amp; finish');

    // stop markers
    plan.stops.forEach(function (s) {
      var m = L.marker(s.coord, { icon: pinIcon(L, s.n, col.out), riseOnHover: true, title: s.n + ". " + s.name });
      m.bindPopup('<span class="wp-pop__n">' + (s.n < 10 ? "0" + s.n : s.n) + '</span>' +
        '<b>' + s.name + '</b><br>' + s.days + ' · ' + s.nights +
        '<br><a href="#stop-' + s.id + '" class="wp-pop__link">Open this stop →</a>');
      m.on("click", function () { global.goToStop && global.goToStop(s.id); });
      m.on("mouseover", function () { m.setIcon(pinIcon(L, s.n, col.out, "is-hover")); });
      m.on("mouseout", function () { m.setIcon(pinIcon(L, s.n, col.out, m._active ? "is-active" : "")); });
      m.addTo(map);
      markers[s.id] = m;
    });

    // South Shore day-trip spurs hanging off a hub stop (e.g. Plan E Halifax)
    var dayPts = [];
    plan.stops.forEach(function (s) {
      if (!s.daytrips || !s.daytrips.length) return;
      s.daytrips.forEach(function (d) {
        dayPts.push(d.coord);
        L.polyline([s.coord, d.coord], { color: col.out, weight: 2, opacity: 0.65, dashArray: "2 7", lineJoin: "round" }).addTo(map);
        L.marker(d.coord, {
          icon: L.divIcon({ className: "", html: '<div class="wp-day" style="--wp:' + col.out + '"></div>', iconSize: [13, 13], iconAnchor: [6.5, 6.5], popupAnchor: [0, -9] }),
          title: d.name + " — day trip"
        }).addTo(map).bindPopup('<b>' + d.name + '</b><br>Day trip from ' + s.name + '<br>' + d.note);
      });
    });

    var all = arr.concat(dayPts);
    map.fitBounds(L.latLngBounds(all).pad(0.12));
    [180, 650, 1400].forEach(function (t) {
      setTimeout(function () { if (map) { map.invalidateSize(); map.fitBounds(L.latLngBounds(all).pad(0.12)); } }, t);
    });

    map.__col = col;
    map.__bounds = all;
  };

  // highlight the marker for the current stop
  global.mapSetActive = function (id) {
    if (!map || activeId === id) return;
    var L = global.L, col = map.__col || ACCENT.E;
    var stops = (global.ACTIVE_TRIP && global.ACTIVE_TRIP.stops) || [];
    function find(x) { for (var i = 0; i < stops.length; i++) if (stops[i].id === x) return stops[i]; return null; }
    if (markers[activeId]) { markers[activeId]._active = false; var pa = find(activeId); if (pa) markers[activeId].setIcon(pinIcon(L, pa.n, col.out, "")); }
    activeId = id;
    if (markers[id]) { markers[id]._active = true; var pn = find(id); if (pn) markers[id].setIcon(pinIcon(L, pn.n, col.out, "is-active")); }
  };

  // re-fit on resize
  global.addEventListener("resize", function () {
    if (map && map.__bounds) { map.invalidateSize(); map.fitBounds(global.L.latLngBounds(map.__bounds).pad(0.12)); }
  }, { passive: true });
})(window);
