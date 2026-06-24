/* app.js — "Eastbound" companion app.
   A tiny hash-router SPA over the shared trip data (js/data.js, js/lodging-data.js)
   plus the day-by-day plan (app/trip-days.js). Screens: Today, Itinerary, Day,
   Stays, Stay detail, Ideas. Date-aware, with a "simulate any day" override so we
   can preview the on-the-road experience before we leave. */
(function () {
  "use strict";

  var DAYS = window.TRIP_DAYS;
  var STOPS = window.STOPS;
  var LODGING = window.LODGING;
  var TRIP = window.expandTrip();

  /* ---------- confirmation extras (placeholders until PDFs arrive) ---------- */
  // pdf: null = not yet added. Fill these in as confirmation emails come in.
  var CONF = {
    ottawa:      { conf: "—", checkIn: "4:00 PM", checkOut: "11:00 AM", address: "Downtown Ottawa", phone: "", pdf: null },
    quebec:      { conf: "—", checkIn: "4:00 PM", checkOut: "10:00 AM", address: "Old Québec (Le 201)", phone: "", pdf: null },
    fredericton: { conf: "—", checkIn: "4:00 PM", checkOut: "11:00 AM", address: "659 Queen St, Fredericton", phone: "", pdf: null },
    pei:         { conf: "—", checkIn: "3:00 PM", checkOut: "10:00 AM", address: "New Glasgow, PEI", phone: "", pdf: null },
    capebreton:  { conf: "—", checkIn: "3:00 PM", checkOut: "10:00 AM", address: "Petit Étang, NS", phone: "", pdf: null },
    halifax:     { conf: "—", checkIn: "4:00 PM", checkOut: "12:00 PM", address: "Downtown Halifax", phone: "", pdf: null },
    edmundston:  { conf: "—", checkIn: "3:00 PM", checkOut: "11:00 AM", address: "Edmundston, NB", phone: "", pdf: null },
    montreal:    { conf: "—", checkIn: "—", checkOut: "—", address: "Montréal — to book", phone: "", pdf: null }
  };

  /* ---------- icons ---------- */
  var ICON = {
    today: '<path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M4 9h16M9 3v3M15 3v3"/><circle cx="12" cy="14" r="2.2"/>',
    route: '<circle cx="5" cy="6.5" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="5" cy="17.5" r="1.4"/><path d="M9.5 6.5h10M9.5 12h10M9.5 17.5h10"/>',
    road: '<path d="M8 21 5 3h4l1 18M16 21l3-18h-4l-1 18M12 6v2M12 12v2M12 18v1.5"/>',
    bed: '<path d="M3 8v11M3 13h18a0 0 0 0 1 0 0v6M21 19v-5a3 3 0 0 0-3-3H8"/><circle cx="6.5" cy="9.5" r="1.6"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 1.9v.2h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0 0 12 3Z"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3"/>',
    nav: '<path d="m3 11 18-8-8 18-2-8-8-2Z"/>',
    car: '<path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4Z"/><circle cx="8" cy="15.5" r="0"/>',
    cal: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M9 3v3M15 3v3"/>',
    check: '<path d="M4 12.5 9 17.5 20 6"/>',
    phone: '<path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5 5L19 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    doc: '<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5M9 13h6M9 16h6"/>',
    sun: '<circle cx="12" cy="13" r="4"/><path d="M12 3v2M5 7 6.5 8.5M19 7l-1.5 1.5M3 14h2M19 14h2M12 19c-3 0-9 .5-9 2h18c0-1.5-6-2-9-2Z"/>',
    cam: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13.5" r="3.2"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14h2"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    cloud: '<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.8 3.8 0 0 1 18 18H7Z"/>',
    wsun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.4M12 19v2.4M2.6 12h2.4M19 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/>',
    wpartly: '<circle cx="8.5" cy="7.5" r="2.8"/><path d="M8.5 2.4v1.5M3.4 7.5h1.5M4.6 4.6l1 1M12.4 4.6l-1 1"/><path d="M7 19a3.2 3.2 0 0 1-.2-6.4 4 4 0 0 1 7.7-1A3 3 0 0 1 17.5 19H7Z"/>',
    wrain: '<path d="M7 15a3.6 3.6 0 0 1 0-7.2 4.6 4.6 0 0 1 8.8-1.2A3.5 3.5 0 0 1 17 15H7Z"/><path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5"/>',
    wfog: '<path d="M6.5 13a3.6 3.6 0 0 1 0-7.2 4.6 4.6 0 0 1 8.8-1.2A3.5 3.5 0 0 1 16.5 13"/><path d="M4 16.5h16M6 20h12"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="M9 12l2 2 4-4"/>',
    anchor: '<circle cx="12" cy="6" r="2.4"/><path d="M12 8.4V20M5 13a7 7 0 0 0 14 0M5 13H3m16 0h2"/>',
    chart: '<path d="M5 19V5M5 19h14M9 16V11M13 16V8M17 16v-3"/>',
    send: '<path d="M4.5 12h13M11 5.5 17.5 12 11 18.5"/>',
    swap: '<path d="M7 4 3.5 7.5 7 11M3.5 7.5H16M17 20l3.5-3.5L17 13M20.5 16.5H8"/>',
    out: '<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8 6 12l4 4M6 12h11"/>',
    note: '<path d="M5 4h11l3 3v13a0 0 0 0 1 0 0H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M8 10h8M8 14h6"/>'
  };
  function svg(p, cls) { return '<svg viewBox="0 0 24 24" ' + (cls ? 'class="' + cls + '"' : '') + '>' + p + '</svg>'; }

  /* ---------- date helpers ---------- */
  var WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var WDL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function parseD(s) { return new Date(s + "T12:00:00"); }
  function ymd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  // "today" — the real current date, unless a SESSION-ONLY simulation override is
  // set. The override lives in sessionStorage so it never survives a fresh app
  // launch: on the trip, opening the app always lands on the real current day.
  function simOverride() {
    try { return sessionStorage.getItem("eb-simdate"); } catch (e) { return null; }
  }
  // Simulation mode is an opt-in setting (off by default — the bar is a preview
  // tool, not for the real trip). Persisted in localStorage.
  function simEnabled() {
    try { return localStorage.getItem("eb-sim") === "1"; } catch (e) { return false; }
  }
  function todayYMD() {
    var o = simOverride();
    if (o) return o;
    return ymd(new Date());
  }
  function dayIndexFor(y) {
    // index into DAYS for the given ymd; -1 before, DAYS.length during-after handled by caller
    for (var i = 0; i < DAYS.length; i++) if (DAYS[i].date === y) return i;
    return -1;
  }
  function tripState(y) {
    var first = DAYS[0].date, last = DAYS[DAYS.length - 1].date;
    if (y < first) return { phase: "before", idx: -1 };
    if (y > last) return { phase: "after", idx: DAYS.length - 1 };
    var idx = dayIndexFor(y);
    return { phase: "on", idx: idx };
  }
  function daysUntil(y) {
    var a = parseD(y), b = parseD(DAYS[0].date);
    return Math.round((b - a) / 86400000);
  }

  /* ---------- google maps ---------- */
  function navTo(geo, fromCoord) {
    var dest = geo.coord ? geo.coord[0] + "," + geo.coord[1] : encodeURIComponent(geo.name);
    var url = "https://www.google.com/maps/dir/?api=1&destination=" + dest +
      "&destination_place_id=&travelmode=driving";
    if (fromCoord) url += "&origin=" + fromCoord[0] + "," + fromCoord[1];
    window.open(url, "_blank", "noopener");
  }
  function mapsSearch(name) {
    window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name), "_blank", "noopener");
  }
  // expose for inline onclick
  window.__nav = function (lat, lng, name) { navTo({ coord: (lat != null ? [lat, lng] : null), name: name }); };
  window.__maps = function (name) { mapsSearch(name); };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function placeLabel(name, province) { return province && province !== name ? esc(name) + " · " + esc(province) : esc(name); }
  function navAttr(geo) {
    var lat = geo.coord ? geo.coord[0] : "null";
    var lng = geo.coord ? geo.coord[1] : "null";
    return 'onclick="__nav(' + lat + ',' + lng + ',&quot;' + esc(geo.name) + '&quot;)"';
  }

  function pill(kind) {
    if (kind === "booked") return '<span class="pill pill--booked">' + svg(ICON.check) + 'Booked</span>';
    if (kind === "tobook") return '<span class="pill pill--tobook">To book</span>';
    if (kind === "stay")   return '<span class="pill pill--stay">Check-in</span>';
    if (kind === "drive")  return '<span class="pill pill--drive">Drive</span>';
    return "";
  }

  /* ---------- lodging lookups ---------- */
  function lodgingFor(baseId) {
    var v = LODGING.stops[baseId];
    if (!v) return null;
    return v;
  }
  function stayName(baseId) {
    var v = lodgingFor(baseId);
    if (!v) return null;
    return v.status === "booked" ? v.booked.name : "Hotel — to book";
  }

  /* ---------- weather (mock until a live API is wired) ---------- */
  var WX = window.MOCK_WEATHER || {};
  function wxIcon(cond) {
    var m = { sun: "wsun", partly: "wpartly", cloud: "cloud", rain: "wrain", shower: "wrain", fog: "wfog" };
    return ICON[m[cond] || "cloud"];
  }
  function wxLabel(cond) {
    return { sun: "Sunny", partly: "Partly cloudy", cloud: "Cloudy", rain: "Rain likely", shower: "Showers", fog: "Morning fog" }[cond] || "\u2014";
  }
  function wxClass(cond) {
    if (cond === "rain" || cond === "shower") return "wet";
    if (cond === "sun") return "clear";
    if (cond === "fog" || cond === "cloud") return "grey";
    return "mild";
  }
  // 3-day forecast card from a starting day index, labelled by location
  function forecastCard(startIdx, locLabel) {
    var w0 = WX[DAYS[startIdx] && DAYS[startIdx].date];
    if (!w0) return "";
    var items = "";
    for (var k = 0; k < 3; k++) {
      var idx = startIdx + k;
      if (!DAYS[idx]) break;
      var w = WX[DAYS[idx].date];
      if (!w) continue;
      var d = parseD(DAYS[idx].date);
      var dn = k === 0 ? "Today" : WD[d.getDay()];
      items += '<div class="wx-d"><span class="wx-dn">' + dn + '</span>' + svg(wxIcon(w.cond), "wx-di") +
        '<span class="wx-dt">' + w.hi + '\u00b0<i>' + w.lo + '\u00b0</i></span></div>';
    }
    var head = '<div class="wx-now"><div class="wx-now-ic ' + wxClass(w0.cond) + '">' + svg(wxIcon(w0.cond)) + '</div>' +
      '<div class="wx-now-temp">' + w0.hi + '\u00b0<span>/ ' + w0.lo + '\u00b0</span></div>' +
      '<div class="wx-now-meta"><b>' + wxLabel(w0.cond) + '</b><span>' + w0.pop + '% rain \u00b7 wind ' + w0.wind + ' km/h</span></div></div>';
    var note = w0.note ? '<div class="wx-note-line">' + esc(w0.note) + '</div>' : "";
    return sectionTitle("Weather" + (locLabel ? " \u00b7 " + locLabel : "")) +
      '<div class="card wx">' + head + note + '<div class="wx-3day">' + items + '</div>' +
      '<div class="wx-sample">Sample forecast \u2014 live data once we\u2019re closer</div></div>';
  }
  // compact single-day chip for the day-detail screen
  function weatherChip(idx) {
    var d = DAYS[idx]; if (!d) return "";
    var w = WX[d.date]; if (!w) return "";
    return '<div class="wx-chip ' + wxClass(w.cond) + '">' + svg(wxIcon(w.cond)) +
      '<span class="wx-chip-t">' + w.hi + '\u00b0 / ' + w.lo + '\u00b0</span>' +
      '<span class="wx-chip-c">' + wxLabel(w.cond) + '</span>' +
      '<span class="wx-chip-p">' + w.pop + '% \u00b7 ' + w.wind + ' km/h</span></div>';
  }

  /* ============================================================
     SCREENS
     ============================================================ */
  var app = {};

  /* ---- TODAY ---- */
  app.today = function () {
    var y = todayYMD();
    var st = tripState(y);
    var html = "";

    if (st.phase === "before") {
      var n = daysUntil(y);
      var d0 = DAYS[0];
      html += '<div class="card countdown">' +
        '<div class="countdown__num">' + n + '</div>' +
        '<div class="countdown__lab">' + (n === 1 ? "day" : "days") + ' to departure</div>' +
        '<div class="countdown__sub">We roll out <b>' + fullDate(d0.date) + '</b> — ' + esc(d0.title) + '.</div>' +
        '</div>';
      html += '<a class="btn btn--primary btn--block" style="margin-bottom:14px" href="#/day/0">Preview day one ' + svg(ICON.route) + '</a>';
      html += forecastCard(0, "opening days");
      html += sectionTitle("The route at a glance");
      html += miniRoute();
      html += statsTeaser();
      return wrapScreen("Eastbound", "Maritimes road trip", html, false);
    }

    var day = DAYS[st.idx];
    var dayNum = st.idx + 1;
    var base = day.base;
    var stay = stayName(base);
    var driveTag = day.kind === "drive" || day.kind === "transit";

    // hero
    var metaPills = "";
    metaPills += '<span class="pill">Day ' + dayNum + ' of ' + DAYS.length + '</span>';
    if (driveTag && day.drive) metaPills += '<span class="pill">' + svg(ICON.car) + ' ' + esc(day.drive.hrs) + '</span>';
    if (stay && base !== "home") metaPills += '<span class="pill">' + svg(ICON.bed) + ' ' + esc(shortStay(base)) + '</span>';

    html += '<div class="hero-day">' +
      '<div class="hero-day__kicker"><span>' + (st.phase === "after" ? "Trip complete" : "Today") + '</span><span>' + WD[parseD(y).getDay()] + '</span></div>' +
      '<div class="hero-day__date">' + fullDate(y) + '</div>' +
      '<h1>' + esc(day.title) + '</h1>' +
      '<div class="hero-day__sum">' + esc(day.summary) + '</div>' +
      '<div class="hero-day__meta">' + metaPills + '</div>' +
      '</div>';

    // primary CTA — navigate to the day's waypoint
    if (day.waypoint && base !== "home" || (day.waypoint && st.phase !== "after")) {
      html += '<button class="btn btn--nav btn--block" style="margin-bottom:8px" ' + navAttr(day.waypoint) + '>' +
        svg(ICON.nav) + 'Navigate: ' + esc(day.waypoint.name) + '</button>';
    } else if (day.waypoint) {
      html += '<button class="btn btn--nav btn--block" style="margin-bottom:8px" ' + navAttr(day.waypoint) + '>' +
        svg(ICON.nav) + 'Navigate home' + '</button>';
    }

    // drive card
    if (day.drive) {
      html += '<div class="drivecard" style="margin-top:6px">' +
        '<div class="drivecard__ic">' + svg(ICON.car) + '</div>' +
        '<div class="drivecard__main">' +
          '<div class="drivecard__route">' + esc(day.drive.from) + ' → ' + esc(day.drive.to) + '</div>' +
          '<div class="drivecard__stat">' + esc(day.drive.km) + ' · ' + esc(day.drive.hrs) + '</div>' +
        '</div></div>';
    }

    // sunset banner (Skyline day)
    if (day.sunset) {
      html += '<div class="sunset">' + svg(ICON.sun) + '<span>Sunset ' + esc(day.sunset) + ' — Skyline check-in by 6 PM for the golden-hour hike.</span></div>';
    }

    // today's plan
    html += forecastCard(st.idx, base !== "home" ? STOPS[base].name : "the drive home");
    html += sectionTitle("Today's plan");
    html += '<div class="card"><div class="nownext">';
    day.plan.forEach(function (p) {
      html += planRow(p);
    });
    html += '</div></div>';

    // where we sleep
    if (base !== "home") {
      var v = lodgingFor(base);
      if (v) {
        html += sectionTitle("Tonight");
        html += stayCardCompact(base, v);
      }
    }

    html += statsTeaser();
    html += notesSection(day.date);
    return wrapScreen("Eastbound", "Day " + dayNum, html, false);
  };

  function planRow(p) {
    var h = '<div class="nn-row">' +
      '<div class="nn-time">' + esc(p.time) + '</div>' +
      '<div class="nn-body">' +
        '<div class="nn-title">' + esc(p.title) + (p.tag ? pill(p.tag) : "") + '</div>' +
        (p.note ? '<div class="nn-note">' + esc(p.note) + '</div>' : "");
    if (p.geo) {
      h += '<div class="nn-nav"><button class="btn btn--ghost" ' + navAttr(p.geo) + '>' + svg(ICON.nav) + esc(p.geo.name) + '</button></div>';
    }
    h += '</div></div>';
    return h;
  }

  function stayCardCompact(baseId, v) {
    var booked = v.status === "booked";
    var name = booked ? v.booked.name : "Hotel — still to book";
    var detail = booked ? v.booked.detail : (v.intro || "");
    return '<a class="card stay-card" href="#/stay/' + baseId + '">' +
      '<div class="stay-card__top"><div>' +
        '<div class="stay-card__place">' + esc(STOPS[baseId].name) + '</div>' +
        '<div class="stay-card__name">' + esc(name) + '</div>' +
      '</div>' + pill(booked ? "booked" : "tobook") + '</div>' +
      (detail ? '<div class="stay-card__detail">' + esc(detail) + '</div>' : "") +
      '<div class="stay-card__dates">' + svg(ICON.cal) + esc(v.dates) + '</div>' +
      '</a>';
  }

  /* ---- ITINERARY LIST ---- */
  app.days = function () {
    var y = todayYMD();
    var html = sectionTitle("17 nights · " + DAYS.length + " days");
    html += '<div class="daylist">';
    DAYS.forEach(function (day, i) {
      var d = parseD(day.date);
      var cls = "dayrow";
      if (day.date === y) cls += " is-today";
      else if (day.date < y) cls += " is-past";
      var tags = "";
      if (day.kind === "drive" || day.kind === "transit") tags += pill("drive");
      var hasBooked = day.plan.some(function (p) { return p.tag === "booked"; });
      var hasTobook = day.plan.some(function (p) { return p.tag === "tobook"; });
      if (hasBooked) tags += pill("booked");
      if (hasTobook) tags += pill("tobook");
      html += '<a class="' + cls + '" href="#/day/' + i + '">' +
        '<div class="dayrow__date">' +
          '<div class="dayrow__dow">' + WD[d.getDay()] + '</div>' +
          '<div class="dayrow__dd">' + d.getDate() + '</div>' +
          '<div class="dayrow__mon">' + MO[d.getMonth()] + '</div>' +
        '</div>' +
        '<div class="dayrow__body">' +
          '<div class="dayrow__t">' + esc(day.title) + '</div>' +
          '<div class="dayrow__s">' + esc(day.summary) + '</div>' +
          (tags ? '<div class="dayrow__tags">' + tags + '</div>' : "") +
        '</div>' +
        '<div class="dayrow__chev">›</div>' +
      '</a>';
    });
    html += '</div>';
    return wrapScreen("Itinerary", "Kitchener → the Maritimes → home", html, false);
  };

  /* ---- DAY DETAIL ---- */
  app.day = function (idxStr) {
    var i = parseInt(idxStr, 10);
    if (isNaN(i) || !DAYS[i]) return app.days();
    var day = DAYS[i];
    var html = "";

    // navigate CTA
    if (day.waypoint) {
      html += '<button class="btn btn--nav btn--block" style="margin:4px 0 14px" ' + navAttr(day.waypoint) + '>' +
        svg(ICON.nav) + 'Navigate: ' + esc(day.waypoint.name) + '</button>';
    }

    html += weatherChip(i);

    if (day.drive) {
      html += '<div class="drivecard">' +
        '<div class="drivecard__ic">' + svg(ICON.car) + '</div>' +
        '<div class="drivecard__main">' +
          '<div class="drivecard__route">' + esc(day.drive.from) + ' → ' + esc(day.drive.to) + '</div>' +
          '<div class="drivecard__stat">' + esc(day.drive.km) + ' · ' + esc(day.drive.hrs) + '</div>' +
        '</div></div>';
    }
    if (day.sunset) {
      html += '<div class="sunset">' + svg(ICON.sun) + '<span>Sunset ' + esc(day.sunset) + ' — golden-hour Skyline hike.</span></div>';
    }

    html += '<div class="card"><div class="dd-plan">';
    day.plan.forEach(function (p) {
      html += '<div class="dd-item">' +
        '<div class="dd-time">' + esc(p.time) + '</div>' +
        '<div class="dd-body">' +
          '<div class="dd-title">' + esc(p.title) + (p.tag ? pill(p.tag) : "") + '</div>' +
          (p.note ? '<div class="dd-note">' + esc(p.note) + '</div>' : "") +
          (p.geo ? '<a class="dd-navlink" ' + navAttr(p.geo) + '>' + svg(ICON.nav) + 'Directions to ' + esc(p.geo.name) + '</a>' : "") +
        '</div></div>';
    });
    html += '</div></div>';

    if (day.base !== "home") {
      var v = lodgingFor(day.base);
      if (v) {
        html += sectionTitle("Where we sleep");
        html += stayCardCompact(day.base, v);
      }
    }

    var dd = parseD(day.date);
    var sub = WDL[dd.getDay()] + ", " + MO[dd.getMonth()] + " " + dd.getDate();
    html += notesSection(day.date);
    return wrapScreen("Day " + (i + 1), sub, html, true);
  };

  /* ---- STAYS ---- */
  app.stays = function () {
    var html = sectionTitle("Where we're staying");
    // ordered by route
    TRIP.stops.forEach(function (s) {
      var v = LODGING.stops[s.id];
      if (!v) return;
      var booked = v.status === "booked";
      html += '<a class="card stay-card" href="#/stay/' + s.id + '">' +
        '<div class="stay-card__top"><div>' +
          '<div class="stay-card__place">' + placeLabel(s.name, s.province) + '</div>' +
          '<div class="stay-card__name">' + esc(booked ? v.booked.name : "Hotel — still to book") + '</div>' +
        '</div>' + pill(booked ? "booked" : "tobook") + '</div>' +
        '<div class="stay-card__detail">' + esc(booked ? v.booked.detail : (v.intro || "")) + '</div>' +
        '<div class="stay-card__dates">' + svg(ICON.cal) + esc(v.dates) + ' · ' + (v.nights === 1 ? "1 night" : v.nights + " nights") + '</div>' +
      '</a>';
    });

    // booked transport/tours
    html += sectionTitle("Booked along the way");
    LODGING.extras.forEach(function (e) {
      html += '<div class="card">' +
        '<div class="stay-card__top"><div>' +
          '<div class="stay-card__place">' + esc(e.kind) + '</div>' +
          '<div class="stay-card__name" style="font-size:1.12rem">' + esc(e.label) + '</div>' +
        '</div>' + pill(e.status === "booked" ? "booked" : "tobook") + '</div>' +
        '<div class="stay-card__detail">' + esc(e.when) + ' — ' + esc(e.note) + '</div>' +
      '</div>';
    });

    return wrapScreen("Stays", "Confirmations & lodging", html, false);
  };

  /* ---- STAY DETAIL (confirmation) ---- */
  app.stay = function (id) {
    var v = LODGING.stops[id];
    var stop = STOPS[id];
    if (!v || !stop) return app.stays();
    var c = CONF[id] || {};
    var booked = v.status === "booked";
    var b = v.booked;
    var html = "";

    html += '<div class="card">' +
      '<div class="stay-detail__head">' +
        pill(booked ? "booked" : "tobook") +
        '<div class="stay-card__place">' + placeLabel(stop.name, stop.province) + '</div>' +
        '<div class="stay-card__name">' + esc(booked ? b.name : "Hotel — still to book") + '</div>' +
      '</div>' +
      (booked ? '<div class="stay-card__detail">' + esc(b.detail) + '</div>' : '<div class="stay-card__detail">' + esc(v.intro || "") + '</div>') +
      '<div class="stay-card__dates">' + svg(ICON.cal) + esc(v.dates) + ' · ' + (v.nights === 1 ? "1 night" : v.nights + " nights") + '</div>' +
      '<div class="stay-card__actions">' +
        '<button class="btn btn--nav" ' + navAttr({ name: (booked ? b.name : stop.name) + " " + stop.province, coord: stop.coord }) + '>' + svg(ICON.nav) + 'Directions</button>' +
        (c.phone ? '<a class="btn btn--ghost" href="tel:' + esc(c.phone) + '">' + svg(ICON.phone) + 'Call</a>' : '<button class="btn btn--ghost" onclick="__maps(\'' + esc((booked ? b.name : stop.name)) + '\')">' + svg(ICON.pin) + 'Find</button>') +
      '</div>' +
    '</div>';

    if (booked) {
      html += sectionTitle("Confirmation");
      html += '<div class="card"><div class="conf-rows">' +
        confRow("Property", b.name) +
        confRow("Type", b.type) +
        confRow("Check-in", v.dates.split("–")[0].trim() + " · " + (c.checkIn || "—")) +
        confRow("Check-out", (c.checkOut || "—")) +
        confRow("Guests", "2 adults + 2 (15, 13)") +
        confRow("Confirmation #", c.conf || "—", true) +
        confRow("Total paid", "$" + Number(b.total).toLocaleString("en-CA")) +
      '</div>' +
      '<div class="pdf-slot">' + (c.pdf
        ? '<a class="btn btn--primary btn--block" href="' + esc(c.pdf) + '" target="_blank">' + svg(ICON.doc) + 'Open confirmation PDF</a>'
        : '<b>Confirmation PDF</b>Drop the email PDF at <code>app/confirmations/' + id + '.pdf</code> and it shows here.') +
      '</div>' +
      '</div>';
    } else {
      html += sectionTitle("Still to book");
      html += '<div class="card">' +
        '<div class="stay-card__detail" style="margin-top:0">Estimate <b>' + esc(v.est || "") + '</b> for the stay.</div>' +
        '<a class="btn btn--primary btn--block" style="margin-top:14px" href="' + esc(v.searchUrl) + '" target="_blank">' + esc(v.searchLabel || "Search stays") + ' →</a>' +
      '</div>';
    }

    return wrapScreen(stop.name, esc(v.dates), html, true);
  };
  function confRow(k, val, mono) {
    return '<div class="conf-row"><span class="conf-k">' + esc(k) + '</span><span class="conf-v' + (mono ? ' mono' : '') + '">' + esc(val) + '</span></div>';
  }

  /* ---- TRIP STATS ---- */
  function computeStats() {
    var y = todayYMD();
    var st = tripState(y);
    var idx = st.phase === "before" ? -1 : st.idx; // -1 pre-trip, else 0..17
    var totalDays = DAYS.length, totalNights = 17, stopsTotal = 8;

    var kmTotal = 0, kmDone = 0, drivesTotal = 0, drivesDone = 0, biggest = 0;
    DAYS.forEach(function (d, i) {
      if (!d.drive) return;
      var m = (d.drive.km || "").match(/(\d{2,4})/);
      var k = m ? parseInt(m[1], 10) : 0;
      kmTotal += k; drivesTotal++;
      if (k > biggest) biggest = k;
      if (idx >= 0 && i <= idx) { kmDone += k; drivesDone++; }
    });

    var stopsSeen = {};
    DAYS.forEach(function (d, i) { if (idx >= 0 && i <= idx && d.base !== "home") stopsSeen[d.base] = 1; });
    var stopsDone = Object.keys(stopsSeen).length;

    var provOrder = [
      { name: "Ontario", abbr: "ON", day: 0 },
      { name: "Québec", abbr: "QC", day: 2 },
      { name: "New Brunswick", abbr: "NB", day: 4 },
      { name: "P.E.I.", abbr: "PE", day: 5 },
      { name: "Nova Scotia", abbr: "NS", day: 8 }
    ];
    provOrder.forEach(function (p) { p.done = idx >= 0 && idx >= p.day; });
    var provDone = provOrder.filter(function (p) { return p.done; }).length;

    return {
      phase: st.phase, idx: idx,
      daysDone: idx < 0 ? 0 : Math.min(idx + 1, totalDays), totalDays: totalDays,
      nightsDone: idx < 0 ? 0 : Math.min(idx, totalNights), totalNights: totalNights,
      kmDone: kmDone, kmTotal: kmTotal,
      drivesDone: drivesDone, drivesTotal: drivesTotal, biggest: biggest,
      stopsDone: stopsDone, stopsTotal: stopsTotal,
      prov: provOrder, provDone: provDone,
      daysLeft: idx < 0 ? totalDays : Math.max(0, totalDays - (idx + 1)),
      untilStart: idx < 0 ? daysUntil(y) : 0
    };
  }
  function fmtKm(n) { return n.toLocaleString("en-CA"); }
  function bar(done, total) {
    var pct = total ? Math.round(done / total * 100) : 0;
    return '<div class="st-bar"><span style="width:' + pct + '%"></span></div>';
  }
  function statTile(value, total, unit, label, done, of) {
    return '<div class="st-tile">' +
      '<div class="st-val">' + value + (total != null ? '<span class="st-of">/ ' + total + '</span>' : '') + (unit ? '<span class="st-unit">' + unit + '</span>' : '') + '</div>' +
      '<div class="st-lab">' + esc(label) + '</div>' +
      bar(done, of) +
    '</div>';
  }
  app.stats = function () {
    var s = computeStats();
    var html = "";

    // hero progress
    var heroTitle, heroSub;
    if (s.phase === "before") { heroTitle = "The road ahead"; heroSub = s.untilStart + (s.untilStart === 1 ? " day" : " days") + " until we roll out"; }
    else if (s.phase === "after") { heroTitle = "Trip complete"; heroSub = "Here's the final tally"; }
    else { heroTitle = "Day " + s.daysDone + " of " + s.totalDays; heroSub = s.daysLeft + (s.daysLeft === 1 ? " day to go" : " days to go"); }
    var pct = Math.round(s.daysDone / s.totalDays * 100);

    html += '<div class="st-hero">' +
      '<div class="st-hero__pct">' + pct + '<span>%</span></div>' +
      '<div class="st-hero__body">' +
        '<div class="st-hero__t">' + esc(heroTitle) + '</div>' +
        '<div class="st-hero__s">' + esc(heroSub) + '</div>' +
        bar(s.daysDone, s.totalDays) +
      '</div>' +
    '</div>';

    // stat tiles
    html += '<div class="st-grid">' +
      statTile(fmtKm(s.kmDone), fmtKm(s.kmTotal), " km", "Distance driven", s.kmDone, s.kmTotal) +
      statTile(s.nightsDone, s.totalNights, "", "Nights away", s.nightsDone, s.totalNights) +
      statTile(s.provDone, s.prov.length, "", "Provinces", s.provDone, s.prov.length) +
      statTile(s.stopsDone, s.stopsTotal, "", "Stops reached", s.stopsDone, s.stopsTotal) +
    '</div>';

    // provinces lit/unlit
    html += sectionTitle("Provinces crossed");
    html += '<div class="st-prov">';
    s.prov.forEach(function (p) {
      html += '<div class="st-chip' + (p.done ? " on" : "") + '"><b>' + p.abbr + '</b><span>' + esc(p.name) + '</span></div>';
    });
    html += '</div>';

    // fun facts
    html += sectionTitle("Tally");
    html += '<div class="card"><div class="st-facts">' +
      factRow(ICON.car, s.drivesDone + " of " + s.drivesTotal, "driving legs done") +
      factRow(ICON.road, fmtKm(s.kmTotal - s.kmDone) + " km", "still to drive") +
      factRow(ICON.chart, s.biggest + " km", "longest single leg (Halifax → Edmundston)") +
      factRow(ICON.anchor, (s.idx >= 8 ? "Crossed ✓" : "Aug 6"), "Wood Islands → Caribou ferry") +
    '</div></div>';

    html += '<p class="about-note">A running tally, updated to today. Fun for the back seat.</p>';
    return wrapScreen("Trip stats", heroSub, html, true);
  };
  function factRow(icon, big, label) {
    return '<div class="st-fact"><div class="st-fact__ic">' + svg(icon) + '</div>' +
      '<div class="st-fact__b"><b>' + esc(big) + '</b><span>' + esc(label) + '</span></div></div>';
  }
  function statsTeaser() {
    var s = computeStats();
    var line = s.phase === "before"
      ? ("Starts in " + s.untilStart + (s.untilStart === 1 ? " day" : " days"))
      : s.phase === "after" ? "Trip complete · " + fmtKm(s.kmTotal) + " km"
      : ("Day " + s.daysDone + " of " + s.totalDays + " · " + fmtKm(s.kmDone) + " of " + fmtKm(s.kmTotal) + " km");
    return '<a class="card st-teaser" href="#/stats">' +
      '<div class="st-teaser__ic">' + svg(ICON.chart) + '</div>' +
      '<div class="st-teaser__b"><div class="st-teaser__t">Trip stats</div>' +
      '<div class="st-teaser__s">' + esc(line) + '</div>' + bar(s.daysDone, s.totalDays) + '</div>' +
      '<div class="st-teaser__go">›</div></a>';
  }

  /* ============================================================
     FAMILY IDENTITY  ·  Attila · Jennifer · Vera · Hazel
     Sign-in is Google SSO, gated to the four family Google accounts (ALLOWED).
     Set CLIENT_ID below to a Google OAuth "Web application" client ID (with this
     app's origin in Authorized JavaScript origins) and the real "Sign in with
     Google" button activates. Until then, preview accounts stand in so the flow
     can be tested. Notes are stored on-device; a shared cloud journal is a
     backend/handoff item.
     ============================================================ */
  var CLIENT_ID = ""; // ← paste the Google OAuth Web client ID here at handoff
  var PEOPLE = [
    { id: "attila",   name: "Attila",   email: "schmood@gmail.com",           color: "#2f7d44", initials: "A" },
    { id: "jennifer", name: "Jennifer", email: "jenscullion@gmail.com",        color: "#a8451f", initials: "J" },
    { id: "vera",     name: "Vera",     email: "veralynneschmidt@gmail.com",   color: "#235d7e", initials: "V" },
    { id: "hazel",    name: "Hazel",    email: "hazelmarieschmidt@gmail.com",   color: "#c98a2b", initials: "H" }
  ];
  // allow-list: only these Google accounts may sign in
  var ALLOWED = {
    "schmood@gmail.com": "attila",
    "jenscullion@gmail.com": "jennifer",
    "veralynneschmidt@gmail.com": "vera",
    "hazelmarieschmidt@gmail.com": "hazel"
  };
  var loginError = "";
  function decodeJwt(tok) {
    try {
      var p = tok.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(p))));
    } catch (e) { return null; }
  }
  // central gate: given a verified email, sign in iff it's on the allow-list
  function signInWithEmail(email) {
    var id = ALLOWED[(email || "").trim().toLowerCase()];
    if (!id) {
      loginError = (email ? esc(email) : "That account") + " isn\u2019t on this trip. Only the four of us can sign in.";
      try { if (window.google && google.accounts) google.accounts.id.disableAutoSelect(); } catch (e) {}
      route();
      return false;
    }
    loginError = "";
    setUser(id);
    location.hash = "#/today";
    route();
    return true;
  }
  // Google Identity Services callback
  window.__gsiCallback = function (resp) {
    var data = resp && resp.credential ? decodeJwt(resp.credential) : null;
    signInWithEmail(data && data.email);
  };
  function initGIS() {
    if (!CLIENT_ID || !window.google || !google.accounts || !google.accounts.id) return false;
    try {
      google.accounts.id.initialize({ client_id: CLIENT_ID, callback: window.__gsiCallback, auto_select: false });
      var host = document.getElementById("gbtn");
      if (host) google.accounts.id.renderButton(host, { theme: "outline", size: "large", width: 300, text: "signin_with", shape: "pill" });
      return true;
    } catch (e) { return false; }
  }
  function personById(id) { for (var i = 0; i < PEOPLE.length; i++) if (PEOPLE[i].id === id) return PEOPLE[i]; return null; }
  function currentUser() { try { return personById(localStorage.getItem("eb-user")); } catch (e) { return null; } }
  function setUser(id) { try { localStorage.setItem("eb-user", id); } catch (e) {} }
  function signOut() { try { localStorage.removeItem("eb-user"); } catch (e) {} }
  function avatar(p, cls) { if (!p) return ""; return '<span class="avatar ' + (cls || "") + '" style="background:' + p.color + '">' + esc(p.initials) + '</span>'; }
  function googleG() {
    return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
      '<path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"/>' +
      '<path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/>' +
      '<path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z"/>' +
      '<path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.6 9.4 5.9 12 5.9Z"/></svg>';
  }

  /* ---------- notes store ---------- */
  function loadNotes() { try { return JSON.parse(localStorage.getItem("eb-notes") || "[]"); } catch (e) { return []; } }
  function saveNotes(a) { try { localStorage.setItem("eb-notes", JSON.stringify(a)); } catch (e) {} }
  function notesForDay(date) { return loadNotes().filter(function (n) { return n.day === date; }).sort(function (a, b) { return a.ts - b.ts; }); }
  function addNote(date, text) {
    var u = currentUser(); if (!u || !text.trim()) return false;
    var a = loadNotes();
    a.push({ id: "n" + Date.now() + Math.random().toString(36).slice(2, 6), day: date, author: u.id, ts: Date.now(), text: text.trim() });
    saveNotes(a); return true;
  }
  function delNote(id) { saveNotes(loadNotes().filter(function (n) { return n.id !== id; })); }
  function fmtTime(ts) { return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
  window.__delNote = function (id) { delNote(id); route(); };

  function noteHTML(n, allowDelete) {
    var p = personById(n.author) || { name: "?", color: "#888", initials: "?" };
    var me = currentUser();
    var canDel = allowDelete && me && me.id === n.author;
    return '<div class="note">' + avatar(p) +
      '<div class="note-b"><div class="note-h"><b>' + esc(p.name) + '</b><span>' + esc(fmtTime(n.ts)) + '</span>' +
      (canDel ? '<button class="note-del" onclick="__delNote(\'' + n.id + '\')" aria-label="Delete note">×</button>' : '') +
      '</div><div class="note-t">' + esc(n.text) + '</div></div></div>';
  }

  /* a per-day notes section with composer */
  function notesSection(date) {
    var notes = notesForDay(date);
    var u = currentUser();
    var html = sectionTitle("Trip notes" + (notes.length ? " · " + notes.length : ""));
    html += '<div class="card notes">';
    if (notes.length) {
      html += '<div class="note-list">' + notes.map(function (n) { return noteHTML(n, true); }).join("") + '</div>';
    } else {
      html += '<div class="note-empty">No notes yet for this day — start the journal.</div>';
    }
    html += '<div class="note-compose">' + avatar(u) +
      '<textarea id="note-input" rows="1" placeholder="Add a note as ' + esc(u.name) + '\u2026" oninput="__noteGrow(this)" onkeydown="__noteKey(event,\'' + date + '\')"></textarea>' +
      '<button class="note-send" onclick="__noteAdd(\'' + date + '\')" aria-label="Post note">' + svg(ICON.send) + '</button>' +
      '</div></div>';
    return html;
  }
  var pendingScrollDate = null;
  window.__noteGrow = function (t) { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 130) + "px"; };
  window.__noteKey = function (e, date, inputId) { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); window.__noteAdd(date, inputId); } };
  window.__noteAdd = function (date, inputId) {
    var t = document.getElementById(inputId || "note-input"); if (!t) return;
    if (addNote(date, t.value)) { pendingScrollDate = date; route(); }
  };
  // a composer (textarea + send) with a unique input id per mount
  function composerHTML(date, inputId) {
    var u = currentUser();
    return '<div class="note-compose">' + avatar(u) +
      '<textarea id="' + inputId + '" rows="1" placeholder="Add a note as ' + esc(u.name) + '..." oninput="__noteGrow(this)" onkeydown="__noteKey(event,\'' + date + '\',\'' + inputId + '\')"></textarea>' +
      '<button class="note-send" onclick="__noteAdd(\'' + date + '\',\'' + inputId + '\')" aria-label="Post note">' + svg(ICON.send) + '</button>' +
      '</div>';
  }

  /* ---------- LOGIN (Google-style account chooser) ---------- */
  app.login = function () {
    var html = '<div class="login">' +
      '<div class="login__logo">' + googleG() + '</div>' +
      '<div class="login__brand">Eastbound</div>' +
      '<div class="login__sub">Sign in with your Google account</div>';
    if (loginError) html += '<div class="login__err">' + loginError + '</div>';
    // real Google button mounts here when CLIENT_ID is configured
    html += '<div class="login__gbtn" id="gbtn"></div>';
    if (!CLIENT_ID) {
      html += '<div class="login__divide"><span>preview accounts</span></div>' +
        '<div class="login__hint">Real “Sign in with Google” activates once the OAuth client ID is set. For now, tap your account to test the flow.</div>' +
        '<div class="login__list">';
      PEOPLE.forEach(function (p) {
        html += '<button class="login__acct" onclick="__previewLogin(\'' + p.email + '\')">' + avatar(p, "avatar--lg") +
          '<span class="login__acct-b"><b>' + esc(p.name) + '</b><span>' + esc(p.email) + '</span></span>' +
          '<span class="login__chev">\u203a</span></button>';
      });
      html += '</div>';
    }
    html += '<div class="login__note">A private family companion \u00b7 Jul 29 \u2013 Aug 15, 2026<br>Only the four of us can sign in.</div>' +
      '</div>';
    return html;
  };
  // preview sign-in routes through the SAME allow-list gate as real Google
  window.__previewLogin = function (email) { signInWithEmail(email); };
  window.__logout = function () {
    try { if (window.google && google.accounts) { google.accounts.id.disableAutoSelect(); } } catch (e) {}
    loginError = "";
    signOut();
    location.hash = "#/login";
    route();
  };
  // called from index.html once the Google Identity Services script loads
  window.__onGsiLoad = function () { if (!currentUser()) initGIS(); };

  /* ---------- ACCOUNT ---------- */
  app.me = function () {
    var u = currentUser();
    var notes = loadNotes();
    var mine = notes.filter(function (n) { return n.author === u.id; }).length;
    var html = '<div class="card me-card">' + avatar(u, "avatar--xl") +
      '<div class="me-b"><div class="me-name">' + esc(u.name) + '</div><div class="me-email">' + esc(u.email) + '</div></div></div>';
    html += '<button class="btn btn--ghost btn--block" style="margin-bottom:18px" onclick="__logout()">' + svg(ICON.out) + 'Log out</button>';
    html += sectionTitle("Trip journal");
    html += '<a class="card st-teaser" href="#/notes"><div class="st-teaser__ic">' + svg(ICON.note) + '</div>' +
      '<div class="st-teaser__b"><div class="st-teaser__t">All notes</div>' +
      '<div class="st-teaser__s">' + notes.length + (notes.length === 1 ? " note" : " notes") + ' \u00b7 ' + mine + ' from you</div></div>' +
      '<div class="st-teaser__go">\u203a</div></a>';
    html += '<button class="btn btn--primary btn--block" style="margin-top:6px" onclick="__exportNotes()">' + svg(ICON.doc) + 'Export notes as text</button>';
    html += sectionTitle("Settings");
    var simOn = simEnabled();
    html += '<div class="card set-row">' +
      '<div class="set-b"><div class="set-t">Simulation mode</div>' +
      '<div class="set-d">Show the day-stepper bar to preview any day of the trip. Off for normal use.</div></div>' +
      '<button class="toggle' + (simOn ? ' on' : '') + '" role="switch" aria-checked="' + (simOn ? 'true' : 'false') + '" aria-label="Toggle simulation mode" onclick="__simToggle()"><span class="toggle__dot"></span></button>' +
      '</div>';
    html += '<p class="about-note">Signed in with Google on this device. Notes you add are tagged with your name and the time. A shared cloud journal (everyone\u2019s phones in sync) comes with the backend at handoff.</p>';
    return wrapScreen("Account", esc(u.name), html, true);
  };

  /* ---------- TRIP JOURNAL (all notes · 5th tab) ---------- */
  app.notes = function () {
    var all = loadNotes();
    var y = todayYMD();
    var html = '<button class="btn btn--primary btn--block" style="margin:4px 0 12px" onclick="__exportNotes()">' + svg(ICON.doc) + 'Export all notes as text</button>';
    html += '<p class="jr-intro">' + all.length + (all.length === 1 ? ' note' : ' notes') + ' so far. Add to any day below \u2014 it shows up on that day\u2019s page too.</p>';
    DAYS.forEach(function (day, i) {
      var dn = notesForDay(day.date);
      var d = parseD(day.date);
      var isToday = day.date === y;
      var isPast = day.date < y;
      html += '<div class="jr-day' + (isToday ? ' is-today' : '') + '" id="jr-' + day.date + '">' +
        '<span class="jr-day__d">' + WD[d.getDay()] + ' ' + MO[d.getMonth()] + ' ' + d.getDate() + (isToday ? ' \u00b7 Today' : '') + '</span>' +
        '<a class="jr-day__t" href="#/day/' + i + '">' + esc(day.title) + '</a></div>';
      html += '<div class="card notes' + (dn.length ? '' : ' notes--empty') + '">';
      if (dn.length) html += '<div class="note-list">' + dn.map(function (n) { return noteHTML(n, true); }).join("") + '</div>';
      else html += '<div class="note-empty">' + (isPast ? 'Nothing logged this day.' : isToday ? 'No notes yet today.' : 'Nothing here yet.') + '</div>';
      html += composerHTML(day.date, "ni-" + day.date);
      html += '</div>';
    });
    return wrapScreen("Trip journal", "Everyone\u2019s notes, by day", html, false);
  };

  /* ---------- export ---------- */
  function buildNotesText() {
    var lines = ["EASTBOUND \u2014 TRIP NOTES", "Kitchener \u2192 the Maritimes \u2192 home \u00b7 Jul 29 \u2013 Aug 15, 2026", ""];
    var any = false;
    DAYS.forEach(function (day) {
      var dn = notesForDay(day.date);
      if (!dn.length) return;
      any = true;
      var d = parseD(day.date);
      lines.push("== " + WD[d.getDay()] + " " + MO[d.getMonth()] + " " + d.getDate() + " \u00b7 " + day.title + " ==");
      dn.forEach(function (n) {
        var p = personById(n.author) || { name: "?" };
        lines.push("[" + fmtTime(n.ts) + "] " + p.name + ": " + n.text);
      });
      lines.push("");
    });
    if (!any) lines.push("(No notes yet.)");
    lines.push("\u2014 exported " + new Date().toLocaleString());
    return lines.join("\n");
  }
  window.__exportNotes = function () {
    var text = buildNotesText();
    try {
      var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "eastbound-trip-notes.txt";
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 600);
    } catch (e) {}
    // clipboard fallback so it's never a dead end
    try { if (navigator.clipboard) navigator.clipboard.writeText(text); } catch (e) {}
  };

  /* ---------- shared chrome ---------- */
  function sectionTitle(t) { return '<h2 class="section-h">' + esc(t) + '</h2>'; }
  function fullDate(y) { var d = parseD(y); return WD[d.getDay()] + " " + MO[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); }
  function shortStay(baseId) {
    var v = LODGING.stops[baseId];
    if (!v) return "";
    return v.status === "booked" ? STOPS[baseId].name : STOPS[baseId].name;
  }
  function miniRoute() {
    var html = '<div class="card"><div class="dd-plan">';
    TRIP.stops.forEach(function (s, i) {
      html += '<div class="dd-item"><div class="dd-time">' + esc(s.shortRange) + '</div>' +
        '<div class="dd-body"><div class="dd-title">' + (i + 1) + '. ' + esc(s.name) + '</div>' +
        '<div class="dd-note">' + esc(s.tag) + ' · ' + esc(s.nights) + '</div></div></div>';
    });
    html += '</div></div>';
    return html;
  }

  function wrapScreen(title, sub, body, showBack) {
    var u = currentUser();
    var me = u ? '<a class="appbar__me" href="#/me" aria-label="Account">' + avatar(u) + '</a>' : '';
    var bar = '<div class="appbar">' +
      (showBack ? '<button class="appbar__back" onclick="history.back()">‹</button>' : '') +
      '<div class="appbar__title"><small>' + esc(sub) + '</small>' + esc(title) + '</div>' +
      me +
      '</div>';
    return bar + '<div class="screen">' + body + '</div>';
  }

  /* ---------- tab bar ---------- */
  var TABS = [
    { id: "today", label: "Today", icon: ICON.today, route: "#/today" },
    { id: "days",  label: "Days", icon: ICON.route, route: "#/days" },
    { id: "stays", label: "Stays", icon: ICON.bed, route: "#/stays" },
    { id: "notes", label: "Journal", icon: ICON.note, route: "#/notes" },
    { id: "stats", label: "Stats", icon: ICON.chart, route: "#/stats" }
  ];
  function renderTabs(active) {
    var el = document.getElementById("tabbar");
    el.innerHTML = TABS.map(function (t) {
      return '<a class="tab' + (t.id === active ? ' active' : '') + '" href="' + t.route + '">' + svg(t.icon) + '<span>' + t.label + '</span></a>';
    }).join("");
  }

  /* ---------- router ---------- */
  function route() {
    var main = document.getElementById("main");
    var tabbar = document.getElementById("tabbar");
    // identity gate: no traveller chosen → full-screen login, no chrome
    if (!currentUser()) {
      main.innerHTML = '<div class="screen screen--login">' + app.login() + '</div>';
      if (tabbar) tabbar.style.display = "none";
      initGIS();
      renderSimbar();
      return;
    }
    if (tabbar) tabbar.style.display = "";

    var hash = location.hash.replace(/^#\/?/, "") || "today";
    var parts = hash.split("/");
    var name = parts[0];
    var arg = parts[1];
    var tab = "today", out;

    if (name === "days") { out = app.days(); tab = "days"; }
    else if (name === "day") { out = app.day(arg); tab = "days"; }
    else if (name === "stays") { out = app.stays(); tab = "stays"; }
    else if (name === "stay") { out = app.stay(arg); tab = "stays"; }
    else if (name === "stats") { out = app.stats(); tab = "stats"; }
    else if (name === "me") { out = app.me(); tab = ""; }
    else if (name === "notes") { out = app.notes(); tab = "notes"; }
    else if (name === "login") { location.hash = "#/today"; return; }
    else { out = app.today(); tab = "today"; }

    main.innerHTML = out;
    main.scrollTop = 0;
    var sc = main.querySelector(".screen");
    if (sc) sc.scrollTop = 0;
    if (pendingScrollDate && sc) {
      var anchor = document.getElementById("jr-" + pendingScrollDate);
      if (anchor) sc.scrollTop = Math.max(0, anchor.offsetTop - 8);
      pendingScrollDate = null;
    }
    renderTabs(tab);
    renderSimbar();
  }
  window.addEventListener("hashchange", route);

  /* ---------- status bar clock ---------- */
  function tickClock() {
    var el = document.getElementById("sb-time");
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M/i, "");
  }

  /* ---------- simulation bar ---------- */
  function renderSimbar() {
    var el = document.getElementById("simbar");
    if (!el) return;
    if (!simEnabled()) { el.style.display = "none"; el.innerHTML = ""; return; }
    el.style.display = "";
    var y = todayYMD();
    var st = tripState(y);
    var label;
    if (st.phase === "before") label = daysUntil(y) + "d pre-trip";
    else if (st.phase === "after") label = "Post-trip";
    else label = "Day " + (st.idx + 1) + " · " + MO[parseD(y).getDay() >= 0 ? parseD(y).getMonth() : 0] + " " + parseD(y).getDate();
    var over = !!simOverride();
    el.innerHTML =
      '<button onclick="__sim(-1)">‹ Prev</button>' +
      '<span class="sim-day">' + (over ? 'Simulating: ' : 'Live · ') + label + '</span>' +
      '<button onclick="__sim(1)">Next ›</button>' +
      (over ? '<button class="sim-reset" onclick="__simReset()">live</button>' : '');
  }
  window.__sim = function (dir) {
    var y = todayYMD();
    // step within an extended window: a few days before first → just after last
    var d = parseD(y);
    d.setDate(d.getDate() + dir);
    var min = parseD(DAYS[0].date); min.setDate(min.getDate() - 5);
    var max = parseD(DAYS[DAYS.length - 1].date); max.setDate(max.getDate() + 2);
    if (d < min) d = min; if (d > max) d = max;
    try { sessionStorage.setItem("eb-simdate", ymd(d)); } catch (e) {}
    location.hash = "#/today"; route();
  };
  window.__simReset = function () {
    try { sessionStorage.removeItem("eb-simdate"); } catch (e) {}
    location.hash = "#/today"; route();
  };
  window.__simToggle = function () {
    var on = simEnabled();
    try {
      if (on) { localStorage.setItem("eb-sim", "0"); sessionStorage.removeItem("eb-simdate"); }
      else { localStorage.setItem("eb-sim", "1"); }
    } catch (e) {}
    route();
  };

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    // one-time cleanup: an earlier build persisted the sim override in localStorage,
    // which could pin the app to a stale day. The override is session-only now.
    try { localStorage.removeItem("eb-simdate"); } catch (e) {}
    // Always open on the live current day (today on the trip), regardless of the
    // last screen viewed. In-session navigation still works via the tabs.
    location.hash = "#/today";
    route();
    tickClock();
    setInterval(tickClock, 30000);
  });
})();
