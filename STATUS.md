# Current Status — Platform Dashboard

Last updated: **2026-07-26, Asia/Dubai**

Repository phase: **Phase 0 foundation plus Phase 1 T1.5 global authorization shell complete locally**


Shared backend phase: **Phase 2 T2.0–T2.4 complete; T2.5 void/refund/credit-note reversal is next. Phase 1 audit gates remain open.**
Product phase: **Phase 5 not started**

Read this file first when this repository is shared independently.

## Implemented

- Locked Next.js 16, React 19, Tailwind 4, strict TypeScript, ESLint, and npm dependencies.
- Supabase SSR browser/server/proxy clients.
- Proxy session refresh plus server-side claims verification in the protected route group.
- Public `/login` placeholder and protected `/` global platform shell.
- The root server component verifies Supabase claims, forwards only the raw access token to `GET /api/v1/me/context`, and admits only a database-derived active platform administrator.
- Tenant owners/staff, authorization failures, and backend errors receive one neutral `Access unavailable` state with no tenant data.
- Platform authorization does not call a tenant entitlement route, so a suspended tenant cannot block global platform administration.
- Server-side sign-out action verifies claims before clearing the Supabase session.
- Responsive semantic light-platform status UI using canonical stone/gold tokens, visible focus, and 44px controls.
- Production HTTPS environment validation.
- CSP, HSTS, referrer, frame, content-type, and permissions headers.
- SHA-pinned, read-only GitHub CI with full-history secret scan, `npm ci --ignore-scripts`, audit, lint, types, tests, and build.
- Three environment tests plus two platform-authorization contract/privacy tests.

Latest local evidence:

```text
npm run check                 PASS — lint, TypeScript, 5 tests, production build
npm audit --audit-level=high  PASS — 0 vulnerabilities
```

Shared backend evidence confirms thirteen migrations are applied to the project-scoped Supabase development project and all 37 public tables are forced-RLS-enabled; only eight controlled journal-account rows exist and tenant/transaction tables remain empty. Security Advisor has zero findings and missing FK indexes are zero. T2.4 now provides idempotent completed-booking checkout with trusted legal/service/commission selection, inclusive/exclusive VAT, discounts, split cash/card tender, separate tips, restricted commission snapshots, cash-shift linkage, and a balanced append-only journal. Refunds, advances, and payouts remain later Phase 2 tasks. The prior dashboard checkpoint is clean and pushed at `b22ee5b`, and its GitHub Actions audit/lint/type/test/build pipeline passed; this synchronized T2.4 `STATUS.md` update is the current local change after that hash. The Phase 1 audit is not passed until credential rotation, authenticated repository-protection evidence, and a live Storage object round trip are proven.

## Not implemented

- Real platform-admin sign-in form/recovery UX.
- Frontend business/owner/shop onboarding screens (the backend API exists).
- Frontend cash receipt, billing-mode, due/expired, and suspend/resume screens (the backend APIs exist).
- Frontend export/offboarding workflow, analytics, bot fleet, escalations, blocks, audit/security, backup status, or E2E tests. The export/offboarding backend APIs now exist.
- The T1.5 authorization check is the only FastAPI integration; no Phase 5 product module has started.

## Prerequisites before Phase 5

Do not build screens against invented contracts. Wait for the canonical backend to expose and verify the Phase 1 tenant/SaaS APIs and the later reporting, bot-fleet, export, and security APIs used by this console.

Canonical source: [gents-saloon-backend](https://github.com/Asadgill-1/gents-saloon-backend). Its `START_HERE.md` is the cross-repository authority.

## Current next action

Continue shared backend Phase 2 T2.5 void/refund/credit-note reversal while preserving the open Phase 1 gates. This repository's current foundation is already reviewed, committed, pushed, and green in CI. Do not start Phase 5 yet.

When Phase 5 is authorized, begin with `docs/PHASE_5_PLATFORM_DASHBOARD.md`, use the four required UI skills, implement server-verified platform-admin context first, and run the mandatory phase security audit before completion.

## Security and MCP

- No service-role key, database URL, bot token, AI token, or global authorization rule belongs in this repository or a `NEXT_PUBLIC_*` variable.
- Middleware/proxy is not the sole authorization control; protected layouts/routes and every API operation must verify platform authorization server-side.
- Current framework-compatible CSP permits inline bootstrap scripts. Replace with nonce/hash CSP before production.
- `next-devtools-mcp@0.4.0` was removed because it introduced unresolved High npm advisories. Do not install it until an audited fixed release exists.
- Root finding P0-SEC-010 is fixed: the dashboard uses Next's direct ESLint plugin flat config, and its full dependency audit is clean.
