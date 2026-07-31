import assert from "node:assert/strict";
import test from "node:test";

import { readPublicEnvironment } from "../lib/env.ts";

test("reads valid development environment", () => {
  const env = readPublicEnvironment({
    NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-public-anon-key",
    NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000",
    NODE_ENV: "development",
  });
  assert.equal(env.apiBaseUrl, "http://localhost:8000");
});

test("rejects missing and placeholder values", () => {
  assert.throws(() => readPublicEnvironment({}), /Missing public environment/);
  assert.throws(() => readPublicEnvironment({ NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "replace-me", NEXT_PUBLIC_API_BASE_URL: "https://api.company.test" }), /placeholder values/);
});

test("requires HTTPS in production", () => {
  assert.throws(() => readPublicEnvironment({ NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-public-anon-key", NEXT_PUBLIC_API_BASE_URL: "http://api.company.test", NODE_ENV: "production" }), /must use HTTPS/);
});
