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
`);

const listStmt = db.prepare("SELECT id, day, author, ts, text FROM notes ORDER BY ts ASC");
const insertStmt = db.prepare("INSERT INTO notes (id, day, author, ts, text) VALUES (@id, @day, @author, @ts, @text)");
const deleteStmt = db.prepare("DELETE FROM notes WHERE id = ?");

export function getNotes() { return listStmt.all(); }
export function addNote(note) { insertStmt.run(note); return note; }
export function removeNote(id) { return deleteStmt.run(id).changes; }
export { DB_PATH };
