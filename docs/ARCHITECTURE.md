# Luma — Architecture & Roadmap

## Core idea

The **dashboard is the product**; AI is the background engine. Luma is a
desktop-first responsive **Next.js PWA** (installable on Android, iOS, Mac, Windows —
no app stores) backed by a **FastAPI** service layer and an **AI** subsystem for
embeddings, vision, insights, and hybrid search.

## The Widget SDK (the defining decision)

Rather than hard-coding cards into the dashboard, every widget is an **independent
module** implementing a shared contract:

- **Backend sync service** — pulls & normalizes data from a source (Spotify, Google
  Photos, Calendar, …) into a common shape.
- **Frontend renderer** — a React component that receives typed widget data and
  renders it, with its own supported sizes.
- **Manifest** — metadata (id, title, icon, default size, required scopes).

The **dashboard is a layout engine**: it reads the user's selected widgets + saved
layout and renders them responsively (2-col+ grid on desktop → vertical feed on
mobile). Adding a new source (GitHub, Goodreads, Netflix, Apple Health, Steam…) means
implementing the interface — never editing the dashboard.

## Monorepo layout

```
luma/
├── frontend/   Next.js PWA — dashboard, widget renderers, onboarding
├── backend/    FastAPI — auth, per-widget sync services, timeline, search API
├── ai/         embeddings, hybrid search, insights, vision (CLIP/BLIP)
├── docker/     compose (Postgres, Redis, Qdrant) & container defs
└── docs/       this file + design system notes
```

## Background pipeline (later phases)

```
new data synced → queue job → extract metadata → embeddings →
image captions → detect places → create timeline events → store → update dashboard
```

Runs asynchronously via Redis + Celery.

## Phased roadmap

| Phase | Deliverable |
|-------|-------------|
| **0** | Foundation — monorepo, Next.js + Tailwind v4 + shadcn/ui, AMOLED theme, PWA baseline ✅ *(in progress)* |
| **1** | Widget SDK contract + responsive layout engine + hero widgets on mock data |
| **2** | Onboarding (5 steps) |
| **3** | Backend core — FastAPI clean architecture, Postgres, JWT/OAuth |
| **4** | Spotify widget end-to-end (sync service + live renderer) |
| **5** | Background pipeline + Photos / Calendar / Location |
| **6** | AI layer — embeddings, captions, insights, timeline (Qdrant) |
| **7** | Hybrid natural-language search |
| **8** | Weekly/monthly summaries + shareable Story cards |
| **9** | Polish, performance, Docker, deploy |

## Design language

True AMOLED black · glassmorphism · floating cards · soft shadows · subtle blur ·
brand gradients (violet → cyan) · micro-interactions · physics-based scroll · 60fps.
Dark mode only. Per-user accent color chosen during onboarding.
