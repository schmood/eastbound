/* dates.js — pure date helpers + trip-phase math. No React, no storage.
   "What day is it" (real vs. simulated) lives in trip.jsx; these functions
   take an explicit ymd string so they stay testable and side-effect-free. */
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";

export const WD  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WDL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MO  = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// parse a "YYYY-MM-DD" at local noon so DST/timezone never shifts the day
export function parseD(s) { return new Date(s + "T12:00:00"); }
export function ymd(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
export function fullDate(y) { var d = parseD(y); return WD[d.getDay()] + " " + MO[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); }

export function dayIndexFor(y) {
  for (var i = 0; i < DAYS.length; i++) if (DAYS[i].date === y) return i;
  return -1;
}
export function tripState(y) {
  var first = DAYS[0].date, last = DAYS[DAYS.length - 1].date;
  if (y < first) return { phase: "before", idx: -1 };
  if (y > last) return { phase: "after", idx: DAYS.length - 1 };
  return { phase: "on", idx: dayIndexFor(y) };
}
export function daysUntil(y) {
  var a = parseD(y), b = parseD(DAYS[0].date);
  return Math.round((b - a) / 86400000);
}

export function fmtTime(ts) { return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
export function fmtKm(n) { return n.toLocaleString("en-CA"); }
