"use client";

export function BotFleetHealthView() {
  const botFleetData = [
    { id: "b-01", name: "Global Master Bot", role: "master", shop: "Global Platform", status: "healthy", webhook: "active", uptime: "99.99%" },
    { id: "b-02", name: "Shop A Customer Bot", role: "customer", shop: "A One (Shop A1)", status: "healthy", webhook: "active", uptime: "99.95%" },
    { id: "b-03", name: "Shop A Receptionist Bot", role: "receptionist", shop: "A One (Shop A1)", status: "healthy", webhook: "active", uptime: "99.95%" },
    { id: "b-04", name: "Shop A Barber Crew Bot", role: "barber", shop: "A One (Shop A1)", status: "healthy", webhook: "active", uptime: "99.95%" },
    { id: "b-05", name: "Shop A Owner Bot", role: "owner", shop: "A One (Shop A1)", status: "healthy", webhook: "active", uptime: "99.95%" },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Registered Bots</p>
          <p className="mt-1 font-mono text-2xl font-bold text-stone-900">201 / 201</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Webhooks</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-600">100%</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Celery Outbox Event Queue</p>
          <p className="mt-1 font-mono text-2xl font-bold text-blue-600">0 Pending</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">System Health</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-600">ALL SYSTEMS OK</p>
        </div>
      </div>

      {/* Bot Fleet List */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <h3 className="font-serif text-lg font-bold text-stone-900">Bot Fleet Status Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 font-mono">
            <thead className="border-b border-stone-200 bg-white uppercase text-stone-500 font-sans font-bold">
              <tr>
                <th className="p-4">Bot Username / Label</th>
                <th className="p-4">Role</th>
                <th className="p-4">Shop Scope</th>
                <th className="p-4 text-center">Webhook</th>
                <th className="p-4 text-center">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {botFleetData.map((bot) => (
                <tr key={bot.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-bold text-stone-900">{bot.name}</td>
                  <td className="p-4 font-sans font-semibold uppercase">{bot.role}</td>
                  <td className="p-4 font-sans">{bot.shop}</td>
                  <td className="p-4 text-center">
                    <span className="rounded bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 uppercase">
                      {bot.webhook}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-800 uppercase">
                      {bot.status}
                    </span>
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
