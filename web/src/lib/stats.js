/* stats.js — the running trip tally, computed for a given "today" (ymd).
   Pure: distances, nights, provinces, and legs done so far vs. the full route. */
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";
import { tripState, daysUntil } from "./dates.js";

export function computeStats(y) {
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
