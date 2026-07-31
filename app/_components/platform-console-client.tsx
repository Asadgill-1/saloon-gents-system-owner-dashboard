"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { PlatformData } from "@/lib/backend-contracts";
import { PlatformHeader } from "./platform-header";
import { TenantFleetView } from "./tenant-fleet-view";
import { BillingSubscriptionsView } from "./billing-subscriptions-view";
import { TenantOffboardingView } from "./tenant-offboarding-view";
import { BotFleetHealthView } from "./bot-fleet-health-view";
import { SaasAnalyticsView } from "./saas-analytics-view";

const VIEWS = ["tenants", "billing", "offboarding", "bots", "analytics"] as const;

export function PlatformConsoleClient({ displayName, data, actionNonce }: { displayName: string; data: PlatformData; actionNonce: string }) {
  const router = useRouter(); const search = useSearchParams();
  const selected = search.get("view"); const activeTab = VIEWS.includes(selected as (typeof VIEWS)[number]) ? selected! : "tenants";
  const changeTab = (tab: string) => { const params = new URLSearchParams(search.toString()); params.set("view", tab); router.replace(`/?${params}`); };
  return <div className="min-h-screen bg-stone-100 text-stone-900">
    <PlatformHeader displayName={displayName} activeTab={activeTab} onTabChange={changeTab} />
    <main className="mx-auto max-w-7xl px-4 py-6">
      {activeTab === "tenants" && <TenantFleetView tenants={data.tenants} actionNonce={actionNonce} />}
      {activeTab === "billing" && <BillingSubscriptionsView subscriptions={data.subscriptions} receipts={data.receipts} tenants={data.tenants.items} actionNonce={actionNonce} />}
      {activeTab === "offboarding" && <TenantOffboardingView cases={data.offboarding} tenants={data.tenants.items} actionNonce={actionNonce} />}
      {activeTab === "bots" && <BotFleetHealthView bots={data.bots} tenants={data.tenants.items} />}
      {activeTab === "analytics" && <SaasAnalyticsView analytics={data.analytics} />}
    </main>
  </div>;
}
