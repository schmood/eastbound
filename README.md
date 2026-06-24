# Eastbound 🧭

A private Progressive Web App companion for our family road trip — Kitchener,
Ontario to the Canadian Maritimes and back, **Jul 29 – Aug 15, 2026** (17 nights,
~4,400 km). Day-by-day itinerary, bookings & confirmations, weather, a running
trip-stats tally, and a **shared family journal** that syncs across all four of
our phones.

Built to be opened on a phone — on desktop it renders inside a phone shell so we
can preview the on-the-road experience.

---

## Architecture

| Layer | Choice | Why |
|------|--------|-----|
| **Frontend** | React + Vite, hash-router SPA, installable PWA | Fast, offline-capable, no app store |
| **Backend** | Node + Express + SQLite | Tiny API for the shared journal; serves the built frontend too |
| **Auth** | One shared **family password** → pick which of the four you are | Simplest thing that keeps the public API private. No OAuth, no per-user accounts |
| **Offline** | Service worker (network-first) + a localStorage **outbox** for notes | The Cabot Trail has dead zones — notes queue and sync when back in range |
| **Deploy** | Docker image → GHCR → `docker compose` on the Ubuntu box, behind a reverse proxy at `eastcoast.undergruhn.com` | Mirrors the Fourbells setup |

Notes are attributed by name on the honour system among the four of us — there's
no per-person login, just the one shared password.

### Repo layout

```
web/                 React + Vite frontend
  src/
    data/            trip itinerary, lodging, weather, people, Wikimedia image URLs
    lib/             pure helpers (dates, stats, weather, nav, icons, api client)
    components/      shared UI (Screen, TabBar, SimBar, Weather, Notes, cards…)
    screens/         Today, Days, Day, Stays, Stay, Stats, Journal, Account, Login
    auth.jsx         family-password gate + identity
    trip.jsx         "what day is it" (real or simulated)
    notes.jsx        shared-journal store with offline outbox + polling
    App.jsx          providers + phone shell + routes
  public/            manifest, service worker, icons
server/
  index.js           Express: /api/auth, /api/notes (CRUD), static frontend, SPA fallback
  db.js              SQLite store (better-sqlite3)
Dockerfile           multi-stage: build web → install server deps → slim runtime
docker-compose.yml   deploy config for the Ubuntu box
.github/workflows/   build & push the image to ghcr.io/schmood/eastbound
project/  chats/      the original Claude Design prototype + design transcripts (reference)
```

---

## Local development

Two terminals:

```bash
# 1) backend on :8080
cd server
cp .env.example .env          # set FAMILY_PASSWORD
npm install
npm run dev

# 2) frontend on :5173 (proxies /api → :8080)
cd web
npm install
npm run dev
```

Open http://localhost:5173, enter the password from `.env`, and pick a name.

Build the production frontend with `cd web && npm run build` (outputs `web/dist`,
which the server serves in production).

The PWA icons are generated once from `web/scripts/gen-icons.py` (`pip install
Pillow`) and committed, so neither the build nor the Docker image needs a
rasterizer.

---

## Configuration

Server environment variables (see `server/.env.example`):

| Var | Default | Notes |
|-----|---------|-------|
| `FAMILY_PASSWORD` | _(unset)_ | **Required.** The one shared secret — make it long. The whole API is unprotected if unset. |
| `PORT` | `8080` | Port the server listens on. |
| `DATA_DIR` | `./data` | SQLite DB (`eastbound.db`) + confirmation PDFs live here. Mount as a volume. |

---

## Deploy

### 1. CI builds & pushes the image

On every push to `main`, `.github/workflows/deploy.yml` builds the Docker image
and pushes it to **`ghcr.io/schmood/eastbound:latest`** using the built-in
`GITHUB_TOKEN`.

> After the first push, make the GHCR package **public** (Package settings →
> Change visibility), _or_ create a PAT with `read:packages` and `docker login
> ghcr.io` on the server so it can pull a private image.

### 2. The Ubuntu box runs it

```bash
# next to docker-compose.yml:
echo "FAMILY_PASSWORD=our-long-shared-secret" > .env

docker compose pull
docker compose up -d
```

The container listens on `127.0.0.1:8090` (host) → `8080` (container), and notes
persist in the `eastbound-data` volume.

To update after a new image is pushed: `docker compose pull && docker compose up -d`.

### 3. Reverse proxy → `eastcoast.undergruhn.com`

Point the subdomain's DNS at the box and add a vhost forwarding to the container.

**Caddy:**

```
eastcoast.undergruhn.com {
    reverse_proxy 127.0.0.1:8090
}
```

**nginx** (TLS via certbot):

```nginx
server {
    server_name eastcoast.undergruhn.com;
    location / { proxy_pass http://127.0.0.1:8090; proxy_set_header Host $host; }
}
```

---

## Before the trip — checklist

- [ ] Set a strong `FAMILY_PASSWORD` and share it with the four of us.
- [ ] Point `eastcoast.undergruhn.com` at the box + add the reverse-proxy vhost.
- [ ] Make the GHCR package public (or `docker login` on the box).
- [ ] Everyone opens the app **once online** (at home) so the PWA caches for offline use, then "Add to Home Screen".
- [ ] _Optional:_ swap the mock forecast in `web/src/data/weather.js` for a live
      [Open-Meteo](https://open-meteo.com) fetch (free, no key — coordinates are
      already in `trip-days.js`).
- [ ] _Optional:_ drop booking confirmation PDFs in `server/data/confirmations/<stop>.pdf`
      and set the path in `CONF` in `web/src/screens/Stay.jsx`.
- [ ] Book the two remaining items the app flags: the Montréal hotel (Aug 13–15)
      and the Aug 7 Pleasant Bay whale tour.

---

## Design origin

The visual design and content were prototyped in **Claude Design**; the original
static prototype and the design transcripts are preserved under `project/` and
`chats/` for reference. This repo is the production implementation.
