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
**AI** — OpenAI, Gemini, Sentence Transformers, CLIP, BLIP, Qdrant (vectors).
**Infra** — PostgreSQL, Redis + Celery, Cloudflare R2. Deploy: Vercel (frontend),
Railway/Fly.io (backend), GitHub Actions + Docker.

## Getting started

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

The backend and AI services come online in later phases (see `docs/ARCHITECTURE.md`).

## Status

🚧 Early development — building frontend-first with mock data. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the phased roadmap.
