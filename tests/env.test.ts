import assert from "node:assert/strict";
import test from "node:test";

import { readPublicEnvironment } from "../lib/env.ts";

test("reads valid development environment", () => {
  const env = readPublicEnvironment({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000",
    NODE_ENV: "development",
  });
  assert.equal(env.apiBaseUrl, "http://localhost:8000");
});

test("provides fallback values when env is empty", () => {
  const env = readPublicEnvironment({});
  assert.equal(env.apiBaseUrl, "https://api.gents-saloon.com");
  assert.equal(env.supabaseUrl, "https://placeholder.supabase.co");
});
