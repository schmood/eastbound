/* weather.js — presentation helpers over the mock forecast. Returns plain data;
   the Weather components render it. Swap data/weather.js for a live API later. */
import { MOCK_WEATHER } from "../data/weather.js";
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";
import { STOPS, TRIP_META } from "../data/stops.js";
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

/* ---------- live forecast (Open-Meteo — free, keyless, CORS-friendly) ---------- */
const OM_URL = "https://api.open-meteo.com/v1/forecast";
const WX_CACHE = "eb-wx";

function ymdLocal(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// WMO weather code → our condition bucket (sun/partly/cloud/rain/shower/fog)
function wmoToCond(code) {
  if (code === 0) return "sun";
  if (code === 1 || code === 2) return "partly";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 80 && code <= 99) return "shower";   // showers + thunderstorms
  return "cloud";
}

// where we'll be on a given date: the trip day's base stop, else Kitchener (home)
function locForDate(ymd) {
  const day = DAYS.find((d) => d.date === ymd);
  if (day && day.base && day.base !== "home" && STOPS[day.base]) {
    return { name: STOPS[day.base].name, coord: STOPS[day.base].coord };
  }
  return { name: TRIP_META.home.name, coord: TRIP_META.home.coord };
}

// Live 7-day forecast tied to where we'll actually be each (real) day.
// → { current:{city,temp,cond,hi,lo,pop}, days:[{date,dn,city,cond,hi,lo}] } or null.
export async function loadLiveForecast() {
  const now = new Date();
  const dates = [];
  for (let i = 0; i < 7; i++) { const d = new Date(now); d.setDate(now.getDate() + i); dates.push(ymdLocal(d)); }
  const locByDate = dates.map(locForDate);

  const distinct = [];
  for (const l of locByDate) if (!distinct.some((x) => x.name === l.name)) distinct.push(l);
  const url = OM_URL +
    "?latitude=" + distinct.map((l) => l.coord[0]).join(",") +
    "&longitude=" + distinct.map((l) => l.coord[1]).join(",") +
    "&current=temperature_2m,weather_code" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=auto&forecast_days=7";

  let raw;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("wx " + res.status);
    raw = await res.json();
  } catch (e) {
    try { return JSON.parse(localStorage.getItem(WX_CACHE) || "null"); } catch (_) { return null; }
  }

  const arr = Array.isArray(raw) ? raw : [raw];
  const byName = {};
  distinct.forEach((l, i) => { byName[l.name] = arr[i]; });
  const at = (r, ymd) => (r && r.daily ? r.daily.time.indexOf(ymd) : -1);

  const curLoc = locByDate[0];
  const curRes = byName[curLoc.name];
  const ci = at(curRes, dates[0]);
  const current = {
    city: curLoc.name,
    temp: Math.round(curRes.current.temperature_2m),
    cond: wmoToCond(curRes.current.weather_code),
    hi: ci >= 0 ? Math.round(curRes.daily.temperature_2m_max[ci]) : null,
    lo: ci >= 0 ? Math.round(curRes.daily.temperature_2m_min[ci]) : null,
    pop: ci >= 0 ? curRes.daily.precipitation_probability_max[ci] : null
  };

  const days = dates.map((ymd, i) => {
    const loc = locByDate[i];
    const r = byName[loc.name];
    const di = at(r, ymd);
    const dt = parseD(ymd);
    return {
      date: ymd,
      dn: i === 0 ? "Today" : WD[dt.getDay()],
      city: loc.name,
      cond: di >= 0 ? wmoToCond(r.daily.weather_code[di]) : "cloud",
      hi: di >= 0 ? Math.round(r.daily.temperature_2m_max[di]) : null,
      lo: di >= 0 ? Math.round(r.daily.temperature_2m_min[di]) : null
    };
  });

  const out = { current, days };
  try { localStorage.setItem(WX_CACHE, JSON.stringify(out)); } catch (_) {}
  return out;
}
