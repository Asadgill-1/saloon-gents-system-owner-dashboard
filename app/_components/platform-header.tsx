"use client";

import { signOut } from "@/app/actions";

type PlatformHeaderProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function PlatformHeader({ activeTab, onTabChange }: PlatformHeaderProps) {
  return (
    <header className="w-full border-b border-stone-200 bg-white px-4 py-3 text-stone-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        {/* Branding & Scope */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 font-serif font-bold text-yellow-500 shadow">
            GS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold tracking-tight text-stone-900">
                Platform Master Console
              </h1>
              <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-700 border border-yellow-500/30">
                Global Admin
              </span>
            </div>
            <p className="text-xs text-stone-500">SaaS Multi-Tenant Operations & Financial Controls</p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 rounded-xl bg-stone-100 p-1 border border-stone-200">
          {[
            { id: "tenants", label: "Tenants & Onboarding" },
            { id: "billing", label: "Billing & Cash" },
            { id: "offboarding", label: "Exports & Offboarding" },
            { id: "bots", label: "Bot Fleet & Health" },
            { id: "analytics", label: "SaaS Analytics & Reports" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`min-h-[44px] rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-stone-900 text-yellow-400 shadow"
                    : "text-stone-700 hover:bg-stone-200 hover:text-stone-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <form action={signOut}>
          <button
            type="submit"
            className="min-h-[44px] rounded-lg border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-bold text-stone-700 hover:border-red-500 hover:text-red-600 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
