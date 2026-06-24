/* journey.js — renders the single Plan E itinerary: hero, route map heading,
   progress nav, immersive stop sections, dated drive interstitials, the planning
   hub, scroll reveals, lightbox, and checklist persistence. No plan switching. */
(function () {
  var imgFor = window.tripImg;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ACTIVE = null;

  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ---------- HERO ---------- */
  function buildHero(trip) {
    var M = window.TRIP_META;
    var bg = document.querySelector(".hero__bg");
    bg.style.backgroundImage = "url('" + M.heroImage + "')";
    document.querySelector(".hero h1").innerHTML = esc(M.title[0]) + " <em>" + esc(M.title[1]) + "</em>";
    document.querySelector(".hero__sub").textContent = M.subtitle;

    var badge = document.getElementById("heroPlan");
    badge.innerHTML =
      '<span class="hero__plan-key">Jul 29 – Aug 15, 2026</span>' +
      '<span class="hero__plan-name">Kitchener → the Maritimes → home</span>';

    var stats = document.querySelector(".hero__stats");
    stats.innerHTML = "";
    trip.stats.forEach(function (s) {
      stats.appendChild(h("div", "hero__stat",
        '<div class="v">' + esc(s.value) + (s.unit ? '<span>' + esc(s.unit) + '</span>' : '') + '</div>' +
        '<div class="l">' + esc(s.label) + '</div>'));
    });
  }

  /* ---------- MEDIA ---------- */
  function frame(image, kind, tab) {
    var fig = h("figure", "frame " + kind);
    if (tab) fig.appendChild(h("div", "frame__tab", esc(tab)));
    var im = document.createElement("img");
    im.loading = "lazy"; im.decoding = "async";
    im.src = imgFor(image.f, 1280);
    im.alt = image.cap;
    im.addEventListener("click", function () { openLB(imgFor(image.f, 1280), image.cap); });
    fig.appendChild(im);
    fig.appendChild(h("figcaption", null, esc(image.cap)));
    return fig;
  }
  function buildMedia(stop) {
    var media = h("div", "stop__media reveal d1");
    var imgs = stop.images;
    media.appendChild(frame(imgs[0], "frame--main", "Stop " + (stop.n < 10 ? "0" + stop.n : stop.n)));
    if (imgs.length > 1) {
      var stack = h("div", "stop__stack");
      stack.style.marginTop = "16px";
      for (var i = 1; i < imgs.length; i++) stack.appendChild(frame(imgs[i], "frame--sec"));
      media.appendChild(stack);
    }
    return media;
  }

  /* ---------- STOP ---------- */
  function buildStop(stop, idx) {
    var sec = h("section", "stop" + (idx % 2 ? " flip" : ""));
    sec.id = "stop-" + stop.id;
    sec.setAttribute("data-screen-label", "Stop " + stop.n + " · " + stop.name);
    sec.setAttribute("data-stop", stop.id);
    var grid = h("div", "stop__grid wrap");
    grid.appendChild(buildMedia(stop));
    var txt = h("div", "stop__text");
    txt.appendChild(h("div", "stop__head reveal",
      '<div class="stop__n">' + (stop.n < 10 ? "0" + stop.n : stop.n) + '</div>' +
      '<div class="stop__meta">' +
        '<span class="stop__prov">' + esc(stop.province) + '</span>' +
        '<span class="stop__days">' + esc(stop.days) + ' · ' + esc(stop.nights) + '</span>' +
      '</div>'));
    txt.appendChild(h("h2", "reveal", esc(stop.name)));
    txt.appendChild(h("p", "stop__tag reveal", esc(stop.tag)));
    txt.appendChild(h("p", "stop__lede reveal", esc(stop.lede)));
    txt.appendChild(h("p", "stop__body reveal", esc(stop.body)));
    var ul = h("ul", "stop__moments reveal d1");
    stop.moments.forEach(function (m, i) {
      ul.appendChild(h("li", null, '<span class="mi">' + (i + 1) + '</span><span>' + esc(m) + '</span>'));
    });
    txt.appendChild(ul);
    if (stop.daytrips && stop.daytrips.length) {
      var dt = h("div", "stop__daytrips reveal d1");
      var dthtml = '<span class="stop__daytrips-h">Day trips from here</span><ul>';
      stop.daytrips.forEach(function (d) {
        dthtml += '<li><b>' + esc(d.name) + '</b><span>' + esc(d.note) + '</span></li>';
      });
      dthtml += '</ul>';
      dt.innerHTML = dthtml;
      txt.appendChild(dt);
    }
    txt.appendChild(h("blockquote", "stop__quote reveal", esc(stop.quote)));
    grid.appendChild(txt);
    sec.appendChild(grid);
    return sec;
  }

  /* ---------- DRIVE ---------- */
  function buildDrive(d) {
    var sec = h("section", "drive");
    var labelText = d.label ? (esc(d.on) + ' · ' + esc(d.label)) : esc(d.on);
    var carDash =
      '<svg width="120" height="26" viewBox="0 0 120 26" class="drive__seg" aria-hidden="true">' +
      '<path class="drive__dash" d="M4 13 H100"/>' +
      '<path class="drive__car" d="M104 13 l-9 -5 v10 z"/>' +
      '</svg>';
    var ferry = d.ferry ? '<div class="drive__ferry"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 L6.5 12 L13 4"/></svg>Ferry booked · 10:00 AM</div>' : '';
    sec.appendChild(h("div", "drive__inner wrap",
      '<div class="drive__label">' + labelText + '</div>' +
      '<div class="drive__route"><b>' + esc(d.from) + '</b>' + carDash + '<b>' + esc(d.to) + '</b></div>' +
      '<div class="drive__stat"><span><b>' + esc(d.hrs) + '</b> drive</span><span><b>' + esc(d.km) + '</b></span></div>' +
      '<div class="drive__note">' + esc(d.note) + ferry + '</div>'));
    return sec;
  }

  /* ---------- PLANNING ---------- */
  function buildPlanning(trip) {
    var p = trip.planning;
    var sec = h("section", "plan");
    sec.id = "plan";
    sec.setAttribute("data-screen-label", "Planning");
    var wrap = h("div", "wrap");
    wrap.appendChild(h("div", "plan__head reveal",
      '<span class="eyebrow">Before we go</span>' +
      '<h2>The practical bits</h2>' +
      '<p>What\u2019s booked, what\u2019s left, what it might cost, and the short list that keeps a trip this long running smoothly.</p>'));
    var grid = h("div", "plan__grid");
    // panel 1 — booking tracker (filled by lodging.js injectHub)
    grid.appendChild(h("div", "panel reveal"));

    // panel 2 — short list + budget
    var right = h("div", "panel reveal d1");
    right.appendChild(h("h3", null, "The short list"));
    right.appendChild(h("p", "panel__sub", "Tap to check off — saved on this device"));
    var check = h("ul", "check");
    p.checklist.forEach(function (item, i) {
      check.appendChild(h("li", null,
        '<label><input type="checkbox" data-ck="trip-' + i + '">' +
        '<span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5 L6.5 12 L13 4"/></svg></span>' +
        '<span class="txt">' + esc(item) + '</span></label>'));
    });
    right.appendChild(check);
    var brows = p.budget.map(function (b) {
      return '<div class="budget__row"><span class="lab">' + esc(b.label) +
        '<span class="det">' + esc(b.detail) + '</span></span><span class="amt">' + esc(b.amount) + '</span></div>';
    }).join("");
    right.appendChild(h("div", "budget",
      '<h3 style="margin-bottom:4px">Rough budget</h3>' +
      '<p class="panel__sub">Illustrative, family of four</p>' +
      brows +
      '<div class="budget__total"><span class="lab">Estimated total</span><span class="amt">' + esc(p.budgetTotal) + '</span></div>' +
      '<p class="budget__note">A planning sketch, not a quote — actual costs swing with season and tastes.</p>'));
    grid.appendChild(right);
    wrap.appendChild(grid);
    wrap.appendChild(h("div", "plan__foot reveal",
      '<button class="btn-print" id="printBtn">Print this itinerary</button>' +
      '<p class="plan__sign">Can\u2019t wait to show you all where we\u2019re going.</p>'));
    sec.appendChild(wrap);
    return sec;
  }

  /* ---------- JOURNEY (stops + drives + planning) ---------- */
  function renderJourney(trip) {
    var main = document.getElementById("journey");
    main.innerHTML = "";
    if (trip.startDrive) main.appendChild(buildDrive(trip.startDrive));
    trip.stops.forEach(function (s, i) {
      main.appendChild(buildStop(s, i));
      if (i < trip.drives.length) main.appendChild(buildDrive(trip.drives[i]));
    });
    if (trip.endDrive) main.appendChild(buildDrive(trip.endDrive));
    main.appendChild(buildPlanning(trip));
    var pb = document.getElementById("printBtn");
    if (pb) pb.addEventListener("click", function () { window.print(); });
    wireChecklist();
  }

  /* map section heading */
  function renderMapHead() {
    var head = document.querySelector(".map-sec__head");
    if (!head) return;
    head.innerHTML =
      '<span class="eyebrow">The route</span>' +
      '<h2>Kitchener to the Atlantic, the long way</h2>' +
      '<p>One loop east and back — out along the spine to PEI and Cape Breton, four settled nights in Halifax, then home by way of Montréal. Tap any stop to jump ahead.</p>';
  }

  /* ---------- NAV DOTS ---------- */
  function buildNavDots(trip) {
    var track = document.querySelector(".nav__track");
    track.innerHTML = "";
    trip.stops.forEach(function (s, i) {
      if (i > 0) track.appendChild(h("span", "nav__seg"));
      var b = document.createElement("button");
      b.className = "nav__dot";
      b.setAttribute("data-stop", s.id);
      b.setAttribute("data-tip", s.n + ". " + s.name);
      b.setAttribute("aria-label", "Jump to " + s.name);
      b.addEventListener("click", function () { window.goToStop(s.id); });
      track.appendChild(b);
    });
  }

  /* ---------- LIGHTBOX ---------- */
  var lb;
  function openLB(src, cap) {
    lb.querySelector("img").src = src;
    lb.querySelector(".lb__cap").textContent = cap || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLB() { lb.classList.remove("open"); document.body.style.overflow = ""; }

  /* ---------- CHECKLIST PERSIST ---------- */
  function wireChecklist() {
    var KEY = "ecj-checklist-E";
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
    document.querySelectorAll("[data-ck]").forEach(function (cb) {
      var k = cb.getAttribute("data-ck");
      if (saved[k]) cb.checked = true;
      cb.addEventListener("change", function () {
        saved[k] = cb.checked;
        try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
      });
    });
  }

  /* ---------- REVEAL ---------- */
  function revealEl(el) {
    if (reduce) { el.classList.add("in"); return; }
    var delay = el.classList.contains("d3") ? 240 : el.classList.contains("d2") ? 160 : el.classList.contains("d1") ? 80 : 0;
    var dur = 700, start = Date.now() + delay;
    el.style.opacity = "0"; el.style.transform = "translateY(26px)";
    el.classList.add("in");
    var iv = setInterval(function () {
      var t = (Date.now() - start) / dur;
      if (t < 0) return;
      if (t >= 1) { el.style.opacity = ""; el.style.transform = ""; clearInterval(iv); return; }
      var e = 1 - Math.pow(1 - t, 3);
      el.style.opacity = e.toFixed(3);
      el.style.transform = "translateY(" + (26 * (1 - e)).toFixed(1) + "px)";
    }, 16);
  }
  function checkReveals() {
    var vh = window.innerHeight;
    var els = document.querySelectorAll(".reveal:not(.in)");
    for (var i = 0; i < els.length; i++) {
      if (els[i].getBoundingClientRect().top < vh * 0.92) revealEl(els[i]);
    }
  }

  /* ---------- SCROLL WIRING ---------- */
  function wireScroll() {
    var nav = document.querySelector(".nav");
    var heroBg = document.querySelector(".hero__bg");
    var current = -1;
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle("show", y > window.innerHeight * 0.7);
      if (!reduce && y < window.innerHeight) heroBg.style.transform = "translateY(" + (y * 0.28) + "px)";

      var dots = document.querySelectorAll(".nav__dot");
      var stops = ACTIVE ? ACTIVE.stops : [];
      var mid = y + window.innerHeight * 0.45;
      var idx = -1;
      for (var i = 0; i < stops.length; i++) {
        var el = document.getElementById("stop-" + stops[i].id);
        if (el && el.offsetTop <= mid) idx = i;
      }
      if (idx !== current) {
        current = idx;
        dots.forEach(function (d, i) {
          d.classList.toggle("active", i === idx);
          d.classList.toggle("done", i < idx);
        });
        if (idx >= 0 && stops[idx] && window.mapSetActive) window.mapSetActive(stops[idx].id);
      }
      checkReveals();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", checkReveals, { passive: true });
    setInterval(onScroll, 80);
    onScroll();
    window.__forceScroll = onScroll;
  }

  window.goToStop = function (id) {
    var el = document.getElementById("stop-" + id);
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    ACTIVE = window.expandTrip();
    window.ACTIVE_TRIP = ACTIVE;

    buildHero(ACTIVE);
    renderMapHead();
    buildNavDots(ACTIVE);
    renderJourney(ACTIVE);

    lb = document.querySelector(".lb");
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb__x")) closeLB(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLB(); });

    wireScroll();

    if (window.buildActiveMap) window.buildActiveMap(ACTIVE);
    if (window.buildLodging) window.buildLodging();

    if (window.__forceScroll) window.__forceScroll();
  });
})();
