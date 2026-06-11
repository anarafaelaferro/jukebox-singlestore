# Jukebox

A calendar of album recommendations with user profiles and a bilateral friends system. The frontend is a React app; the backend is Vercel serverless functions backed by SingleStore and Clerk.

## Prerequisites

- Node.js 18+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)
- SingleStore database credentials
- Clerk application keys

## Setup

Install dependencies in both packages:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Environment variables

Create `backend/.env`:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | SingleStore host |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `PORT` | Database port (optional, defaults to `3333`) |
| `CLERK_SECRET_KEY` | Clerk secret key |

Create `frontend/.env.local`:

| Variable | Description |
|----------|-------------|
| `REACT_APP_VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `REACT_APP_API_BASE_URL` | Backend URL for local dev: `http://localhost:3000` |

Optional (Spotify cover art):

| Variable | Description |
|----------|-------------|
| `REACT_APP_SPOTIFY_CLIENT_ID` | Spotify client ID |
| `REACT_APP_SPOTIFY_CLIENT_SECRET` | Spotify client secret |

## Running locally

Use two terminals. The backend must be started from the **repo root** (the Vercel project root directory is `backend`, so running `vercel dev` inside `backend/` will fail).

### Terminal 1 — Backend (port 3000)

```bash
cd jukebox-singlestore
vercel dev
```

API available at `http://localhost:3000/api/*`.

Quick check:

```bash
curl http://localhost:3000/api/albums
```

### Terminal 2 — Frontend (port 3001)

```bash
cd jukebox-singlestore/frontend
npm start
```

App available at [http://localhost:3001](http://localhost:3001).

```
Browser (localhost:3001)
       ↓ axios
API (localhost:3000/api/*)
       ↓
SingleStore + Clerk
```

### Troubleshooting

| Issue | Fix |
|-------|-----|
| `backend/backend doesn't exist` | Run `vercel dev` from the repo root, not from `backend/` |
| Port 3000 in use | Stop the other process, or run `vercel dev --listen 3002` and update `REACT_APP_API_BASE_URL` |
| API calls fail from the browser | Ensure `REACT_APP_API_BASE_URL` points to the port where `vercel dev` is running |
| Clerk webhooks (user signup sync) | Expose port 3000 with ngrok and point Clerk at `/api/webhooks` |

Example ngrok:

```bash
ngrok http 3000
```

## Frontend scripts

From `frontend/`:

| Command | Description |
|---------|-------------|
| `npm start` | Dev server on port 3001 |
| `npm run build` | Production build |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run lint` | Run ESLint |

## Production

- **Frontend:** [jukebox.rafaelaferro.com](http://jukebox.rafaelaferro.com/) via GitHub Pages
- **Backend:** Vercel serverless functions (`backend/` as the project root)

### Automated deploy (CI)

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

| Change in | Deploys |
|-----------|---------|
| `frontend/**` | GitHub Pages (build → `gh-pages` branch) |
| `backend/**` | Vercel production |
| Manual | Both (Actions → **Deploy** → **Run workflow**) |

#### GitHub secrets

Add these under **Settings → Secrets and variables → Actions**:

| Secret | Used by |
|--------|---------|
| `VERCEL_TOKEN` | Backend — [Vercel account token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Backend — team ID from `.vercel/project.json` (`orgId`) |
| `VERCEL_PROJECT_ID` | Backend — project ID from `.vercel/project.json` (`projectId`) |
| `REACT_APP_VITE_CLERK_PUBLISHABLE_KEY` | Frontend build |
| `REACT_APP_API_BASE_URL` | Frontend build — production Vercel API URL (e.g. `https://your-project.vercel.app`) |
| `REACT_APP_SPOTIFY_CLIENT_ID` | Frontend build (optional) |
| `REACT_APP_SPOTIFY_CLIENT_SECRET` | Frontend build (optional) |

GitHub Pages must be configured to deploy from the **`gh-pages` branch** (root). The custom domain `jukebox.rafaelaferro.com` stays as-is.

#### Manual deploy (local)

```bash
# Backend (from repo root)
vercel --prod

# Frontend
cd frontend && npm run deploy
```
