/* index.js — Eastbound backend.
   Serves the built frontend (web/dist) and a tiny family-journal API:
     POST   /api/auth          verify the shared family password
     GET    /api/notes         all notes (gated)
     POST   /api/notes         add a note (gated)
     DELETE /api/notes/:id     remove a note (gated)
     GET    /api/health        liveness + note count
   Auth is one shared password (FAMILY_PASSWORD), sent as a bearer token. It's
   the whole gate — only the four of us have it — so pick a strong one. */
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { getNotes, addNote, removeNote } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8080;
const PASSWORD = process.env.FAMILY_PASSWORD || "";
const DATA_DIR = process.env.DATA_DIR || join(__dirname, "data");
const WEB_DIR = process.env.WEB_DIR || join(__dirname, "..", "web", "dist");
const CONF_DIR = join(DATA_DIR, "confirmations");

if (!PASSWORD) {
  console.warn("[eastbound] WARNING: FAMILY_PASSWORD is not set — the journal API is UNPROTECTED. Set it before deploying.");
}
mkdirSync(CONF_DIR, { recursive: true });

const PEOPLE_IDS = new Set(["attila", "jennifer", "vera", "hazel"]);

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

function passwordOK(pw) { return !!PASSWORD && typeof pw === "string" && pw === PASSWORD; }
function requireAuth(req, res, next) {
  const h = req.get("authorization") || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!passwordOK(tok)) return res.status(401).json({ error: "unauthorized" });
  next();
}

// login gate — the client verifies here before saving the session on-device
app.post("/api/auth", (req, res) => {
  if (passwordOK(req.body && req.body.password)) return res.json({ ok: true });
  return res.status(401).json({ error: "unauthorized" });
});

app.get("/api/notes", requireAuth, (req, res) => {
  res.json(getNotes());
});

app.post("/api/notes", requireAuth, (req, res) => {
  const b = req.body || {};
  const day = String(b.day || "").slice(0, 10);
  const author = String(b.author || "");
  const text = String(b.text || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !PEOPLE_IDS.has(author) || !text) {
    return res.status(400).json({ error: "bad note" });
  }
  const note = {
    id: "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    day,
    author,
    ts: Number.isFinite(b.ts) ? Math.trunc(b.ts) : Date.now(),
    text: text.slice(0, 4000)
  };
  addNote(note);
  res.status(201).json(note);
});

app.delete("/api/notes/:id", requireAuth, (req, res) => {
  const deleted = removeNote(req.params.id);
  res.json({ ok: true, deleted });
});

app.get("/api/health", (req, res) => res.json({ ok: true, notes: getNotes().length }));

// confirmation PDFs live on the persistent volume (drop files in data/confirmations/)
app.use("/confirmations", express.static(CONF_DIR, { maxAge: "1h" }));

// the built frontend
app.use(express.static(WEB_DIR, { maxAge: "1h", index: false }));

// SPA fallback: any non-API GET serves index.html (hash router does the rest)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  const index = join(WEB_DIR, "index.html");
  if (existsSync(index)) return res.sendFile(index);
  res.status(404).send("Eastbound frontend not built yet (web/dist missing).");
});

app.listen(PORT, () => console.log(`[eastbound] listening on :${PORT}  (web: ${WEB_DIR})`));
