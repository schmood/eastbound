/* db.js — SQLite store for the shared journal (better-sqlite3, synchronous).
   One table, file-backed under DATA_DIR so a mounted volume persists notes
   across container restarts and redeploys. */
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const DATA_DIR = process.env.DATA_DIR || "./data";
const DB_PATH = process.env.DB_PATH || join(DATA_DIR, "eastbound.db");

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id     TEXT PRIMARY KEY,
    day    TEXT NOT NULL,
    author TEXT NOT NULL,
    ts     INTEGER NOT NULL,
    text   TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_notes_day ON notes(day);
  CREATE TABLE IF NOT EXISTS push_subs (
    endpoint TEXT PRIMARY KEY,
    sub      TEXT NOT NULL,
    created  INTEGER NOT NULL
  );
`);

const listStmt = db.prepare("SELECT id, day, author, ts, text FROM notes ORDER BY ts ASC");
const insertStmt = db.prepare("INSERT INTO notes (id, day, author, ts, text) VALUES (@id, @day, @author, @ts, @text)");
const deleteStmt = db.prepare("DELETE FROM notes WHERE id = ?");

export function getNotes() { return listStmt.all(); }
export function addNote(note) { insertStmt.run(note); return note; }
export function removeNote(id) { return deleteStmt.run(id).changes; }

// --- web-push subscriptions (one row per device) ---
const subUpsertStmt = db.prepare("INSERT INTO push_subs (endpoint, sub, created) VALUES (?, ?, ?) ON CONFLICT(endpoint) DO UPDATE SET sub = excluded.sub");
const subDeleteStmt = db.prepare("DELETE FROM push_subs WHERE endpoint = ?");
const subListStmt = db.prepare("SELECT endpoint, sub FROM push_subs");
export function addSub(endpoint, sub) { subUpsertStmt.run(endpoint, sub, Date.now()); }
export function removeSub(endpoint) { return subDeleteStmt.run(endpoint).changes; }
export function allSubs() { return subListStmt.all(); }

export { DB_PATH };
