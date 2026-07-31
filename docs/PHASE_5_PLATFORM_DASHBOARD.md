# Phase 5 — Platform Dashboard and SaaS Operations

> Synced from the canonical backend repository. Edit canonical first.

## Status — 2026-07-31

**Incomplete; operational recovery is in progress.** Cookie-based Supabase SSR, database-derived platform authorization, FastAPI-backed operational views, keyset pagination, guarded idempotent server actions, and nonce-based script CSP are implemented on the recovery branch. Remaining platform modules, staging E2E/accessibility gates, and the dated Phase 5 security audit are still required. See [../STATUS.md](../STATUS.md).

## Outcome

The platform owner manages businesses, shops, cash subscriptions, bot fleet, security, exports, and offboarding from one production console.

## Work

1. Apply the UI implementation skills named in CLAUDE.md and build a business-first information architecture.
2. Build business/primary-owner onboarding, multi-shop creation, staff invites, bot setup status, and legal/tax configuration.
3. Build billing-mode setup/change, sequential cash receipt/reversal, due/expired filters, suspend/resume, and immutable history.
4. Build export generation/download state and guarded offboarding workflow.
5. Build global/business/shop analytics, bot fleet health, escalations, blocked users, audit explorer, backup/export status, and security events.
6. Require explicit reason and double confirmation for destructive/high-impact operations; show scope before confirmation.
7. Keep platform API authorization and audit server-side; frontend holds no global Supabase mutation policy.

## Gates

- A shop/business owner receives no platform route/API data.
- Cash payment extends only the selected billing scope; mode change cannot overlap coverage.
- Suspend/resume/export/offboard UI passes full API/state/audit E2E.
- Historical commission/subscription/financial rows cannot be silently edited.
- 50-shop/201-bot health view paginates and remains usable.
- Accessibility, responsive, build, dependency, and bundle-secret checks pass.
- Run the mandatory full phase security audit, write its dated audit note, and leave zero unresolved Critical/High findings.
- Run `ponytail-debt`.
