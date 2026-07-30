"use client";

import { useState } from "react";

type OffboardingCase = {
  id: string;
  businessName: string;
  requestedAt: string;
  status: "requested" | "frozen" | "export_ready" | "delivered" | "archived";
  checksum: string;
};

const INITIAL_CASES: OffboardingCase[] = [
  {
    id: "case-01",
    businessName: "Business A LLC",
    requestedAt: "2026-07-26 14:00",
    status: "export_ready",
    checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
];

export function TenantOffboardingView() {
  const [cases, setCases] = useState<OffboardingCase[]>(INITIAL_CASES);

  const handleUpdateStatus = (id: string, nextStatus: OffboardingCase["status"]) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Tenant Data Exports & Soft Offboarding</h2>
          <p className="text-xs text-stone-500">
            Export-first offboarding: Freeze → Export ZIP → Delivery Confirmation → Soft Archive
          </p>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 font-mono">
            <thead className="border-b border-stone-200 bg-stone-50 uppercase text-stone-500 font-sans font-bold">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Tenant Business</th>
                <th className="p-4">Requested At</th>
                <th className="p-4">SHA-256 Checksum</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-bold text-stone-900">{c.id}</td>
                  <td className="p-4 font-sans font-bold text-stone-900">{c.businessName}</td>
                  <td className="p-4">{c.requestedAt}</td>
                  <td className="p-4 font-mono text-[10px] text-stone-500 truncate max-w-[12rem]">
                    {c.checksum}
                  </td>
                  <td className="p-4 text-center">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold text-yellow-800 uppercase border border-yellow-300">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-sans">
                    {c.status === "export_ready" && (
                      <button
                        onClick={() => handleUpdateStatus(c.id, "delivered")}
                        className="min-h-[44px] rounded border border-stone-300 bg-stone-100 px-3 py-1.5 font-bold text-stone-700 hover:bg-stone-200"
                      >
                        Confirm Delivery
                      </button>
                    )}
                    {c.status === "delivered" && (
                      <button
                        onClick={() => handleUpdateStatus(c.id, "archived")}
                        className="min-h-[44px] rounded bg-red-600 px-3 py-1.5 font-bold text-white hover:bg-red-500"
                      >
                        Soft Archive Tenant
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
