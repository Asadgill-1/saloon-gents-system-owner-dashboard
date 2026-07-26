import assert from "node:assert/strict";
import test from "node:test";

import { classifyPlatformAccess } from "../lib/backend-contracts.ts";

test("only a database-derived platform administrator reaches the shell", () => {
  assert.equal(
    classifyPlatformAccess(200, { is_platform_admin: true }).kind,
    "ready",
  );
  assert.equal(
    classifyPlatformAccess(200, { is_platform_admin: false }).kind,
    "unavailable",
  );
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
