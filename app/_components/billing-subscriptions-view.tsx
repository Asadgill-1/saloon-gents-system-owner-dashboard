"use client";

import { useState } from "react";

type CashReceipt = {
  id: string;
  businessName: string;
  amount: number;
  reference: string;
  coverageFrom: string;
  coverageUntil: string;
  status: "active" | "reversed";
  einvoiceStatus: "b2b_prepared";
};

const INITIAL_RECEIPTS: CashReceipt[] = [
  {
    id: "40000000-0000-0000-0000-000000000001",
    businessName: "Business A LLC",
    amount: 500,
    reference: "CASH-REC-2026-001",
    coverageFrom: "2026-07-01",
    coverageUntil: "2026-12-31",
    status: "active",
    einvoiceStatus: "b2b_prepared",
  },
  {
    id: "40000000-0000-0000-0000-000000000002",
    businessName: "Business B Saloons",
    amount: 300,
    reference: "CASH-REC-2026-002",
    coverageFrom: "2026-07-01",
    coverageUntil: "2026-12-31",
    status: "active",
    einvoiceStatus: "b2b_prepared",
  },
];

export function BillingSubscriptionsView() {
  const [receipts, setReceipts] = useState<CashReceipt[]>(INITIAL_RECEIPTS);
  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [amount, setAmount] = useState<number>(500);
  const [reference, setReference] = useState<string>("CASH-REC-2026-003");

  const handleCollectCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;
    const newReceipt: CashReceipt = {
      id: `40000000-0000-0000-0000-${(receipts.length + 1).toString().padStart(12, "0")}`,
      businessName: "Business A LLC",
      amount,
      reference,
      coverageFrom: "2026-08-01",
      coverageUntil: "2027-01-31",
      status: "active",
      einvoiceStatus: "b2b_prepared",
    };
    setReceipts([newReceipt, ...receipts]);
    setIsCollectOpen(false);
  };

  const handleReverse = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "reversed" } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Collect Cash Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Subscription Cash Receipts & Billing</h2>
          <p className="text-xs text-stone-500">
            Sequential append-only cash collection & B2B e-invoice source envelopes
          </p>
        </div>
        <button
          onClick={() => setIsCollectOpen(true)}
          className="min-h-[44px] rounded-lg bg-stone-900 px-5 py-2.5 font-bold text-yellow-400 hover:bg-stone-800 transition-all shadow"
        >
          + Record Subscription Cash Receipt
        </button>
      </div>

      {/* Receipts Table */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 font-mono">
            <thead className="border-b border-stone-200 bg-stone-50 uppercase text-stone-500 font-sans font-bold">
              <tr>
                <th className="p-4">Receipt Ref</th>
                <th className="p-4">Tenant Business</th>
                <th className="p-4 text-right">Amount (AED)</th>
                <th className="p-4">Coverage Period</th>
                <th className="p-4 text-center">B2B E-Invoice Source</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-bold text-stone-900">{r.reference}</td>
                  <td className="p-4 font-sans font-bold text-stone-900">{r.businessName}</td>
                  <td className="p-4 text-right font-bold text-emerald-700">AED {r.amount.toFixed(2)}</td>
                  <td className="p-4">{r.coverageFrom} → {r.coverageUntil}</td>
                  <td className="p-4 text-center">
                    <span className="rounded bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-800 uppercase border border-blue-300">
                      {r.einvoiceStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                        r.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {r.status === "active" && (
                      <button
                        onClick={() => handleReverse(r.id)}
                        className="min-h-[44px] rounded border border-stone-300 bg-stone-100 px-3 py-1.5 font-sans text-xs font-bold text-stone-700 hover:border-red-500 hover:text-red-600"
                      >
                        Mirror Reversal
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Cash Modal */}
      {isCollectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">Record Subscription Cash Receipt</h3>
            <form onSubmit={handleCollectCash} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Cash Amount (AED)
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] rounded-lg border border-stone-300 bg-white px-4 font-mono text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Receipt Reference Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="CASH-REC-2026-003"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-stone-300 bg-white px-4 font-mono text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCollectOpen(false)}
                  className="min-h-[44px] flex-1 rounded-lg border border-stone-300 bg-white font-bold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 rounded-lg bg-stone-900 font-bold text-yellow-400 hover:bg-stone-800"
                >
                  Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
