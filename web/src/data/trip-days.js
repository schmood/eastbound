/* trip-days.js — the day-by-day plan for the companion app.
   18 days, Wed Jul 29 → Sat Aug 15, 2026. Each day has a base (where we sleep),
   a primary waypoint (the next place to drive to), an optional drive leg, and a
   short ordered plan. Coordinates are embedded so navigation works offline. */

// handy coordinates (lat, lng)
const C = {
  home:         [43.4516, -80.4925], // Kitchener
  ottawa:       [45.4215, -75.6972],
  quebec:       [46.8139, -71.2080],
  montmorency:  [46.8906, -71.1475],
  fredericton:  [45.9636, -66.6431],
  confedBridge: [46.2386, -63.7757],
  cavendish:    [46.4925, -63.3829],
  greenGables:  [46.4912, -63.3787],
  greenwich:    [46.4570, -62.6710],
  charlottetown:[46.2382, -63.1311],
  newGlasgowPEI:[46.4960, -63.3790],
  woodIslands:  [45.9519, -62.7597], // PEI ferry terminal
  caribou:      [45.7986, -62.6817], // NS ferry terminal
  petitEtang:   [46.6500, -60.9700],
  skyline:      [46.7515, -60.8480],
  pleasantBay:  [46.8330, -60.7980],
  halifax:      [44.6488, -63.5752],
  peggysCove:   [44.4936, -63.9156],
  mahoneBay:    [44.4490, -64.3817],
  lunenburg:    [44.3776, -64.3074],
  edmundston:   [47.3737, -68.3251],
  montreal:     [45.5019, -73.5674],
  jeanTalon:    [45.5360, -73.6150],
  notreDame:    [45.5045, -73.5562],
  montRoyal:    [45.5048, -73.5872]
};

function geo(name, coord) { return { name, coord }; }

export const TRIP_COORDS = C;

export const TRIP_DAYS = [
  {
    date: "2026-07-29", base: "ottawa", kind: "drive",
    title: "Kitchener → Ottawa", summary: "The send-off — east to the capital, dinner in the ByWard Market.",
    waypoint: geo("DoubleTree Ottawa Downtown", C.ottawa),
    drive: { from: "Kitchener", to: "Ottawa", km: "~550 km", hrs: "5.5–6 hr", fromCoord: C.home, toCoord: C.ottawa },
    plan: [
      { time: "Morning", title: "Load up and roll out", note: "Long first leg — coffee, snacks, playlist queued." },
      { time: "Late PM", title: "Check in: DoubleTree Downtown", note: "Drop bags, shake off the drive.", tag: "stay" },
      { time: "Evening", title: "Dinner in the ByWard Market", note: "Poutine and people-watching to kick things off.", geo: geo("ByWard Market", [45.4275, -75.6920]) }
    ]
  },
  {
    date: "2026-07-30", base: "ottawa", kind: "explore",
    title: "Ottawa — full day", summary: "Parliament Hill, a museum, and the canal before we point east.",
    waypoint: geo("Parliament Hill", [45.4236, -75.7009]),
    plan: [
      { time: "10:00", title: "Parliament Hill", note: "“Canada on the March” changing of the guard.", geo: geo("Parliament Hill", [45.4236, -75.7009]) },
      { time: "Midday", title: "Pick a museum", note: "History, War, or Nature — your call.", geo: geo("Canadian Museum of History", [45.4296, -75.7093]) },
      { time: "Afternoon", title: "Rideau Canal at Dow's Lake", note: "Stretch the legs, maybe the Interzip line.", geo: geo("Dow's Lake", [45.3960, -75.7010]) }
    ]
  },
  {
    date: "2026-07-31", base: "quebec", kind: "drive",
    title: "Ottawa → Québec City", summary: "Up the St. Lawrence to the old walled city.",
    waypoint: geo("Le 201 — Old Québec", C.quebec),
    drive: { from: "Ottawa", to: "Québec City", km: "~450 km", hrs: "4.5 hr", fromCoord: C.ottawa, toCoord: C.quebec },
    plan: [
      { time: "Morning", title: "Drive to Québec City", note: "Smooth run up the 40." },
      { time: "Afternoon", title: "Check in: Le 201 (Airbnb)", note: "Right inside the walls — walk to everything.", tag: "stay" },
      { time: "Evening", title: "Funicular + Petit-Champlain", note: "First wander through the old town.", geo: geo("Quartier Petit-Champlain", [46.8116, -71.2030]) }
    ]
  },
  {
    date: "2026-08-01", base: "quebec", kind: "explore",
    title: "Québec City — full day", summary: "Ramparts, the Dufferin Terrace, and Montmorency Falls.",
    waypoint: geo("Montmorency Falls", C.montmorency),
    plan: [
      { time: "Morning", title: "Dufferin Terrace & the ramparts", note: "Promenade beneath the Château Frontenac.", geo: geo("Dufferin Terrace", [46.8118, -71.2056]) },
      { time: "Afternoon", title: "Montmorency Falls", note: "Cable car, footbridge, and the zipline.", geo: geo("Montmorency Falls", C.montmorency) },
      { time: "Evening", title: "Long dinner in the old walls", note: "Québécois food, no rush." }
    ]
  },
  {
    date: "2026-08-02", base: "fredericton", kind: "drive",
    title: "Québec City → Fredericton", summary: "South into New Brunswick and the Saint John valley.",
    waypoint: geo("Crowne Plaza Lord Beaverbrook", C.fredericton),
    drive: { from: "Québec City", to: "Fredericton", km: "~565 km", hrs: "5.5–6 hr", fromCoord: C.quebec, toCoord: C.fredericton },
    plan: [
      { time: "Daytime", title: "The long drive south", note: "Biggest single push of the outbound leg." },
      { time: "Evening", title: "Check in: Crowne Plaza", note: "Downtown riverfront — two queens, pool.", tag: "stay" },
      { time: "Dusk", title: "Riverfront stroll + night market", note: "Garrison District and supper, then early to bed.", geo: geo("Fredericton Riverfront", [45.9586, -66.6420]) }
    ]
  },
  {
    date: "2026-08-03", base: "pei", kind: "drive",
    title: "Fredericton → PEI", summary: "Over the Confederation Bridge to the island.",
    waypoint: geo("New Glasgow cottage (PEI)", C.newGlasgowPEI),
    drive: { from: "Fredericton", to: "PEI (New Glasgow)", km: "~340 km", hrs: "4–4.5 hr", fromCoord: C.fredericton, toCoord: C.newGlasgowPEI },
    plan: [
      { time: "Morning", title: "Drive east to the bridge", note: "Free inbound — we leave by ferry." },
      { time: "Midday", title: "Cross the Confederation Bridge", note: "12.9 km over the strait onto the island.", geo: geo("Confederation Bridge", C.confedBridge) },
      { time: "Afternoon", title: "Settle into the cottage", note: "Waterfront in New Glasgow — three unpacked nights.", tag: "stay" }
    ]
  },
  {
    date: "2026-08-04", base: "pei", kind: "explore",
    title: "PEI — Anne & the dunes", summary: "Green Gables, the Greenwich boardwalk, and Charlottetown.",
    waypoint: geo("Green Gables Heritage Place", C.greenGables),
    plan: [
      { time: "Morning", title: "Green Gables Heritage Place", note: "The Anne of Green Gables farmstead.", geo: geo("Green Gables", C.greenGables) },
      { time: "Afternoon", title: "Greenwich dune boardwalk", note: "Floating boardwalk out to the parabolic dunes.", geo: geo("Greenwich PEI National Park", C.greenwich) },
      { time: "Evening", title: "Charlottetown", note: "Waterfront, COWS ice cream, seafood.", geo: geo("Charlottetown waterfront", C.charlottetown) }
    ]
  },
  {
    date: "2026-08-05", base: "pei", kind: "explore",
    title: "PEI — beach day", summary: "A slow day on the warmest saltwater of the trip.",
    waypoint: geo("Cavendish Beach", C.cavendish),
    plan: [
      { time: "All day", title: "North Shore beach day", note: "Cavendish red sand, or the singing sands at Basin Head.", geo: geo("Cavendish Beach", C.cavendish) },
      { time: "Anytime", title: "Island backroads", note: "Red-dirt roads, lobster rolls, no schedule." }
    ]
  },
  {
    date: "2026-08-06", base: "capebreton", kind: "transit",
    title: "PEI → Cape Breton", summary: "Ferry off the island, then up to the Cabot Trail.",
    waypoint: geo("Wood Islands Ferry Terminal", C.woodIslands),
    drive: { from: "Wood Islands", to: "Petit Étang", km: "~250 km + ferry", hrs: "ferry + ~4 hr", fromCoord: C.caribou, toCoord: C.petitEtang },
    plan: [
      { time: "7:45 AM", title: "Leave the cottage", note: "Allow time to reach Wood Islands and load." },
      { time: "10:00 AM", title: "Ferry: Wood Islands → Caribou", note: "75-min sailing. Booked ✓ — arrive ~45 min early.", tag: "booked", geo: geo("Wood Islands Ferry", C.woodIslands) },
      { time: "Afternoon", title: "Drive to Petit Étang", note: "~4 hr up to the Cabot Trail's Chéticamp gate.", geo: geo("Petit Étang", C.petitEtang) },
      { time: "Evening", title: "Check in: Cabot Trail Place", note: "Closest bed to the Skyline hike.", tag: "stay" }
    ]
  },
  {
    date: "2026-08-07", base: "capebreton", kind: "explore",
    title: "Cabot Trail day", summary: "Whales at midday, the Skyline Trail at golden hour.",
    waypoint: geo("Skyline Trail", C.skyline),
    sunset: "8:21 PM",
    plan: [
      { time: "Morning", title: "Drive the Cabot Trail", note: "Cliff-edge switchbacks, lookouts, the highlands." },
      { time: "~Midday", title: "Whale-watching, Pleasant Bay", note: "Pairs with the evening hike. Tour still to book.", tag: "tobook", geo: geo("Pleasant Bay", C.pleasantBay) },
      { time: "5–9 PM", title: "Skyline Trail — sunset hike", note: "Parking reserved ✓. Check in by 6 PM; sunset ~8:21. Headlamps — moose at dusk.", tag: "booked", geo: geo("Skyline Trail", C.skyline) }
    ]
  },
  {
    date: "2026-08-08", base: "halifax", kind: "drive",
    title: "Cape Breton → Halifax", summary: "Down from the cliffs to the big harbour — our 4-night hub.",
    waypoint: geo("Four Points by Sheraton Halifax", C.halifax),
    drive: { from: "Petit Étang", to: "Halifax", km: "~310 km", hrs: "3.5–4 hr", fromCoord: C.petitEtang, toCoord: C.halifax },
    plan: [
      { time: "Morning", title: "Drive to Halifax", note: "Last big drive for a while — four unpacked nights ahead." },
      { time: "Afternoon", title: "Check in: Four Points", note: "Downtown, 450 m to the waterfront.", tag: "stay" },
      { time: "Evening", title: "Waterfront boardwalk", note: "Dinner and a first lap of the harbour.", geo: geo("Halifax Waterfront", [44.6470, -63.5685]) }
    ]
  },
  {
    date: "2026-08-09", base: "halifax", kind: "explore",
    title: "Halifax — city day", summary: "The Citadel noon gun, the Maritime Museum, the Public Gardens.",
    waypoint: geo("Halifax Citadel", [44.6478, -63.5805]),
    plan: [
      { time: "Late AM", title: "Citadel Hill", note: "Catch the noon gun.", geo: geo("Halifax Citadel", [44.6478, -63.5805]) },
      { time: "Afternoon", title: "Maritime Museum / Titanic", note: "The Atlantic's stories, Titanic gallery.", geo: geo("Maritime Museum of the Atlantic", [44.6479, -63.5703]) },
      { time: "Late PM", title: "Public Gardens", note: "Victorian gardens, then dinner downtown.", geo: geo("Halifax Public Gardens", [44.6430, -63.5825]) }
    ]
  },
  {
    date: "2026-08-10", base: "halifax", kind: "explore",
    title: "South Shore day trip", summary: "Peggy's Cove, Mahone Bay, Lunenburg — back to the same bed.",
    waypoint: geo("Peggy's Cove", C.peggysCove),
    plan: [
      { time: "Morning", title: "Peggy's Cove", note: "The lighthouse on the granite — ~45 min out.", geo: geo("Peggy's Cove Lighthouse", C.peggysCove) },
      { time: "Midday", title: "Mahone Bay", note: "Three churches mirrored on the water.", geo: geo("Mahone Bay", C.mahoneBay) },
      { time: "Afternoon", title: "Lunenburg", note: "UNESCO old town, Fisheries Museum, Blue Rocks.", geo: geo("Lunenburg", C.lunenburg) }
    ]
  },
  {
    date: "2026-08-11", base: "halifax", kind: "explore",
    title: "Halifax — beach / flex day", summary: "No big drive. A beach, a harbour tour, or pure downtime.",
    waypoint: geo("Halifax Waterfront", [44.6470, -63.5685]),
    plan: [
      { time: "Open", title: "Beach or harbour tour", note: "Crystal Crescent, or a boat tour of the harbour." },
      { time: "Open", title: "Flex / catch-up", note: "Laundry, a long lunch, whatever the trip needs." }
    ]
  },
  {
    date: "2026-08-12", base: "edmundston", kind: "drive",
    title: "Halifax → Edmundston", summary: "The long highway day back across to New Brunswick's panhandle.",
    waypoint: geo("Days Inn Edmundston", C.edmundston),
    drive: { from: "Halifax", to: "Edmundston", km: "~640 km", hrs: "6.5 hr", fromCoord: C.halifax, toCoord: C.edmundston },
    plan: [
      { time: "Morning", title: "Early start west", note: "Biggest drive of the way home — pace it." },
      { time: "Evening", title: "Check in: Days Inn", note: "Simple highway-hotel night.", tag: "stay" },
      { time: "Evening", title: "Brayon supper", note: "Dinner in the Republic of Madawaska." }
    ]
  },
  {
    date: "2026-08-13", base: "montreal", kind: "drive",
    title: "Edmundston → Montréal", summary: "Down the river valley into the city finale.",
    waypoint: geo("Montréal (hotel TBD)", C.montreal),
    drive: { from: "Edmundston", to: "Montréal", km: "~530 km", hrs: "6 hr", fromCoord: C.edmundston, toCoord: C.montreal },
    plan: [
      { time: "Daytime", title: "Drive to Montréal", note: "Along the St. Lawrence into the city." },
      { time: "Afternoon", title: "Check in — hotel TBD", note: "Montréal stay still to book.", tag: "tobook" },
      { time: "Evening", title: "Vieux-Montréal & the Old Port", note: "Wander as the lights come on.", geo: geo("Old Port of Montréal", [45.5075, -73.5530]) }
    ]
  },
  {
    date: "2026-08-14", base: "montreal", kind: "explore",
    title: "Montréal — full day", summary: "Jean-Talon Market, Notre-Dame, Mont-Royal, the last big dinner.",
    waypoint: geo("Jean-Talon Market", C.jeanTalon),
    plan: [
      { time: "Morning", title: "Jean-Talon Market", note: "A food-lover's morning.", geo: geo("Marché Jean-Talon", C.jeanTalon) },
      { time: "Midday", title: "Notre-Dame Basilica", note: "The cobalt-and-gold nave.", geo: geo("Notre-Dame Basilica", C.notreDame) },
      { time: "Afternoon", title: "Mont-Royal lookout", note: "The view over the city.", geo: geo("Mont-Royal Belvedere", C.montRoyal) },
      { time: "Evening", title: "Celebration dinner", note: "Toast the trip before the leg home." }
    ]
  },
  {
    date: "2026-08-15", base: "home", kind: "drive",
    title: "Montréal → home", summary: "The last leg west, full of stories.",
    waypoint: geo("Home — Kitchener", C.home),
    drive: { from: "Montréal", to: "Kitchener", km: "~640 km", hrs: "6.5–7 hr", fromCoord: C.montreal, toCoord: C.home },
    plan: [
      { time: "Morning", title: "Pack the car one last time", note: "Coffee, then west." },
      { time: "Daytime", title: "Drive home", note: "~6.5–7 hr. Home by evening." },
      { time: "Arrival", title: "Home", note: "17 nights, ~4,400 km, one very full camera roll." }
    ]
  }
];
