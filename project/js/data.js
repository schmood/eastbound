/* data.js — The Long Way East · a single-itinerary site for PLAN E.
   A STOPS catalog holds the magazine content + real coordinates for each place.
   ROUTE is the ordered drive Kitchener → Ottawa → Québec City → Fredericton →
   PEI → Cape Breton → Halifax (4-night hub + South Shore day trips) →
   Edmundston → Montréal → home. Dates are computed from a fixed
   Wed Jul 29, 2026 departure and verified against Plan-E-Itinerary.md.
   All image filenames are verified Wikimedia Commons files (served via wiki.js). */
(function (global) {
  function img(filename, width) { return global.wikiImg(filename, width || 1280); }

  /* ---------------- shared meta ---------------- */
  var META = {
    title: ["The Long Way", "East"],
    subtitle: "One family, seventeen nights, and the long coastal road to the Atlantic and home again.",
    heroImage: img("CabotTrail.jpg", 1280),
    home: { id: "home", name: "Kitchener", province: "Ontario", coord: [43.4516, -80.4925] },
    depart: "2026-07-29",
    nights: 17, homeBy: "Aug 15", km: "~4,400", cost: "~$8,900", stays: 8
  };

  /* ---------------- master stop catalog ---------------- */
  var STOPS = {
    ottawa: {
      name: "Ottawa", province: "Ontario", coord: [45.4215, -75.6972],
      tag: "The send-off",
      lede: "We start where the rivers meet — a capital of grand stone, long canals, and tulip-lined paths. A gentle first gear before the highway opens up.",
      body: "Ottawa eases everyone in. A morning on Parliament Hill, an afternoon at one of the great museums, the Rideau Canal at Dow's Lake, and a first dinner in the ByWard Market that already feels like vacation. By the time we point the car east, the city has done its job: shoulders down, maps out.",
      moments: [
        "\u201cCanada on the March\u201d on Parliament Hill at 10am",
        "Pick a museum or two — History, War, or Nature",
        "The Rideau Canal and Dow's Lake, or the Interzip line",
        "Poutine and people-watching in the ByWard Market"
      ],
      images: [{ f: "Centre Block - Parliament Hill.jpg", cap: "Parliament Hill above the Ottawa River" }],
      quote: "Every long drive deserves a grand front door.",
      area: "Downtown / ByWard Market"
    },
    quebec: {
      name: "Québec City", province: "Québec", coord: [46.8139, -71.2080],
      tag: "The walled city",
      lede: "The oldest walled city north of Mexico, stacked above the St. Lawrence — all copper roofs, ramparts, and lanes that feel lifted from another continent.",
      body: "Québec City is the last great flourish before the Maritimes. We ride the funicular to Petit-Champlain and Place Royale, promenade the Dufferin Terrace under the Château Frontenac, then give an afternoon to Montmorency Falls — cable car, suspension bridge, and zipline — before two unhurried European evenings.",
      moments: [
        "Ride the funicular down to Quartier Petit-Champlain",
        "Promenade the Dufferin Terrace beneath the Château",
        "Montmorency Falls — cable car, footbridge and zipline",
        "A long Québécois dinner inside the old walls"
      ],
      images: [
        { f: "Château Frontenac at night, Quebec City, Canada 2.jpg", cap: "Château Frontenac above the St. Lawrence" },
        { f: "Old Quebec.jpg", cap: "The lanes of Old Québec" }
      ],
      quote: "Europe, somehow, on the St. Lawrence.",
      area: "Inside the old walls"
    },
    fredericton: {
      name: "Fredericton", province: "New Brunswick", coord: [45.9636, -66.6431],
      tag: "Riverside breather",
      lede: "A genteel capital on the Saint John River — leafy, walkable, and exactly the right place to break the long drive into the Maritimes.",
      body: "Fredericton is a one-night exhale on the way to the island. We come down the Saint John River valley, stretch our legs on the riverfront Green, wander the old Garrison District, and grab supper at the night market before an early night and the run to PEI.",
      moments: [
        "Stroll the Saint John River trail at golden hour",
        "Wander the historic Garrison District",
        "Browse the Garrison Night Market for supper",
        "An early night before the bridge to the island"
      ],
      images: [{ f: "New Brunswick Legislature, Fredericton (38053485475).jpg", cap: "The New Brunswick Legislature, Fredericton" }],
      quote: "A quiet river town to catch our breath.",
      area: "Downtown / riverfront"
    },
    pei: {
      name: "Prince Edward Island", province: "Prince Edward Island", coord: [46.4960, -63.3790],
      tag: "Red roads & green gables",
      lede: "Across the soaring Confederation Bridge to the gentlest province — red-dirt roads, dune-backed beaches, and the warmest saltwater of the whole trip.",
      body: "PEI is the trip's great Atlantic exhale — three full nights on the north shore. We cross the 13-kilometre bridge (free inbound; we leave by ferry), settle into a waterfront cottage near Cavendish, and trade the highway for red clay backroads, Green Gables, the Greenwich dunes, and a slow prime beach day on the warmest water around.",
      moments: [
        "Cross the 12.9 km Confederation Bridge onto the Island",
        "Green Gables Heritage Place and the Greenwich dune boardwalk",
        "An evening in Charlottetown — waterfront, COWS, seafood",
        "A slow beach day on the warm North Shore or Basin Head sand"
      ],
      images: [
        { f: "Cavendish Beach.jpg", cap: "Dunes and red sand at Cavendish" },
        { f: "Confederation Bridge.jpg", cap: "The Confederation Bridge to the island" }
      ],
      quote: "An island that runs on island time.",
      area: "New Glasgow / Cavendish"
    },
    capebreton: {
      name: "Cape Breton", province: "Nova Scotia", coord: [46.6440, -60.9460],
      tag: "The Cabot Trail",
      lede: "The trip's crescendo: the Cabot Trail, carved into the cliffs of Cape Breton, where the highlands fall straight into the sea and whales surface offshore.",
      body: "Two nights based at Petit Étang, right at the Trail's Chéticamp gate, with one big scenic day to do it all: climb and dive along the cliff-edge Cabot Trail, walk the Skyline Trail out over the ocean, and take a whale-watching tour from Pleasant Bay. The open Atlantic the whole way.",
      moments: [
        "Drive the cliff-edge Cabot Trail through the Highlands",
        "Hike the Skyline Trail out over the ocean (reserve parking)",
        "Whale-watching from Pleasant Bay",
        "Optional: step into the 1700s at the Fortress of Louisbourg"
      ],
      images: [
        { f: "Cape Breton Highlands.jpg", cap: "The Cabot Trail through the Highlands" },
        { f: "Ingonish Beach.jpg", cap: "Where the trail meets the sea" }
      ],
      quote: "The road we'll still be talking about at home.",
      area: "Petit Étang / Cabot Trail"
    },
    halifax: {
      name: "Halifax", province: "Nova Scotia", coord: [44.6488, -63.5752],
      tag: "The hub — one base, four nights",
      lede: "Our one unpacked base for four nights — the harbour city itself plus three full days off a single hotel, with the whole South Shore as easy day trips and nothing to repack.",
      body: "Halifax is the settled heart of the trip — four nights, three full days, one bed. A city day for the boardwalk, the Citadel's noon gun and the Public Gardens; a South Shore loop day; and a beach-or-flex day with no big drive. The strongest single anchor of the whole route.",
      moments: [
        "A full city day — boardwalk, Citadel noon gun, Public Gardens",
        "A South Shore loop day — no packing, back by dark",
        "A beach / flex day: a Halifax-area beach or harbour tour",
        "Four nights, one base, zero mid-stay moves"
      ],
      images: [
        { f: "Halifax skyline.jpg", cap: "Halifax harbour and skyline" },
        { f: "Halifax Citadel.jpg", cap: "The star fort on Citadel Hill" },
        { f: "Halifax Public Gardens.jpg", cap: "The Victorian Public Gardens" }
      ],
      quote: "Unpack once; let the coast come to you.",
      area: "Downtown / waterfront",
      daytrips: [
        { name: "Peggy's Cove", note: "The iconic lighthouse on the granite — ~45 min out", coord: [44.4936, -63.9156] },
        { name: "Mahone Bay", note: "Three churches mirrored on the waterfront", coord: [44.4490, -64.3817] },
        { name: "Lunenburg", note: "UNESCO old town, Fisheries Museum & Blue Rocks", coord: [44.3776, -64.3074] }
      ]
    },
    edmundston: {
      name: "Edmundston", province: "New Brunswick", coord: [47.3737, -68.3251],
      tag: "The long way back",
      lede: "A francophone river town up in New Brunswick's northwest panhandle — our overnight pillow on the long haul home.",
      body: "After the coast, the drive turns inland and west. Edmundston, where the Madawaska meets the Saint John, is a warm Brayon stopover: a towering stone cathedral, a quiet downtown, a pool evening at the hotel, and a good night's sleep before the river-valley run to Montréal.",
      moments: [
        "See the grand stone Cathedral of the Immaculate Conception",
        "Stretch out by the New Brunswick Botanical Garden",
        "A Brayon supper in the Republic of Madawaska",
        "A pool evening, then rest for the drive to Montréal"
      ],
      images: [{ f: "Cathédrale de l'Immaculée-Conception d'Edmundston.JPG", cap: "Cathedral of the Immaculate Conception, Edmundston" }],
      quote: "One last river town on the way home.",
      area: "Downtown"
    },
    montreal: {
      name: "Montréal", province: "Québec", coord: [45.5019, -73.5674],
      tag: "The city finale",
      lede: "Cobblestones and café tables to close the loop — two nights in the city that eats late, saved for the drive home.",
      body: "We end where the cities are biggest. An evening getting lost in Vieux-Montréal as the Old Port lights up, then a full day of the good stuff — Jean-Talon Market in the morning, the cobalt-and-gold nave of Notre-Dame, the Mont-Royal lookout, bikes along the Lachine Canal — and one celebratory last dinner before the leg west.",
      moments: [
        "Evening stroll through the Old Port as the lights come on",
        "A food-lover's morning at Jean-Talon Market",
        "Notre-Dame's nave, then the view from Mont-Royal",
        "Bike the Lachine Canal and toast the trip at dinner"
      ],
      images: [
        { f: "Old Port of Montreal.jpg", cap: "The Old Port and city skyline" },
        { f: "Exterior of Notre-Dame de Montréal Basilica.jpg", cap: "Notre-Dame Basilica" }
      ],
      quote: "Save the biggest city for last.",
      area: "Vieux-Montréal"
    }
  };

  /* ---------------- the route (ordered) ---------------- */
  var ROUTE = [
    { id: "ottawa", nights: 2 },
    { id: "quebec", nights: 2 },
    { id: "fredericton", nights: 1 },
    { id: "pei", nights: 3 },
    { id: "capebreton", nights: 2 },
    { id: "halifax", nights: 4 },
    { id: "edmundston", nights: 1 },
    { id: "montreal", nights: 2 }
  ];

  /* ---------------- drive legs (keyed "from>to") ---------------- */
  var LEGS = {
    "home>ottawa":        { hrs: "5.5–6 hr", km: "~550 km", note: "Leaving home — east across Ontario to the capital." },
    "ottawa>quebec":      { hrs: "4.5 hr",   km: "~450 km", note: "Up the St. Lawrence to the old walled city." },
    "quebec>fredericton": { hrs: "5.5–6 hr", km: "~565 km", note: "South into New Brunswick and the Saint John valley." },
    "fredericton>pei":    { hrs: "4–4.5 hr", km: "~340 km", note: "East and out over the Confederation Bridge — free inbound; we leave by ferry." },
    "pei>capebreton":     { hrs: "big travel day", km: "~250 km + 75-min ferry", note: "The 10:00 AM Wood Islands → Caribou ferry, then ~4 hr up to Petit Étang.", ferry: true },
    "capebreton>halifax": { hrs: "3.5–4 hr", km: "~310 km", note: "Down from the cliffs to the big harbour." },
    "halifax>edmundston": { hrs: "6.5 hr",   km: "~640 km", note: "The long highway day back across Nova Scotia and up through New Brunswick." },
    "edmundston>montreal":{ hrs: "6 hr",     km: "~530 km", note: "Down the river valley and along the St. Lawrence into Montréal." },
    "montreal>home":      { hrs: "6.5–7 hr", km: "~640 km", note: "The last leg home, full of stories." }
  };

  var BUDGET = [
    { label: "Lodging", detail: "17 nights · 8 stays", amount: "$4,200–4,900" },
    { label: "Fuel", detail: "≈4,400 km", amount: "$880" },
    { label: "Food & dining", detail: "out most nights", amount: "$2,950" },
    { label: "Attractions & tours", detail: "Cabot, whales, Citadel", amount: "$880" },
    { label: "Ferry & bridge", detail: "bridge free in · ferry off PEI", amount: "$90" }
  ];
  var BUDGET_TOTAL = "≈ $8,900";

  var CHECKLIST = [
    "Lodging all booked — 8 stays from Ottawa to Edmundston ✓",
    "Wood Islands ferry ✓ and Skyline sunset-block parking ✓ locked in",
    "Book the Montréal hotel for the finale (Aug 13–15) — refundable",
    "Reserve the Aug 7 whale-watching tour (Pleasant Bay), midday sailing",
    "Download offline maps — coverage thins on the back roads",
    "Layers + rain shell — the Atlantic makes its own weather"
  ];

  /* ---------------- expansion: build the renderable itinerary ---------------- */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function fmtDay(d) { return WEEKDAYS[d.getDay()] + " " + MONTHS[d.getMonth()] + " " + d.getDate(); }   // "Wed Jul 29"
  function fmtShort(d) { return MONTHS[d.getMonth()] + " " + d.getDate(); }                              // "Jul 29"

  function expand() {
    var depart = new Date(META.depart + "T00:00:00");
    var cursor = new Date(depart.getTime());
    var stops = ROUTE.map(function (r, i) {
      var base = STOPS[r.id];
      var checkIn = new Date(cursor.getTime());
      var checkOut = addDays(checkIn, r.nights);
      var s = {
        id: r.id, n: i + 1,
        name: base.name, province: base.province, coord: base.coord,
        tag: base.tag, lede: base.lede, body: base.body, moments: base.moments,
        images: base.images, quote: base.quote, area: base.area,
        daytrips: base.daytrips || null,
        nightsNum: r.nights,
        checkIn: checkIn, checkOut: checkOut,
        days: fmtDay(checkIn) + " → " + fmtDay(checkOut),
        shortRange: r.nights <= 1 ? fmtShort(checkIn) : fmtShort(checkIn) + " – " + checkOut.getDate(),
        nights: r.nights + (r.nights === 1 ? " night · stopover" : " nights")
      };
      cursor = addDays(cursor, r.nights);
      return s;
    });

    function leg(fromId, toId, label, on, opts) {
      var k = fromId + ">" + toId;
      var info = LEGS[k] || { hrs: "", km: "", note: "" };
      var fromName = fromId === "home" ? META.home.name : STOPS[fromId].name;
      var toName = toId === "home" ? META.home.name : STOPS[toId].name;
      return {
        from: fromName, to: toName, hrs: info.hrs, km: info.km, note: info.note,
        label: label, on: on, ferry: !!info.ferry
      };
    }
    var first = ROUTE[0].id, last = ROUTE[ROUTE.length - 1].id;
    var startDrive = leg("home", first, "Setting out", fmtDay(depart));
    var endDrive = leg(last, "home", "The drive home", fmtDay(stops[stops.length - 1].checkOut));
    var drives = [];
    for (var i = 0; i < ROUTE.length - 1; i++) {
      drives.push(leg(ROUTE[i].id, ROUTE[i + 1].id, null, fmtDay(stops[i + 1].checkIn)));
    }

    return {
      id: "E",
      name: "The Long Way East",
      nightsTotal: META.nights, homeBy: META.homeBy, km: META.km, cost: META.cost, stays: META.stays,
      stats: [
        { value: String(META.nights), unit: "nights", label: "home by " + META.homeBy },
        { value: META.km, unit: "km", label: "of driving" },
        { value: META.cost, unit: "", label: "family of four, est." },
        { value: String(META.stays), unit: "", label: "lodging bases" }
      ],
      stops: stops,
      startDrive: startDrive, endDrive: endDrive, drives: drives,
      planning: { budget: BUDGET, budgetTotal: BUDGET_TOTAL, checklist: CHECKLIST }
    };
  }

  global.TRIP_META = META;
  global.STOPS = STOPS;
  global.expandTrip = expand;
  global.tripImg = img;
})(window);
