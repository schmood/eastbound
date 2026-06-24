/* Screen.jsx — the per-screen chrome: status bar (top of the phone), and a
   Screen wrapper that draws the app bar + the scrollable content area. */
import { useRef, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "./ui.jsx";
import { useAuth } from "../auth.jsx";
import { useTrip } from "../trip.jsx";

export function StatusBar() {
  const { now } = useTrip();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M/i, "");
  return (
    <div className="statusbar">
      <span id="sb-time">{time}</span>
      <span className="sb-right">Eastbound&nbsp;●</span>
    </div>
  );
}

export function Screen({ title, sub, showBack, children }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  // reset scroll to top whenever the route changes (incl. /day/1 → /day/2)
  useLayoutEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [pathname]);

  return (
    <>
      <div className="appbar">
        {showBack && <button className="appbar__back" onClick={() => nav(-1)} aria-label="Back">‹</button>}
        <div className="appbar__title"><small>{sub}</small>{title}</div>
        {user && <Link className="appbar__me" to="/me" aria-label="Account"><Avatar person={user} /></Link>}
      </div>
      <div className="screen" ref={scrollRef}>{children}</div>
    </>
  );
}
