# Poker44 Dashboard

A local React dashboard for [Poker44 subnet 126](https://poker44.net/dashboard) with a more flexible provisional standings table.

## Features

- Full competition overview: countdown, cycle progress, benchmark stats, winner history, contender spread, validator fleet
- All miners on one scrollable page (no pagination)
- Sortable columns (default: composite descending)
- Instant search by UID, hotkey, model, version, commit, or score
- Click any miner row to open a detail drawer with manifest files and full API data
- Auto-refresh every 30 minutes (manual refresh available anytime)

## Run locally

**Do not open `dist/index.html` directly.** Use the dev or preview server so API requests are proxied.

```bash
cd ~/poker44-dashboard
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Build & preview

```bash
npm run build
npm run preview
```

## Data source

Public Poker44 API:

- `GET /api/v1/competition/leaderboard`
- `GET /api/v1/competition/current`
- `GET /api/v1/competition/history`
- `GET /api/v1/network/validators`
- `GET /api/v1/miners/{uid}`

Locally, Vite proxies `/api` to `https://api.poker44.net`.  
On Vercel, `api/v1/[...path].js` serverlessly proxies the same routes.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import on [vercel.com/new](https://vercel.com/new)
3. Framework: **Vite**, Output: **dist** (root directory = repo root)
4. Deploy

Verify after deploy:

`https://YOUR-PROJECT.vercel.app/api/v1/competition/leaderboard`

That URL should return JSON with `"success": true`.
