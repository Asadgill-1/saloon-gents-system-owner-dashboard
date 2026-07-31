import "server-only";

import { readPublicEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import {
  classifyPlatformAccess,
  parseAnalytics,
  parseBots,
  parseOffboarding,
  parseReceipts,
  parseSubscriptions,
  parseTenants,
  type PlatformAccessState,
  type PlatformDataState,
} from "@/lib/backend-contracts";

type BackendResponse = { status: number; body: unknown; requestId: string | null };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean { return UUID_PATTERN.test(value); }

async function verifiedAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error || !claimsData?.claims) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function authorizedBackendRequest(path: string, init: RequestInit = {}): Promise<BackendResponse> {
  const token = await verifiedAccessToken();
  if (!token) return { status: 401, body: null, requestId: null };
  const env = readPublicEnvironment();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body) headers.set("Content-Type", "application/json");
  const response = await fetch(new URL(path, env.apiBaseUrl), { ...init, headers, cache: "no-store" });
  return { status: response.status, body: await response.json().catch(() => null), requestId: response.headers.get("x-request-id") };
}

export async function getPlatformAccess(): Promise<PlatformAccessState> {
  try {
    const response = await authorizedBackendRequest("/api/v1/me/context");
    return classifyPlatformAccess(response.status, response.body);
  } catch {
    return { kind: "unavailable" };
  }
}

type Cursors = Partial<Record<"tenants" | "subscriptions" | "receipts" | "offboarding" | "bots" | "analytics", string>>;

function query(cursor: string | undefined): string {
  const params = new URLSearchParams({ limit: "50" });
  if (cursor && isUuid(cursor)) params.set("cursor", cursor);
  return params.toString();
}

export async function getPlatformData(cursors: Cursors = {}): Promise<PlatformDataState> {
  try {
    const [tenantsResponse, subscriptionsResponse, receiptsResponse, offboardingResponse, botsResponse, analyticsResponse] = await Promise.all([
      authorizedBackendRequest(`/api/v1/platform/tenants?${query(cursors.tenants)}`),
      authorizedBackendRequest(`/api/v1/platform/subscriptions?${query(cursors.subscriptions)}`),
      authorizedBackendRequest(`/api/v1/platform/subscriptions/cash-receipts?${query(cursors.receipts)}`),
      authorizedBackendRequest(`/api/v1/platform/offboarding-cases?${query(cursors.offboarding)}`),
      authorizedBackendRequest(`/api/v1/platform/bots/health?${query(cursors.bots)}`),
      authorizedBackendRequest(`/api/v1/platform/analytics?${query(cursors.analytics)}`),
    ]);
    const responses = [tenantsResponse, subscriptionsResponse, receiptsResponse, offboardingResponse, botsResponse, analyticsResponse];
    if (responses.some((response) => response.status === 401)) return { kind: "unauthenticated" };
    const failure = responses.find((response) => response.status !== 200);
    if (failure) return { kind: "unavailable", requestId: failure.requestId };
    const tenants = parseTenants(tenantsResponse.body);
    const subscriptions = parseSubscriptions(subscriptionsResponse.body);
    const receipts = parseReceipts(receiptsResponse.body);
    const offboarding = parseOffboarding(offboardingResponse.body);
    const bots = parseBots(botsResponse.body);
    const analytics = parseAnalytics(analyticsResponse.body);
    if (!tenants || !subscriptions || !receipts || !offboarding || !bots || !analytics) return { kind: "unavailable", requestId: null };
    return { kind: "ready", data: { tenants, subscriptions, receipts, offboarding, bots, analytics } };
  } catch {
    return { kind: "unavailable", requestId: null };
  }
}
