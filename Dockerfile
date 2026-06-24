# Eastbound — multi-stage build.
# 1) build the React/Vite frontend  2) install server deps (native better-sqlite3)
# 3) slim runtime that serves the built frontend + the journal API.

# ---- 1. build the frontend ----
FROM node:22-bookworm-slim AS web
WORKDIR /web
COPY web/package.json web/package-lock.json* ./
RUN npm ci || npm install
COPY web/ ./
RUN npm run build

# ---- 2. install server dependencies ----
# build tools let better-sqlite3 compile from source if no prebuilt matches.
FROM node:22-bookworm-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# ---- 3. runtime ----
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=8080 \
    DATA_DIR=/data \
    WEB_DIR=/app/web/dist
WORKDIR /app
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY server/ ./server/
COPY --from=web /web/dist ./web/dist
EXPOSE 8080
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server/index.js"]
