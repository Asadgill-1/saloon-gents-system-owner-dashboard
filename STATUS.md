# Current Status — Platform Dashboard

Last updated: **2026-07-31, Asia/Dubai**

Repository phase: **Phase 5 incomplete; operational recovery is in progress**

Shared backend phase: **Phase 2 T2.0–T2.8 complete; Phase 2 security audit verified (docs/security-audits/PHASE_2_2026-07-26.md). Phase 3 Telegram & AI next. Inherited Phase 1 audit gates remain open.**
Product phase: **Phase 5 not complete; core SSR/backend operations are implemented, but remaining modules, E2E/accessibility, staging proof, and security audit remain**

Read this file first when this repository is shared independently.

## Implemented

- Locked Next.js 16, React 19, Tailwind 4, strict TypeScript, ESLint, and npm dependencies.
- Supabase SSR browser/server/proxy clients.
- Proxy session refresh plus server-side claims verification in the protected route group.
- Real cookie-based Supabase SSR email/password sign-in with safe user-facing errors and no hardcoded project fallback.
- Protected platform console backed by `GET /platform/tenants`, subscriptions, cash receipts, offboarding cases, bot health, and analytics.
- Tenant onboarding, shop creation, staff invitations, bot registration, legal/tax setup, billing-mode transition, cash receipts/reversals, subscription suspend/resume, and offboarding delivery/archive use authenticated idempotent Server Actions.
- Suspension, reversal, billing-mode, delivery, offboarding, and archive flows require a reason where applicable plus typed scope and `CONFIRM` checks.
- UUID keyset pagination renders at most 50 tenant/subscription/receipt/offboarding/bot/analytics rows per page; the 201-bot fleet is no longer hardcoded.
- Backend request IDs are shown with stable safe errors; raw API/Supabase messages are not exposed.
- The root server component verifies Supabase claims, forwards only the raw access token to `GET /api/v1/me/context`, and admits only a database-derived active platform administrator.
- Tenant owners/staff, authorization failures, and backend errors receive one neutral `Access unavailable` state with no tenant data.
- Platform authorization does not call a tenant entitlement route, so a suspended tenant cannot block global platform administration.
- Server-side sign-out action verifies claims before clearing the Supabase session.
- Responsive semantic light-platform status UI using canonical stone/gold tokens, visible focus, and 44px controls.
- Fail-closed production HTTPS environment validation with no placeholder, project, API-domain, or localtunnel fallbacks.
- Request-nonce script CSP plus HSTS, referrer, frame, content-type, and permissions headers.
- SHA-pinned, read-only GitHub CI with full-history secret scan, `npm ci --ignore-scripts`, audit, lint, types, tests, and build.
- Six environment/platform-authorization/response-contract tests.
- A prior Vercel deployment exists, but it is not production-ready or Phase 5 completion evidence.

Latest local evidence:

```text
npm run check                 PASS — lint, TypeScript, 6 tests, production build
npm audit --audit-level=high  PASS — 0 vulnerabilities
```

Last remote-main checkpoint before recovery: `7c08910`; recovery work is isolated on `codex/full-recovery`.

## Authentication and configuration recovery

The unsupported browser client, embedded Supabase URL/public key, API/localtunnel fallbacks, and hardcoded CSP source were removed. Browser, Server Component, Server Action, and proxy clients now use the supported `@supabase/ssr` cookie pattern and fail closed when environment configuration is absent. Live isolated-staging/Vercel authentication proof is still required before the defect is considered production-closed.

## Not implemented

- Standalone export request/download UI, audit/security/backup/escalation/blocked-user views, and detailed business/shop drill-down.
- Shop-ID discovery/detail reads for setup forms; the current recovery form requires the database-authorized shop UUID.
- Signed export download and checksum display after export completion.
- Backend deployment to production (runs locally only; `NEXT_PUBLIC_API_BASE_URL` requires a live backend).
- E2E tests.

## Current next action

Complete the remaining platform modules and shop detail read interface, then run isolated-staging Playwright/accessibility and the dated Phase 5 security audit.

## Security and MCP

- No service-role key, database URL, bot token, AI token, or global authorization rule belongs in this repository or a `NEXT_PUBLIC_*` variable.
- The Supabase publishable/anon key remains public but must be supplied by environment configuration so staging, previews, and production stay isolated.
- Middleware/proxy is not the sole authorization control; protected layouts/routes and every API operation must verify platform authorization server-side.
- Production script CSP is request-nonce based; style inline permission remains limited to framework/CSS requirements and must be reviewed in the Phase 5 audit.
- `next-devtools-mcp@0.4.0` was removed because it introduced unresolved High npm advisories. Do not install it until an audited fixed release exists.
- Root finding P0-SEC-010 is fixed: the dashboard uses Next's direct ESLint plugin flat config, and its full dependency audit is clean.
