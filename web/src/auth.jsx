/* auth.jsx — the family-password gate + which-of-us identity.
   Login verifies the shared password against the server once, then the session
   persists on-device (so a relaunch on the trip — even offline — stays signed
   in). Identity is whichever of the four you tapped. */
import { createContext, useContext, useState, useCallback } from "react";
import { loadSession, saveSession, clearSession } from "./lib/session.js";
import { personById } from "./data/people.js";
import { api } from "./lib/api.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());
  const user = session ? personById(session.userId) : null;

  // returns { ok } or { ok:false, reason:"wrong"|"offline" }
  const login = useCallback(async (password, userId) => {
    const ok = await api.verify(password);
    if (ok === true) {
      const s = { password, userId };
      saveSession(s);
      setSession(s);
      return { ok: true };
    }
    if (ok === null) return { ok: false, reason: "offline" };
    return { ok: false, reason: "wrong" };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }
