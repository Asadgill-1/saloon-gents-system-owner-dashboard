"use client";

import { useState } from "react";

type TenantRecord = {
  id: string;
  name: string;
  ownerEmail: string;
  shopsCount: number;
  billingMode: "business" | "per_shop";
  status: "active" | "suspended" | "expired";
  paidUntil: string;
};

const INITIAL_TENANTS: TenantRecord[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Business A LLC",
    ownerEmail: "owner.a@example.com",
    shopsCount: 2,
    billingMode: "business",
    status: "active",
    paidUntil: "2026-12-31",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Business B Saloons",
    ownerEmail: "owner.b@example.com",
    shopsCount: 1,
    billingMode: "per_shop",
    status: "active",
    paidUntil: "2026-12-31",
  },
];

export function TenantFleetView() {
  const [tenants, setTenants] = useState<TenantRecord[]>(INITIAL_TENANTS);
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [newOwnerUserId, setNewOwnerUserId] = useState("");
  const [newBillingMode, setNewBillingMode] = useState<"business" | "per_shop">("business");

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessName.trim()) return;
    const newTenant: TenantRecord = {
      id: `10000000-0000-0000-0000-${(tenants.length + 1).toString().padStart(12, "0")}`,
      name: newBusinessName,
      ownerEmail: newOwnerUserId || "new.owner@example.com",
      shopsCount: 1,
      billingMode: newBillingMode,
      status: "active",
      paidUntil: "2026-12-31",
    };
    setTenants([...tenants, newTenant]);
    setNewBusinessName("");
    setNewOwnerUserId("");
    setIsOnboardOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Fleet Banner & Onboard Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Tenant Saloon Fleet</h2>
          <p className="text-xs text-stone-500">
            {tenants.length} registered business tenants on platform
          </p>
        </div>
        <button
          onClick={() => setIsOnboardOpen(true)}
          className="min-h-[44px] rounded-lg bg-stone-900 px-5 py-2.5 font-bold text-yellow-400 hover:bg-stone-800 transition-all shadow"
        >
          + Onboard New Saloon Business
        </button>
      </div>

      {/* Tenants Table */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="border-b border-stone-200 bg-stone-50 uppercase text-stone-500 font-bold">
              <tr>
                <th className="p-4">Business Legal Name</th>
                <th className="p-4">Owner Contact</th>
                <th className="p-4 text-center">Shops</th>
                <th className="p-4">Billing Scope</th>
                <th className="p-4">Coverage Paid Until</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-stone-900 text-sm">{t.name}</p>
                    <p className="font-mono text-[10px] text-stone-400">{t.id}</p>
                  </td>
                  <td className="p-4 font-mono">{t.ownerEmail}</td>
                  <td className="p-4 text-center font-bold">{t.shopsCount}</td>
                  <td className="p-4 font-semibold uppercase">{t.billingMode}</td>
                  <td className="p-4 font-mono font-bold text-stone-800">{t.paidUntil}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
                        t.status === "active"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Modal */}
      {isOnboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">Onboard New Saloon Business</h3>
            <form onSubmit={handleOnboard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Business Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Gents Saloon LLC"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-stone-300 bg-white px-4 text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Primary Owner Auth User ID (UUID)
                </label>
                <input
                  type="text"
                  placeholder="00000000-0000-0000-0000-000000000002"
                  value={newOwnerUserId}
                  onChange={(e) => setNewOwnerUserId(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-stone-300 bg-white px-4 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Billing Scope
                </label>
                <select
                  value={newBillingMode}
                  onChange={(e) => setNewBillingMode(e.target.value as "business" | "per_shop")}
                  className="w-full min-h-[44px] rounded-lg border border-stone-300 bg-white px-4 text-stone-900 focus:border-stone-900 focus:outline-none"
                >
                  <option value="business">Business Wide Coverage</option>
                  <option value="per_shop">Per-Shop Individual Coverage</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOnboardOpen(false)}
                  className="min-h-[44px] flex-1 rounded-lg border border-stone-300 bg-white font-bold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 rounded-lg bg-stone-900 font-bold text-yellow-400 hover:bg-stone-800"
                >
                  Onboard Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
