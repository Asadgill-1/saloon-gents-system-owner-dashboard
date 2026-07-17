# Saloon Platform Owner Dashboard

Phase 3 of the **Gents Saloon multi-tenant barbershop system**: the platform owner's web console — the whole business managed from one place.

- Shop onboarding wizard (web twin of the Master-bot flow: hours, bot tokens, services, barbers, commission rules)
- Shops management (staff, services, commission history, suspend/activate, token replacement)
- Global analytics across all shops
- Escalations console (AI guardrail hits → block/monitor/resolve)
- Blocked users, bot health board, audit explorer

**Status: not built yet.** This repo will hold a Next.js (App Router) + Tailwind + shadcn/ui app at the repo root, `app_role=platform_admin` only, desktop-first. Deploys on **Vercel from `main`**.

## For any AI working here

1. Read [CLAUDE.md](CLAUDE.md) — coding rules (mandatory).
2. Read [docs/SECURITY.md](docs/SECURITY.md) — binding security rules S1–S11 (mandatory before any code).
3. Read [docs/PHASE_3_PLATFORM_DASHBOARD.md](docs/PHASE_3_PLATFORM_DASHBOARD.md) — the exact build plan (tasks T3.1–T3.6 with acceptance criteria).
4. Follow [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — locked tokens (§7 covers this dashboard).
5. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — where this app sits in the system.

Canonical docs + full plan + backend: **https://github.com/Asadgill-1/gents-saloon-backend** (docs/MASTER_PLAN.md is the entry point). Doc copies here carry a synced-copy header — edit the canonical version first. **Prerequisites: backend Phases 0–1 and the shop dashboard (Phase 2) must exist first**; shared UI components are copied from [saloon-shop-dashboard](https://github.com/Asadgill-1/saloon-shop-dashboard), not imported.

## Stack

Next.js App Router · Tailwind · shadcn/ui · Supabase JS (Auth email/password) · Lucide · Recharts. English only, dark theme default, desktop-first (≥1280px).

## Env (`.env.local` + Vercel project settings)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=   # backend URL; local dev: http://localhost:8000
```
