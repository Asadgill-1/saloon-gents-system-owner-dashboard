"use client";

import { useState } from "react";
import { PlatformHeader } from "./platform-header";
import { TenantFleetView } from "./tenant-fleet-view";
import { BillingSubscriptionsView } from "./billing-subscriptions-view";
import { TenantOffboardingView } from "./tenant-offboarding-view";
import { BotFleetHealthView } from "./bot-fleet-health-view";
import { SaasAnalyticsView } from "./saas-analytics-view";

export function PlatformConsoleClient() {
  const [activeTab, setActiveTab] = useState<string>("tenants");

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans antialiased">
      <PlatformHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {activeTab === "tenants" && <TenantFleetView />}
        {activeTab === "billing" && <BillingSubscriptionsView />}
        {activeTab === "offboarding" && <TenantOffboardingView />}
        {activeTab === "bots" && <BotFleetHealthView />}
        {activeTab === "analytics" && <SaasAnalyticsView />}
      </main>
    </div>
  );
}
