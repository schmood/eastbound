/* notes.jsx — the shared family journal. Notes live on the server so all four
   phones stay in sync; we poll every 30s and on focus/reconnect. Writes go
   through an offline outbox (persisted locally) that flushes when there's a
   connection — so you can jot a note on the Cabot Trail with no signal and it
   syncs the moment you're back in range. The last-seen notes are cached too,
   so the journal reads fine offline. */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api, ApiError } from "./lib/api.js";
import { useAuth } from "./auth.jsx";
import { personById } from "./data/people.js";
import { TRIP_DAYS as DAYS } from "./data/trip-days.js";
import { parseD, WD, MO, fmtTime } from "./lib/dates.js";

const NotesCtx = createContext(null);
const CACHE_KEY = "eb-notes-cache";
const OUTBOX_KEY = "eb-outbox";

function readJSON(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; } }
function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const [serverNotes, setServerNotes] = useState(() => readJSON(CACHE_KEY));
  const [outbox, setOutbox] = useState(() => readJSON(OUTBOX_KEY));
  const [online, setOnline] = useState(() => navigator.onLine !== false);
  const [syncing, setSyncing] = useState(false);
  const outboxRef = useRef(outbox);
  outboxRef.current = outbox;

  useEffect(() => { writeJSON(CACHE_KEY, serverNotes); }, [serverNotes]);
  useEffect(() => { writeJSON(OUTBOX_KEY, outbox); }, [outbox]);

  // push queued notes to the server, oldest first; stop on a network error
  const flush = useCallback(async () => {
    const pending = outboxRef.current;
    if (!pending.length) return;
    for (const n of pending) {
      try {
        const saved = await api.addNote({ day: n.day, author: n.author, ts: n.ts, text: n.text });
        setServerNotes(prev => (prev.some(x => x.id === saved.id) ? prev : prev.concat(saved)));
        setOutbox(prev => prev.filter(x => x.id !== n.id));
      } catch (e) {
        // 4xx that isn't auth → malformed, drop it so it can't wedge the queue
        if (e instanceof ApiError && e.status >= 400 && e.status !== 401) {
          setOutbox(prev => prev.filter(x => x.id !== n.id));
          continue;
        }
        break; // network/auth — keep queued, try again next round
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    setSyncing(true);
    try {
      const list = await api.getNotes();
      if (Array.isArray(list)) { setServerNotes(list); setOnline(true); }
      await flush();
    } catch (e) {
      if (e instanceof ApiError && e.status === 0) setOnline(false);
    } finally {
      setSyncing(false);
    }
  }, [flush]);

  // initial fetch + 30s poll + reconnect/focus refresh
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);
    const onOnline = () => { setOnline(true); refresh(); };
    const onOffline = () => setOnline(false);
    const onFocus = () => refresh();
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(t);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  // whenever something is queued (and we believe we're online), try to flush
  useEffect(() => { if (outbox.length && online) flush(); }, [outbox, online, flush]);

  const addNote = useCallback((day, text) => {
    if (!user || !text.trim()) return false;
    const local = {
      id: "tmp-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      day, author: user.id, ts: Date.now(), text: text.trim(), pending: true
    };
    setOutbox(prev => prev.concat(local));
    return true;
  }, [user]);

  const deleteNote = useCallback(async (note) => {
    if (!note) return;
    if (note.pending) { setOutbox(prev => prev.filter(x => x.id !== note.id)); return; }
    setServerNotes(prev => prev.filter(x => x.id !== note.id)); // optimistic
    try { await api.delNote(note.id); }
    catch (e) { refresh(); } // server still has it (e.g. offline) → restore on next sync
  }, [refresh]);

  const merged = serverNotes.concat(outbox);
  const notesForDay = useCallback(
    (date) => merged.filter(n => n.day === date).sort((a, b) => a.ts - b.ts),
    [serverNotes, outbox] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const allCount = merged.length;
  const myCount = user ? merged.filter(n => n.author === user.id).length : 0;

  const buildText = useCallback(() => {
    const lines = ["EASTBOUND — TRIP NOTES", "Kitchener → the Maritimes → home · Jul 29 – Aug 15, 2026", ""];
    let any = false;
    DAYS.forEach(day => {
      const dn = merged.filter(n => n.day === day.date).sort((a, b) => a.ts - b.ts);
      if (!dn.length) return;
      any = true;
      const d = parseD(day.date);
      lines.push("== " + WD[d.getDay()] + " " + MO[d.getMonth()] + " " + d.getDate() + " · " + day.title + " ==");
      dn.forEach(n => {
        const p = personById(n.author) || { name: "?" };
        lines.push("[" + fmtTime(n.ts) + "] " + p.name + ": " + n.text);
      });
      lines.push("");
    });
    if (!any) lines.push("(No notes yet.)");
    lines.push("— exported " + new Date().toLocaleString());
    return lines.join("\n");
  }, [serverNotes, outbox]); // eslint-disable-line react-hooks/exhaustive-deps

  const downloadNotes = useCallback(() => {
    const text = buildText();
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "eastbound-trip-notes.txt";
      document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 600);
    } catch (e) {}
    try { if (navigator.clipboard) navigator.clipboard.writeText(text); } catch (e) {}
  }, [buildText]);

  const value = { notesForDay, allCount, myCount, online, syncing, addNote, deleteNote, refresh, downloadNotes };
  return <NotesCtx.Provider value={value}>{children}</NotesCtx.Provider>;
}

export function useNotes() { return useContext(NotesCtx); }
