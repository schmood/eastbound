/* weather.js — MOCK forecast for the companion app, keyed by date (YYYY-MM-DD).
   Placeholder data until a live API is wired closer to the trip (see the README
   checklist — Open-Meteo, free, coordinates already live in trip-days.js).
   Conditions: sun · partly · cloud · rain · shower · fog. Temps °C.
   The app reads { cond, hi, lo }; pop/wind/note are extra colour for later. */
export const MOCK_WEATHER = {
  "2026-07-29": { hi: 27, lo: 17, cond: "sun",    pop: 5,  wind: 11, note: "Warm send-off" },
  "2026-07-30": { hi: 28, lo: 18, cond: "partly", pop: 20, wind: 13, note: "A few afternoon clouds" },
  "2026-07-31": { hi: 25, lo: 16, cond: "partly", pop: 20, wind: 14, note: "Comfortable drive day" },
  "2026-08-01": { hi: 26, lo: 15, cond: "sun",    pop: 5,  wind: 10, note: "Bright over Old Québec" },
  "2026-08-02": { hi: 23, lo: 15, cond: "shower", pop: 55, wind: 17, note: "Showers off and on" },
  "2026-08-03": { hi: 22, lo: 15, cond: "partly", pop: 25, wind: 19, note: "Breezy on the bridge" },
  "2026-08-04": { hi: 24, lo: 16, cond: "sun",    pop: 10, wind: 14, note: "Great for Green Gables" },
  "2026-08-05": { hi: 26, lo: 17, cond: "sun",    pop: 5,  wind: 12, note: "Prime beach day" },
  "2026-08-06": { hi: 20, lo: 14, cond: "cloud",  pop: 30, wind: 22, note: "Grey for the ferry crossing" },
  "2026-08-07": { hi: 21, lo: 13, cond: "partly", pop: 20, wind: 18, note: "Clearing for the Skyline sunset" },
  "2026-08-08": { hi: 22, lo: 15, cond: "partly", pop: 25, wind: 16, note: "Easy drive to Halifax" },
  "2026-08-09": { hi: 23, lo: 16, cond: "sun",    pop: 10, wind: 13, note: "Clear over the harbour" },
  "2026-08-10": { hi: 21, lo: 15, cond: "fog",    pop: 30, wind: 15, note: "Classic fog at Peggy's Cove AM" },
  "2026-08-11": { hi: 24, lo: 17, cond: "sun",    pop: 10, wind: 12, note: "Beach / flex day weather" },
  "2026-08-12": { hi: 24, lo: 15, cond: "shower", pop: 45, wind: 18, note: "Passing showers on the haul west" },
  "2026-08-13": { hi: 27, lo: 18, cond: "partly", pop: 20, wind: 14, note: "Warming into Montréal" },
  "2026-08-14": { hi: 28, lo: 19, cond: "sun",    pop: 5,  wind: 11, note: "Hot market morning" },
  "2026-08-15": { hi: 27, lo: 18, cond: "partly", pop: 20, wind: 13, note: "Fair for the drive home" }
};
