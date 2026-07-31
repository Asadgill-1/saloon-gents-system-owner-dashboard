"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { PlatformActionState } from "@/lib/action-state";
import { authorizedBackendRequest, isUuid } from "@/lib/backend-server";
import { createClient } from "@/lib/supabase/server";

function value(data: FormData, name: string): string { const item = data.get(name); return typeof item === "string" ? item.trim() : ""; }
function rawValue(data: FormData, name: string): string { const item = data.get(name); return typeof item === "string" ? item : ""; }
function nullable(candidate: string): string | null { return candidate || null; }
function validKey(candidate: string): boolean { return candidate.length >= 16 && candidate.length <= 128 && /^[A-Za-z0-9._:-]+$/.test(candidate); }
function errorState(status: number, body: unknown, requestId: string | null): PlatformActionState {
  const detail = typeof body === "object" && body !== null && "detail" in body ? String((body as { detail: unknown }).detail) : "";
  const known: Record<string, string> = {
    platform_admin_required: "Platform administrator access is required.", owner_identity_not_found: "The owner account was not found.", owner_identity_inactive: "The owner account is inactive.",
    tenant_onboarding_conflict: "The business conflicts with an existing tenant.", platform_onboarding_conflict: "The onboarding record conflicts with existing data.",
    subscription_not_found: "The subscription was not found.", current_paid_coverage_required: "Current paid coverage is required before resuming.",
    subscription_state_conflict: "The subscription changed. Refresh and review it again.", billing_mode_transition_conflict: "The billing mode cannot be changed with the current coverage.",
    export_lifecycle_conflict: "The export or offboarding case is not ready for this action.", export_expired: "The export has expired.",
    idempotency_key_reused: "This submission changed after it started. Refresh and start again.", idempotency_request_in_progress: "This action is still being processed. Wait and retry.",
  };
  const fallback = status === 403 ? "You do not have permission for this action." : status === 404 ? "The selected record is no longer available." : status === 422 ? "Check the entered values and try again." : status === 429 ? "Too many requests. Wait and retry." : "The platform service could not complete this action.";
  return { status: "error", message: known[detail] ?? fallback, requestId };
}

export async function signIn(_previous: PlatformActionState, data: FormData): Promise<PlatformActionState> {
  const email = value(data, "email"); const password = rawValue(data, "password");
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 256) return { status: "error", message: "Enter a valid email and password.", requestId: null };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: "Sign-in details were not accepted.", requestId: null };
  redirect("/");
}

export async function signOut(): Promise<never> {
  const supabase = await createClient(); const { data } = await supabase.auth.getClaims();
  if (data?.claims) await supabase.auth.signOut();
  redirect("/login");
}

export async function platformAction(_previous: PlatformActionState, data: FormData): Promise<PlatformActionState> {
  const operation = value(data, "operation"); const key = value(data, "idempotencyKey");
  if (!validKey(key)) return { status: "error", message: "The action request is invalid. Refresh and try again.", requestId: null };
  let path: string; let payload: Record<string, unknown> = {};

  if (operation === "onboard_tenant") {
    const ownerId = value(data, "ownerAuthUserId");
    if (!isUuid(ownerId)) return { status: "error", message: "Enter the owner account UUID.", requestId: null };
    path = "/api/v1/platform/tenants";
    payload = {
      legal_name: value(data, "legalName"), display_name: value(data, "displayName"), billing_mode: value(data, "billingMode"),
      trade_license_number: nullable(value(data, "tradeLicenseNumber")), trade_license_expiry: nullable(value(data, "tradeLicenseExpiry")),
      vat_registered: value(data, "vatRegistered") === "true", trn: nullable(value(data, "trn")), invoice_address: nullable(value(data, "invoiceAddress")),
      contact_name: nullable(value(data, "contactName")), contact_phone: nullable(value(data, "contactPhone")), contact_email: nullable(value(data, "contactEmail")),
      owner_auth_user_id: ownerId, owner_display_name: value(data, "ownerDisplayName"), owner_phone: nullable(value(data, "ownerPhone")),
      shop_name: value(data, "shopName"), shop_internal_code: value(data, "shopInternalCode"), shop_open_time: value(data, "shopOpenTime"), shop_close_time: value(data, "shopCloseTime"), shop_eod_time: value(data, "shopEodTime"),
      default_service_minutes: Number(value(data, "defaultServiceMinutes")), paid_from: value(data, "paidFrom"), paid_until: value(data, "paidUntil"), initial_payment_amount: value(data, "initialPaymentAmount"),
      initial_receipt_reference: value(data, "initialReceiptReference"), initial_collected_at: new Date().toISOString(), initial_payment_evidence_note: nullable(value(data, "evidenceNote")),
    };
  } else if (operation === "cash_receipt") {
    const subscriptionId = value(data, "subscriptionId"); if (!isUuid(subscriptionId)) return { status: "error", message: "Choose a subscription.", requestId: null };
    path = "/api/v1/platform/subscriptions/cash-receipts";
    payload = { subscription_id: subscriptionId, amount: value(data, "amount"), receipt_reference: value(data, "reference"), collected_at: new Date().toISOString(), coverage_from: value(data, "coverageFrom"), coverage_until: value(data, "coverageUntil"), evidence_note: nullable(value(data, "evidenceNote")) };
  } else if (operation === "reverse_receipt") {
    const receiptId = value(data, "receiptId"); if (!isUuid(receiptId) || value(data, "confirmScope") !== receiptId || value(data, "confirmConsequence") !== "CONFIRM") return { status: "error", message: "Complete both reversal confirmations.", requestId: null };
    path = `/api/v1/platform/subscriptions/cash-receipts/${receiptId}/reversal`;
    payload = { receipt_reference: value(data, "reference"), collected_at: new Date().toISOString(), evidence_note: value(data, "reason") };
  } else if (operation === "suspend" || operation === "resume") {
    const subscriptionId = value(data, "subscriptionId"); if (!isUuid(subscriptionId) || value(data, "confirmScope") !== subscriptionId || value(data, "confirmConsequence") !== "CONFIRM") return { status: "error", message: "Complete both subscription confirmations.", requestId: null };
    path = `/api/v1/platform/subscriptions/${subscriptionId}/${operation}`;
    payload = operation === "suspend" ? { reason: value(data, "suspensionReason"), explanation: value(data, "reason") } : { explanation: value(data, "reason"), manual_override_until: null, manual_override_reason: null };
  } else if (operation === "begin_offboarding") {
    const businessId = value(data, "businessId"); if (!isUuid(businessId) || value(data, "confirmScope") !== businessId || value(data, "confirmConsequence") !== "CONFIRM") return { status: "error", message: "Complete both offboarding confirmations.", requestId: null };
    path = "/api/v1/platform/offboarding"; payload = { business_id: businessId, shop_id: null, scope: "business", reason: value(data, "reason") };
  } else if (operation === "confirm_delivery") {
    const exportId = value(data, "exportId"); if (!isUuid(exportId) || value(data, "confirmScope") !== exportId || value(data, "confirmConsequence") !== "CONFIRM") return { status: "error", message: "Complete both delivery confirmations.", requestId: null };
    path = `/api/v1/platform/exports/${exportId}/confirm-delivery`;
  } else if (operation === "archive_offboarding") {
    const caseId = value(data, "caseId"); if (!isUuid(caseId) || value(data, "confirmScope") !== caseId || value(data, "confirmConsequence") !== "CONFIRM") return { status: "error", message: "Complete both archive confirmations.", requestId: null };
    path = `/api/v1/platform/offboarding/${caseId}/archive`;
  } else if (operation === "change_billing_mode") {
    const businessId = value(data, "businessId"); if (!isUuid(businessId) || value(data, "confirmScope") !== businessId || value(data, "confirmConsequence") !== "CONFIRM") return { status: "error", message: "Complete both billing-mode confirmations.", requestId: null };
    path = `/api/v1/platform/businesses/${businessId}/billing-mode`; payload = { target_mode: value(data, "targetMode"), reason: value(data, "reason") };
  } else if (operation === "create_shop") {
    const businessId = value(data, "businessId"); if (!isUuid(businessId)) return { status: "error", message: "Choose a valid business.", requestId: null };
    path = `/api/v1/platform/businesses/${businessId}/shops`; payload = { name: value(data, "shopName"), internal_code: value(data, "internalCode"), timezone: "Asia/Dubai", open_time: value(data, "openTime"), close_time: value(data, "closeTime"), default_service_minutes: Number(value(data, "defaultServiceMinutes")), eod_time: value(data, "eodTime"), paid_from: nullable(value(data, "paidFrom")), paid_until: nullable(value(data, "paidUntil")) };
  } else if (operation === "invite_staff") {
    const businessId = value(data, "businessId"); const shopId = value(data, "shopId"); if (!isUuid(businessId) || !isUuid(shopId)) return { status: "error", message: "Enter valid business and shop IDs.", requestId: null };
    path = `/api/v1/platform/businesses/${businessId}/shops/${shopId}/staff-invitations`; payload = { email: value(data, "email"), role: value(data, "role") };
  } else if (operation === "register_bot") {
    const businessId = value(data, "businessId"); const shopId = value(data, "shopId"); const token = rawValue(data, "botToken").trim(); if (!isUuid(businessId) || !isUuid(shopId) || token.length < 20 || token.length > 256) return { status: "error", message: "Enter valid shop scope and bot token.", requestId: null };
    path = `/api/v1/platform/businesses/${businessId}/shops/${shopId}/bots`; payload = { role: value(data, "role"), token };
  } else if (operation === "legal_tax") {
    const businessId = value(data, "businessId"); const shopId = value(data, "shopId"); const registered = value(data, "vatRegistered") === "true"; if (!isUuid(businessId) || !isUuid(shopId)) return { status: "error", message: "Enter valid business and shop IDs.", requestId: null };
    path = `/api/v1/platform/businesses/${businessId}/shops/${shopId}/legal-tax`; payload = { legal_name: value(data, "legalName"), address: value(data, "address"), trade_license_number: nullable(value(data, "tradeLicenseNumber")), trade_license_expiry: nullable(value(data, "tradeLicenseExpiry")), vat_registered: registered, trn: registered ? nullable(value(data, "trn")) : null, pricing_mode: value(data, "pricingMode"), effective_from: new Date().toISOString() };
  } else {
    return { status: "error", message: "The requested operation is not available in this recovery slice.", requestId: null };
  }

  try {
    const response = await authorizedBackendRequest(path, { method: "POST", headers: { "Idempotency-Key": key }, body: JSON.stringify(payload) });
    if (response.status < 200 || response.status >= 300) return errorState(response.status, response.body, response.requestId);
    revalidatePath("/");
    return { status: "success", message: "Action completed.", requestId: response.requestId };
  } catch {
    return { status: "error", message: "The platform service is unavailable. Try again shortly.", requestId: null };
  }
}
