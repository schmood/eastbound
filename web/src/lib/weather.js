/* weather.js — presentation helpers over the mock forecast. Returns plain data;
   the Weather components render it. Swap data/weather.js for a live API later. */
import { MOCK_WEATHER } from "../data/weather.js";
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";
import { parseD, WD } from "./dates.js";

export const WX = MOCK_WEATHER;

export function wxIconName(cond) {
  var m = { sun: "wsun", partly: "wpartly", cloud: "cloud", rain: "wrain", shower: "wrain", fog: "wfog" };
  return m[cond] || "cloud";
}
export function wxLabel(cond) {
  return { sun: "Sunny", partly: "Partly cloudy", cloud: "Cloudy", rain: "Rain likely", shower: "Showers", fog: "Morning fog" }[cond] || "—";
}
export function wxClass(cond) {
  if (cond === "rain" || cond === "shower") return "wet";
  if (cond === "sun") return "clear";
  if (cond === "fog" || cond === "cloud") return "grey";
  return "mild";
}

// 3-day forecast starting at a DAYS index → { now, days:[{dn,cond,hi,lo}] } or null
export function getForecast(startIdx) {
  var w0 = WX[DAYS[startIdx] && DAYS[startIdx].date];
  if (!w0) return null;
  var days = [];
  for (var k = 0; k < 3; k++) {
    var idx = startIdx + k;
    if (!DAYS[idx]) break;
    var w = WX[DAYS[idx].date];
    if (!w) continue;
    var d = parseD(DAYS[idx].date);
    days.push({ dn: k === 0 ? "Today" : WD[d.getDay()], cond: w.cond, hi: w.hi, lo: w.lo });
  }
  return { now: w0, days: days };
}

// single-day weather for the day-detail chip
export function getDayWeather(idx) {
  var d = DAYS[idx];
  if (!d) return null;
  return WX[d.date] || null;
}
