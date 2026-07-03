# Luma

**Your life, beautifully understood.**

Luma is a premium, dark-mode-only, AI-powered personal life dashboard. It quietly
organizes and visualizes your life — music, memories, places, growth — into a
dashboard so beautiful you *want* to open it every day, even without touching the AI.

> The dashboard is the product. AI is the engine that runs quietly in the background.

## Why this exists

Most "AI apps" are chatbots. Luma is the opposite: the intelligence works invisibly
to connect your data across sources, and the payoff is an elegant, screenshot-worthy
dashboard — not a chat window.

## Architecture at a glance

Luma is built around a **Widget SDK**: every card (Spotify, Memories, Quote, Life
Pulse, Travel, …) is an independent widget module that implements a common interface —
its own backend sync service and frontend renderer. The dashboard itself is just a
**layout engine** that renders the user's selected widgets. Adding a new source
(GitHub, Goodreads, Netflix, Apple Health…) means implementing the widget interface,
never editing the dashboard.

## Monorepo layout

```
luma/
├── frontend/   Next.js PWA — the dashboard (TypeScript, Tailwind v4, shadcn/ui)
├── backend/    FastAPI service layer (auth, sync services, timeline, search)
├── ai/         Embeddings, hybrid search, insights, vision (CLIP/BLIP)
├── docker/     Compose files & container definitions
└── docs/       Architecture notes and design system
```

## Tech stack

**Frontend** — Next.js, TypeScript, Tailwind CSS v4, shadcn/ui, Motion, TanStack
Query, Zustand, next-themes, PWA, Mapbox, Recharts.
**Backend** — FastAPI, async SQLAlchemy, Alembic, Pydantic, JWT/OAuth2.
**AI** — Google Gemini (embeddings + insights), with deterministic fallbacks; Qdrant-ready.
**Infra** — PostgreSQL, Redis + Celery, Cloudflare R2. Deploy: Vercel (frontend),
Railway/Fly.io (backend), GitHub Actions + Docker.

## Features

- **Customizable dashboard** — draggable, resizable, glassmorphic widgets on a
  responsive layout engine; layout persists per user.
- **Widgets** — Spotify (animated waveform), Life Pulse, Memories, Travel, Taste,
  Today, Growth, Quote, plus AI **Insights** and **Timeline**.
- **5-step onboarding** with live accent/theme personalization.
- **Auth** — email/JWT + Google OAuth scaffold.
- **Background pipeline** — Celery sync services normalize data into snapshots;
  the AI layer generates embeddings, insights, and a timeline.
- **Hybrid search** — ⌘K command palette over keyword + semantic embeddings.
- **Recaps & share cards** — weekly/monthly summaries exportable as Story images.
- **Installable PWA** — offline app shell, true-AMOLED dark UI.

## Getting started

**Frontend**

```bash
cd frontend
npm install
npm run dev              # http://localhost:3000
```

**Backend** (runs on SQLite + eager Celery with zero extra infra)

```bash
cd backend
python3 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
./.venv/bin/alembic upgrade head
./.venv/bin/uvicorn app.main:app --reload   # http://localhost:8000
```

**Everything via Docker** (Postgres + Redis + Qdrant + API)

```bash
docker compose up
```

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` →
`frontend/.env.local` to configure. All AI/integration features run on
deterministic fallbacks out of the box; add `GEMINI_API_KEY` (real AI) and Spotify
credentials (real music) to enable the real providers.

## Deployment

- **Frontend** → Vercel (root directory `frontend/`), or `frontend/Dockerfile`.
- **Backend** → Railway / Fly.io via `backend/Dockerfile`.
- **Postgres** → Neon · **Redis** → Upstash · **Vectors** → Qdrant · **Storage** → Cloudflare R2.
- **CI** → GitHub Actions (`.github/workflows/ci.yml`) lints + builds both apps.

## Status

✅ Feature-complete across the phased roadmap (frontend, backend, AI, search,
recaps, PWA). See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the roadmap
and the Widget SDK design.
