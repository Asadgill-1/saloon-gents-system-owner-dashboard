import assert from "node:assert/strict";
import test from "node:test";

import { classifyPlatformAccess, parseTenants } from "../lib/backend-contracts.ts";

test("only a database-derived platform administrator reaches the shell", () => {
  assert.equal(
    classifyPlatformAccess(200, { is_platform_admin: true, display_name: "Admin" }).kind,
    "ready",
  );
  assert.equal(
    classifyPlatformAccess(200, { is_platform_admin: false }).kind,
    "unavailable",
  );
});

test("tenant pages require the complete platform API shape", () => {
  const parsed = parseTenants({ items: [{ id: "10000000-0000-4000-8000-000000000001", legal_name: "Business LLC", display_name: "Business", billing_mode: "business", status: "active", shop_count: 2, created_at: "2026-07-31T00:00:00Z" }], next_cursor: null });
  assert.equal(parsed?.items[0]?.shopCount, 2);
  assert.equal(parseTenants({ items: [{ id: "missing-fields" }], next_cursor: null }), null);
});

test("platform errors and tenant identities expose no internal detail", () => {
  for (const status of [403, 404, 423, 500, 503]) {
    assert.equal(
      classifyPlatformAccess(status, { detail: "private" }).kind,
      "unavailable",
    );
  }
  assert.equal(classifyPlatformAccess(401, null).kind, "unauthenticated");
});
