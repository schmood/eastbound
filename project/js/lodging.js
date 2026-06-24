/* lodging.js — renders the "Where we'll stay" block under each stop (booked or
   to-book) and the booking tracker in the planning hub. Single itinerary (Plan E);
   no plan switching. Booked items are confirmed ✓; to-book items show an estimate,
   a curated shortlist, and a date-filtered search link. */
(function () {
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function money(n) { return "$" + Number(n).toLocaleString("en-CA"); }

  function statusBadge(status) {
    if (status === "booked") {
      return '<span class="lg-badge-status is-booked">' +
        '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 L6.5 12 L13 4"/></svg>Booked</span>';
    }
    return '<span class="lg-badge-status is-tobook">To book</span>';
  }

  /* ---------- booked card ---------- */
  function bookedCardHTML(b, nights) {
    var per = nights > 1 ? "≈ " + money(Math.round(b.total / nights)) + "/nt" : "1 night";
    return '<div class="lg-booked">' +
      '<div class="lg-booked__mark"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 L6.5 12 L13 4"/></svg></div>' +
      '<div class="lg-booked__body">' +
        '<div class="lg-booked__top">' +
          '<span class="lg-booked__name">' + esc(b.name) + '</span>' +
          '<span class="lg-badge">' + esc(b.type) + '</span>' +
        '</div>' +
        '<p class="lg-booked__detail">' + esc(b.detail) + '</p>' +
        '<p class="lg-booked__why">' + esc(b.note) + '</p>' +
      '</div>' +
      '<div class="lg-booked__side">' +
        '<div class="lg-price"><b>' + money(b.total) + '</b><span>' + per + '</span></div>' +
        (b.url ? '<a class="lg-view" href="' + esc(b.url) + '" target="_blank" rel="noopener">View&nbsp;↗</a>' : '<span class="lg-confirmed">Confirmed</span>') +
      '</div>' +
    '</div>';
  }

  /* ---------- candidate row (to-book) ---------- */
  function candidateHTML(o) {
    return '<div class="lg-cand">' +
      '<div class="lg-cand__main">' +
        '<div class="lg-cand__top">' +
          (o.pick ? '<span class="lg-pick">★ Our pick</span>' : '') +
          '<span class="lg-cand__name">' + esc(o.name) + '</span>' +
          '<span class="lg-badge">' + esc(o.type) + '</span>' +
        '</div>' +
        '<p class="lg-cand__why">' + esc(o.note) + '</p>' +
      '</div>' +
      (o.rating ? '<span class="lg-rate">' + esc(o.rating) + (o.count ? ' <span>(' + esc(o.count) + ')</span>' : '') + '</span>' : '<span class="lg-rate lg-rate--none">—</span>') +
      '<div class="lg-price"><b>' + money(o.total) + '</b><span>est. total</span></div>' +
      '<a class="lg-view" href="' + esc(o.url) + '" target="_blank" rel="noopener">View&nbsp;↗</a>' +
    '</div>';
  }

  /* ---------- per-stop block ---------- */
  function buildStopBlock(stopId) {
    var v = window.LODGING.stops[stopId];
    if (!v) return null;
    var div = document.createElement("div");
    div.className = "lodge reveal d1";
    var nlabel = v.nights + (v.nights === 1 ? " night" : " nights");
    var html =
      '<div class="lodge__head">' +
        '<span class="eyebrow">Where we\u2019ll stay</span>' +
        '<span class="lodge__head-right">' + statusBadge(v.status) +
          '<span class="lodge__dates">' + esc(v.dates) + ' · ' + nlabel + '</span>' +
        '</span>' +
      '</div>';

    if (v.status === "booked") {
      html += bookedCardHTML(v.booked, v.nights);
    } else {
      if (v.intro) html += '<p class="lodge__intro">' + esc(v.intro) + '</p>';
      html += '<p class="lodge__est">Estimate <b>' + esc(v.est) + '</b> for the stay · a researched shortlist to start from:</p>';
      html += '<div class="lodge__list">' + v.candidates.map(candidateHTML).join("") + '</div>';
      html += '<a class="lodge__search" href="' + esc(v.searchUrl) + '" target="_blank" rel="noopener">' +
        esc(v.searchLabel) + ' ↗</a>';
    }
    html += '<p class="lodge__fine">Prices CAD stay totals · pulled ' + esc(window.LODGING.pulled) + ' — recheck before booking</p>';
    div.innerHTML = html;
    return div;
  }

  function injectStops() {
    document.querySelectorAll("#journey .stop[data-stop]").forEach(function (sec) {
      var old = sec.querySelector(".lodge");
      if (old) old.remove();
      var block = buildStopBlock(sec.getAttribute("data-stop"));
      if (block) {
        var wrap = document.createElement("div");
        wrap.className = "wrap";
        wrap.appendChild(block);
        sec.appendChild(wrap);
      }
    });
  }

  /* ---------- planning hub: the booking tracker ---------- */
  function injectHub() {
    var panel = document.querySelector("#plan .plan__grid .panel");
    if (!panel || !window.ACTIVE_TRIP) return;
    var trip = window.ACTIVE_TRIP;
    var L = window.LODGING;

    function row(name, dates, statusVal, who, amount, url) {
      var badge = statusVal === "booked"
        ? '<span class="lgh-st is-booked">✓ Booked</span>'
        : '<span class="lgh-st is-tobook">To book</span>';
      var link = url ? '<a class="lg-view" href="' + esc(url) + '" target="_blank" rel="noopener">↗</a>' : '';
      return '<tr>' +
        '<td><a class="lgh-stop" href="#stop-' + esc(name.id || "") + '">' + esc(name.label) + '</a></td>' +
        '<td class="lgh-dates">' + esc(dates) + '</td>' +
        '<td class="lgh-pick">' + esc(who) + '</td>' +
        '<td class="lgh-amt">' + esc(amount) + '</td>' +
        '<td>' + badge + '</td>' +
        '<td>' + link + '</td>' +
      '</tr>';
    }

    var rows = "";
    trip.stops.forEach(function (s) {
      var v = L.stops[s.id];
      if (!v) return;
      if (v.status === "booked") {
        rows += row({ id: s.id, label: s.name }, v.dates, "booked", v.booked.name, money(v.booked.total), v.booked.url);
      } else {
        rows += row({ id: s.id, label: s.name }, v.dates, "tobook", "— shortlist ready", v.est, v.searchUrl);
      }
    });
    // transport + tours
    L.extras.forEach(function (e) {
      var amt = e.status === "booked" ? "—" : (e.est || "—");
      rows += row({ id: "", label: e.label }, e.when, e.status, e.kind, amt, e.searchUrl);
    });

    panel.innerHTML =
      '<h3>Booking tracker</h3>' +
      '<p class="panel__sub">What\u2019s locked in, and what\u2019s left to book</p>' +
      '<table class="lgh"><thead><tr><th>Stop</th><th>Dates</th><th>Pick</th><th>Total</th><th>Status</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<div class="lgh-total"><span class="lab">Booked so far</span>' +
        '<span class="amt">' + money(L.bookedTotal) + '</span></div>' +
      '<p class="lgh-band">Plus an estimated ' + money(L.toBookEst.lo) + '–' + money(L.toBookEst.hi) +
        ' for the last two pieces — the Montréal hotel and the whale tour.</p>' +
      '<div class="lgh-callout"><span class="lgh-callout__k">Almost everything’s locked</span>' +
        '<p>All eight lodging nights, the ferry, and the Skyline sunset-block parking are confirmed. Only the Montréal finale hotel and the Aug 7 whale tour are left — both have ample supply; book refundable when convenient.</p>' +
      '</div>' +
      '<p class="lodge__fine">Prices CAD stay totals · pulled ' + esc(L.pulled) + ' — recheck before booking</p>';
  }

  /* ---------- public: build the lodging layer ---------- */
  window.buildLodging = function () {
    injectStops();
    injectHub();
    if (window.__forceScroll) window.__forceScroll();
  };
})();
