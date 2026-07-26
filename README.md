# Gents Saloon Platform Dashboard

> New agent or resumed session: read [STATUS.md](STATUS.md) first.

Phase 5 frontend for the platform owner’s SaaS operations.

- Business-first onboarding with one primary owner and multiple shops.
- Business-wide or per-shop manual cash subscriptions.
- Due/expired views, hard suspend/resume, append-only receipts/reversals.
- Tenant exports and export-first soft offboarding.
- Global analytics, bot fleet, escalations, blocks, audit/security, and backup status.

Status: Phase 0 Next.js foundation and the narrow Phase 1 T1.5 database-authorized global platform shell are verified. Shared backend Phase 2 T2.0–T2.3 is complete and T2.4 checkout/payments/commission is next; Phase 1 audit gates remain open. Platform product screens still begin in Phase 5 after the backend gates.

## Required reading

1. [Current status](STATUS.md)
2. [CLAUDE.md](CLAUDE.md)
3. [Security](docs/SECURITY.md)
4. [Phase 5 checklist](docs/PHASE_5_PLATFORM_DASHBOARD.md)
5. [Design system](docs/DESIGN_SYSTEM.md)
6. [Architecture](docs/ARCHITECTURE.md)

Canonical backend/docs: [gents-saloon-backend](https://github.com/Asadgill-1/gents-saloon-backend).

## Stack

Current foundation: Next.js App Router, strict TypeScript, Tailwind, Supabase SSR Auth, and a server-only FastAPI platform-authorization check. Planned Phase 5 additions such as shadcn/Radix, Lucide, charts, and product integrations are not installed or implemented yet.

## Public frontend environment

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

No service-role key, database URL, bot/AI token, or global authorization rule belongs in this repository.

Next.js DevTools MCP is not installed. Version `0.4.0` was removed after it introduced unresolved High dependency advisories; wait for an audited fixed release.
