export type PlatformAccessState =
  | { kind: "ready"; displayName: string }
  | { kind: "unauthenticated" }
  | { kind: "unavailable" };

export type Page<T> = { items: T[]; nextCursor: string | null };
export type TenantItem = { id: string; legalName: string; displayName: string; billingMode: string; status: string; shopCount: number; createdAt: string };
export type SubscriptionItem = { id: string; businessId: string; shopId: string | null; scope: string; status: string; paidFrom: string; paidUntil: string; manualOverrideUntil: string | null };
export type ReceiptItem = { id: string; subscriptionId: string; businessId: string; shopId: string | null; amount: string; currency: string; reference: string; sequence: number; collectedAt: string; coverageFrom: string; coverageUntil: string; reversalOfId: string | null };
export type OffboardingItem = { id: string; businessId: string; shopId: string | null; scope: string; reason: string; exportId: string; state: string; requestedAt: string; deliveredAt: string | null; archivedAt: string | null };
export type BotHealthItem = { id: string; businessId: string | null; shopId: string | null; role: string; username: string; active: boolean; healthy: boolean; lastHealthAt: string | null };
export type AnalyticsItem = { id: string; businessId: string; displayName: string; shopCount: number; activeSubscriptionCount: number; botCount: number; unhealthyBotCount: number; cashCollected: string };
export type PlatformData = { tenants: Page<TenantItem>; subscriptions: Page<SubscriptionItem>; receipts: Page<ReceiptItem>; offboarding: Page<OffboardingItem>; bots: Page<BotHealthItem>; analytics: Page<AnalyticsItem> };
export type PlatformDataState = { kind: "ready"; data: PlatformData } | { kind: "unauthenticated" } | { kind: "unavailable"; requestId: string | null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function nullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function money(value: unknown): string | null {
  return typeof value === "string" || typeof value === "number" ? String(value) : null;
}

function page(body: unknown): { items: Record<string, unknown>[]; nextCursor: string | null } | null {
  if (!isRecord(body) || !Array.isArray(body.items) || !body.items.every(isRecord) || !nullableString(body.next_cursor)) return null;
  return { items: body.items, nextCursor: body.next_cursor };
}

export function classifyPlatformAccess(status: number, body: unknown): PlatformAccessState {
  if (status === 401) return { kind: "unauthenticated" };
  if (status === 200 && isRecord(body) && body.is_platform_admin === true && typeof body.display_name === "string") {
    return { kind: "ready", displayName: body.display_name };
  }
  return { kind: "unavailable" };
}

export function parseTenants(body: unknown): Page<TenantItem> | null {
  const source = page(body); if (!source) return null;
  const items: TenantItem[] = [];
  for (const item of source.items) {
    if (typeof item.id !== "string" || typeof item.legal_name !== "string" || typeof item.display_name !== "string" || typeof item.billing_mode !== "string" || typeof item.status !== "string" || typeof item.shop_count !== "number" || typeof item.created_at !== "string") return null;
    items.push({ id: item.id, legalName: item.legal_name, displayName: item.display_name, billingMode: item.billing_mode, status: item.status, shopCount: item.shop_count, createdAt: item.created_at });
  }
  return { items, nextCursor: source.nextCursor };
}

export function parseSubscriptions(body: unknown): Page<SubscriptionItem> | null {
  const source = page(body); if (!source) return null;
  const items: SubscriptionItem[] = [];
  for (const item of source.items) {
    if (typeof item.id !== "string" || typeof item.business_id !== "string" || !nullableString(item.shop_id) || typeof item.scope !== "string" || typeof item.status !== "string" || typeof item.paid_from !== "string" || typeof item.paid_until !== "string" || !nullableString(item.manual_override_until)) return null;
    items.push({ id: item.id, businessId: item.business_id, shopId: item.shop_id, scope: item.scope, status: item.status, paidFrom: item.paid_from, paidUntil: item.paid_until, manualOverrideUntil: item.manual_override_until });
  }
  return { items, nextCursor: source.nextCursor };
}

export function parseReceipts(body: unknown): Page<ReceiptItem> | null {
  const source = page(body); if (!source) return null;
  const items: ReceiptItem[] = [];
  for (const item of source.items) {
    const amount = money(item.amount);
    if (typeof item.id !== "string" || typeof item.subscription_id !== "string" || typeof item.business_id !== "string" || !nullableString(item.shop_id) || !amount || typeof item.currency !== "string" || typeof item.receipt_reference !== "string" || typeof item.receipt_sequence !== "number" || typeof item.collected_at !== "string" || typeof item.coverage_from !== "string" || typeof item.coverage_until !== "string" || !nullableString(item.reversal_of_id)) return null;
    items.push({ id: item.id, subscriptionId: item.subscription_id, businessId: item.business_id, shopId: item.shop_id, amount, currency: item.currency, reference: item.receipt_reference, sequence: item.receipt_sequence, collectedAt: item.collected_at, coverageFrom: item.coverage_from, coverageUntil: item.coverage_until, reversalOfId: item.reversal_of_id });
  }
  return { items, nextCursor: source.nextCursor };
}

export function parseOffboarding(body: unknown): Page<OffboardingItem> | null {
  const source = page(body); if (!source) return null;
  const items: OffboardingItem[] = [];
  for (const item of source.items) {
    if (typeof item.id !== "string" || typeof item.business_id !== "string" || !nullableString(item.shop_id) || typeof item.scope !== "string" || typeof item.reason !== "string" || typeof item.export_id !== "string" || typeof item.state !== "string" || typeof item.requested_at !== "string" || !nullableString(item.delivered_at) || !nullableString(item.archived_at)) return null;
    items.push({ id: item.id, businessId: item.business_id, shopId: item.shop_id, scope: item.scope, reason: item.reason, exportId: item.export_id, state: item.state, requestedAt: item.requested_at, deliveredAt: item.delivered_at, archivedAt: item.archived_at });
  }
  return { items, nextCursor: source.nextCursor };
}

export function parseBots(body: unknown): Page<BotHealthItem> | null {
  const source = page(body); if (!source) return null;
  const items: BotHealthItem[] = [];
  for (const item of source.items) {
    if (typeof item.id !== "string" || !nullableString(item.business_id) || !nullableString(item.shop_id) || typeof item.role !== "string" || typeof item.bot_username !== "string" || typeof item.active !== "boolean" || typeof item.healthy !== "boolean" || !nullableString(item.last_health_at)) return null;
    items.push({ id: item.id, businessId: item.business_id, shopId: item.shop_id, role: item.role, username: item.bot_username, active: item.active, healthy: item.healthy, lastHealthAt: item.last_health_at });
  }
  return { items, nextCursor: source.nextCursor };
}

export function parseAnalytics(body: unknown): Page<AnalyticsItem> | null {
  const source = page(body); if (!source) return null;
  const items: AnalyticsItem[] = [];
  for (const item of source.items) {
    const cashCollected = money(item.cash_collected);
    if (typeof item.id !== "string" || typeof item.business_id !== "string" || typeof item.display_name !== "string" || typeof item.shop_count !== "number" || typeof item.active_subscription_count !== "number" || typeof item.bot_count !== "number" || typeof item.unhealthy_bot_count !== "number" || !cashCollected) return null;
    items.push({ id: item.id, businessId: item.business_id, displayName: item.display_name, shopCount: item.shop_count, activeSubscriptionCount: item.active_subscription_count, botCount: item.bot_count, unhealthyBotCount: item.unhealthy_bot_count, cashCollected });
  }
  return { items, nextCursor: source.nextCursor };
}
