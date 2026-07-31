# Current Status — Platform Dashboard

Last updated: **2026-07-31, Asia/Dubai**

Repository phase: **Phase 5 incomplete; recovery branch contains a visual prototype**

Shared backend phase: **Phase 2 T2.0–T2.8 complete; Phase 2 security audit verified (docs/security-audits/PHASE_2_2026-07-26.md). Phase 3 Telegram & AI next. Inherited Phase 1 audit gates remain open.**
Product phase: **Phase 5 not complete; SSR auth, backend operations, E2E, and security audit remain**

Read this file first when this repository is shared independently.

## Implemented

- Locked Next.js 16, React 19, Tailwind 4, strict TypeScript, ESLint, and npm dependencies.
- Supabase SSR browser/server/proxy clients.
- Proxy session refresh plus server-side claims verification in the protected route group.
- Public `/login` with a retained dark-gold visual design; cookie-based SSR sign-in still needs repair.
- Protected `/` global platform visual shell with 6 prototype modules:
  - **Platform Header**: session-aware admin display and sign-out.
  - **Tenant Fleet**: table with onboarding modal, subscription status, and search.
  - **Billing & Cash Receipts**: receipt recording and reversal.
  - **Offboarding & Export**: guided confirmation workflow.
  - **Bot Fleet Health**: per-tenant bot status monitor.
  - **SaaS Executive Analytics**: revenue, tenant, and growth KPIs.
- The root server component verifies Supabase claims, forwards only the raw access token to `GET /api/v1/me/context`, and admits only a database-derived active platform administrator.
- Tenant owners/staff, authorization failures, and backend errors receive one neutral `Access unavailable` state with no tenant data.
- Platform authorization does not call a tenant entitlement route, so a suspended tenant cannot block global platform administration.
- Server-side sign-out action verifies claims before clearing the Supabase session.
- Responsive semantic light-platform status UI using canonical stone/gold tokens, visible focus, and 44px controls.
- Production HTTPS environment validation.
- CSP, HSTS, referrer, frame, content-type, and permissions headers (CSP `connect-src` hardcoded for Supabase URL).
- SHA-pinned, read-only GitHub CI with full-history secret scan, `npm ci --ignore-scripts`, audit, lint, types, tests, and build.
- Four environment/platform-authorization contract/privacy tests.
- A prior Vercel deployment exists, but it is not production-ready or Phase 5 completion evidence.

Latest local evidence:

```text
npm run check                 PASS — lint, TypeScript, 4 tests, production build
npm audit --audit-level=high  PASS — 0 vulnerabilities
```

Last remote-main checkpoint before recovery: `7c08910`; recovery work is isolated on `codex/full-recovery`.

## Inherited authentication and configuration defect

Login at `saloon-gents-system-owner-dashboard.vercel.app/login` returns **"Invalid path specified in request URL"** from the Supabase client on sign-in.

**Confirmed working:**
- Supabase URL `https://butoxkmxkaybajoqrpza.supabase.co` and anon key are valid.
- Direct Node.js HTTP POST to `/auth/v1/token?grant_type=password` returns HTTP 200 with valid JWT.
- User `admin@saloon.com` exists in Supabase Auth and credentials work.
- Local build and all tests pass.

**Unsafe workarounds to remove:**
1. `NEXT_PUBLIC_*` env vars set in Vercel project settings (Production and Preview).
2. Supabase URL and anon key were hardcoded as fallbacks in `lib/supabase/client.ts`, `server.ts`, and `proxy.ts`.
3. CSP `connect-src` was hardcoded to include one Supabase project in `next.config.ts`.
4. The browser client was switched away from the supported cookie-based `createBrowserClient` pattern.

**Likely remaining causes:**
1. Version incompatibility: `@supabase/supabase-js` v2.110.8 / `@supabase/ssr` v0.12.3 on Vercel serverless runtime.
2. Proxy middleware `getClaims()` may construct an invalid JWKS path on server side.
3. Vercel Edge/Node runtime may handle the Supabase client differently.
4. Non-SSR `createClient` may not handle cookies properly in Vercel context.

## Not implemented

- Cookie-based Supabase SSR sign-in without hardcoded project fallbacks.
- Real tenant/shop onboarding, staff invitation, bot setup, legal/tax, billing, receipt/reversal, suspension, offboarding, health, audit, and analytics backend flows.
- Pagination and double-confirmed high-impact mutations.
- Backend deployment to production (runs locally only; `NEXT_PUBLIC_API_BASE_URL` requires a live backend).
- E2E tests.

## Current next action

Restore supported Supabase SSR/authentication, remove hardcoded project/API fallbacks, and connect each retained screen to the backend before the Phase 5 Playwright and security gates.

## Security and MCP

- No service-role key, database URL, bot token, AI token, or global authorization rule belongs in this repository or a `NEXT_PUBLIC_*` variable.
- The Supabase publishable/anon key remains public but must be supplied by environment configuration so staging, previews, and production stay isolated.
- Middleware/proxy is not the sole authorization control; protected layouts/routes and every API operation must verify platform authorization server-side.
- Current framework-compatible CSP permits inline bootstrap scripts. Replace with nonce/hash CSP before production.
- `next-devtools-mcp@0.4.0` was removed because it introduced unresolved High npm advisories. Do not install it until an audited fixed release exists.
- Root finding P0-SEC-010 is fixed: the dashboard uses Next's direct ESLint plugin flat config, and its full dependency audit is clean.
