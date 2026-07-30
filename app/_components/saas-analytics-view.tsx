"use client";

export function SaasAnalyticsView() {
  const saasData = {
    platformGmv: 425000.0,
    subscriptionRevenueTotal: 18500.0,
    activeTenants: 12,
    totalShops: 28,
    platformMrr: 3200.0,
    platformArr: 38400.0,
    totalVatProcessed: 21250.0,
    barberCommissionsTotal: 106250.0,
    tenderSplit: {
      cash: 255000.0,
      card: 170000.0,
    },
    topPerformingSaloons: [
      { id: "1", name: "Business A - Shop A1", city: "Dubai", gmv: 85000.0, bookings: 740, avgBasket: 114.86 },
      { id: "2", name: "Royal Gents - Marina", city: "Dubai", gmv: 72000.0, bookings: 610, avgBasket: 118.03 },
      { id: "3", name: "Crown Saloon - Downtown", city: "Abu Dhabi", gmv: 68000.0, bookings: 590, avgBasket: 115.25 },
      { id: "4", name: "Business B - Shop B1", city: "Sharjah", gmv: 54000.0, bookings: 490, avgBasket: 110.2 },
    ],
  };

  const cashPercent = Math.round((saasData.tenderSplit.cash / saasData.platformGmv) * 100);
  const cardPercent = 100 - cashPercent;

  return (
    <div className="space-y-6">
      {/* SaaS Executive Summary Header */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">SaaS Platform Executive Business Reports</h2>
            <p className="text-xs text-stone-500">Cross-Tenant Business Numbers, Platform GMV & Subscription Growth</p>
          </div>
          <span className="rounded-lg bg-yellow-500 px-3 py-1.5 font-mono text-xs font-bold text-stone-950 shadow-sm">
            Platform Owner Dashboard
          </span>
        </div>

        {/* Top Headline Business Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Platform Total GMV</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-stone-900">
              AED {saasData.platformGmv.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +14.2% from last month</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Subscription Cash Collected</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-700">
              AED {saasData.subscriptionRevenueTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">MRR: AED {saasData.platformMrr.toFixed(2)}</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Active Saloons</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-stone-900">
              {saasData.totalShops} <span className="text-xs font-normal text-stone-500">Shops</span>
            </p>
            <p className="text-[11px] text-stone-500 mt-1">{saasData.activeTenants} Business Tenants</p>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-50/50 p-4">
            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Annual Run Rate (ARR)</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-yellow-700">
              AED {saasData.platformArr.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-yellow-800 mt-1">100% On-Time Collection Rate</p>
          </div>
        </div>
      </div>

      {/* Tender Split & Financial Audit Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cash vs Card Tender Split Across Platform */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">
            Platform Payment Tender Split
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Cash Tender ({cashPercent}%)</span>
                <span className="font-mono">AED {saasData.tenderSplit.cash.toLocaleString()}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cashPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Card Tender ({cardPercent}%)</span>
                <span className="font-mono">AED {saasData.tenderSplit.card.toLocaleString()}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cardPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-lg bg-stone-50 p-3 border border-stone-200">
              <span className="text-stone-500 block">Total UAE VAT (5%):</span>
              <span className="font-bold text-stone-900">AED {saasData.totalVatProcessed.toLocaleString()}</span>
            </div>
            <div className="rounded-lg bg-stone-50 p-3 border border-stone-200">
              <span className="text-stone-500 block">Barber Commissions:</span>
              <span className="font-bold text-stone-900">AED {saasData.barberCommissionsTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* B2B E-Invoice & Subscription Status Audit */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">
            Compliance & E-Invoice Audit Overview
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-700">Provider-Neutral B2B Source Envelopes:</span>
              <span className="rounded bg-blue-100 px-2.5 py-1 text-blue-800 font-bold">100% Prepared</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-700">Double-Entry Journal Balancing:</span>
              <span className="rounded bg-emerald-100 px-2.5 py-1 text-emerald-800 font-bold">100% Balanced</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-700">Row Level Security (RLS) Policy Status:</span>
              <span className="rounded bg-emerald-100 px-2.5 py-1 text-emerald-800 font-bold">46/46 Tables Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Saloons Table */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <h3 className="font-serif text-lg font-bold text-stone-900">Top Performing Saloon Benchmarking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 font-mono">
            <thead className="border-b border-stone-200 bg-white uppercase text-stone-500 font-sans font-bold">
              <tr>
                <th className="p-4">Rank / Saloon Shop</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Completed Bookings</th>
                <th className="p-4 text-right">Avg Ticket Size</th>
                <th className="p-4 text-right font-bold text-stone-900">Total GMV (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {saasData.topPerformingSaloons.map((s, idx) => (
                <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-sans font-bold text-stone-900">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-yellow-400">
                      {idx + 1}
                    </span>
                    {s.name}
                  </td>
                  <td className="p-4 font-sans text-stone-600">{s.city}</td>
                  <td className="p-4 text-center font-bold">{s.bookings}</td>
                  <td className="p-4 text-right">AED {s.avgBasket.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-stone-900">
                    AED {s.gmv.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
