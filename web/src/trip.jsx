/* trip.jsx — "what day is it" for the whole app. Normally the real current day;
   in simulation mode (a settings toggle) you can step to any day to preview the
   on-the-road experience. The simulated date is SESSION-ONLY (sessionStorage),
   so a fresh launch on the trip always opens on the real today. */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TRIP_DAYS as DAYS } from "./data/trip-days.js";
import { parseD, ymd } from "./lib/dates.js";

const TripCtx = createContext(null);

function readSimDate() { try { return sessionStorage.getItem("eb-simdate"); } catch (e) { return null; } }
function readSimOn()   { try { return localStorage.getItem("eb-sim") === "1"; } catch (e) { return false; } }

export function TripProvider({ children }) {
  const [now, setNow] = useState(() => new Date());
  const [simDate, setSimDate] = useState(readSimDate);
  const [simOn, setSimOn] = useState(readSimOn);

  // one-time cleanup: an earlier build persisted the sim override in localStorage,
  // which could pin the app to a stale day. The override is session-only now.
  useEffect(() => { try { localStorage.removeItem("eb-simdate"); } catch (e) {} }, []);

  // tick the clock so the status bar stays current and we roll over at midnight
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const today = simDate || ymd(now);

  const stepSim = useCallback((dir) => {
    const d = parseD(simDate || ymd(new Date()));
    d.setDate(d.getDate() + dir);
    // step within an extended window: a few days before first → just after last
    const min = parseD(DAYS[0].date); min.setDate(min.getDate() - 5);
    const max = parseD(DAYS[DAYS.length - 1].date); max.setDate(max.getDate() + 2);
    let nd = d;
    if (nd < min) nd = min;
    if (nd > max) nd = max;
    const s = ymd(nd);
    try { sessionStorage.setItem("eb-simdate", s); } catch (e) {}
    setSimDate(s);
  }, [simDate]);

  const resetSim = useCallback(() => {
    try { sessionStorage.removeItem("eb-simdate"); } catch (e) {}
    setSimDate(null);
  }, []);

  const setSimEnabled = useCallback((on) => {
    try {
      if (on) { localStorage.setItem("eb-sim", "1"); }
      else { localStorage.setItem("eb-sim", "0"); sessionStorage.removeItem("eb-simdate"); }
    } catch (e) {}
    if (!on) setSimDate(null);
    setSimOn(on);
  }, []);

  const value = {
    now, today,
    simOn, isSimulating: !!simDate,
    stepSim, resetSim, setSimEnabled
  };
  return <TripCtx.Provider value={value}>{children}</TripCtx.Provider>;
}

export function useTrip() { return useContext(TripCtx); }
