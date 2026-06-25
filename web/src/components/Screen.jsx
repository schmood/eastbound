/* Screen.jsx — the per-screen chrome: a Screen wrapper that draws the app bar
   and the scrollable content area. (No fake status bar — an installed PWA shows
   the real OS status bar, and the browser view doesn't need a faux one.) */
import { useRef, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "./ui.jsx";
import { useAuth } from "../auth.jsx";

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
