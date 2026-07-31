"use client";

import { useActionState, useState } from "react";
import { platformAction } from "@/app/actions";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import type { Page, TenantItem } from "@/lib/backend-contracts";
import { Pager } from "./pager";
import { TenantSetupTools } from "./tenant-setup-tools";

export function TenantFleetView({ tenants, actionNonce }: { tenants: Page<TenantItem>; actionNonce: string }) {
  const [open, setOpen] = useState(false); const [state, action, pending] = useActionState(platformAction, INITIAL_ACTION_STATE);
  return <section className="space-y-6" aria-labelledby="tenants-heading">
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm"><div><h2 id="tenants-heading" className="text-2xl font-bold">Business tenants</h2><p className="mt-1 text-sm text-stone-500">{tenants.items.length} businesses on this page</p></div><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="min-h-[44px] rounded-lg bg-stone-900 px-5 font-bold text-yellow-400 hover:bg-stone-800">{open ? "Close onboarding" : "Onboard business"}</button></div>

    {open && <form action={action} className="rounded-xl border border-yellow-500/40 bg-white p-6 shadow-sm">
      <input type="hidden" name="operation" value="onboard_tenant" /><input type="hidden" name="idempotencyKey" value={`ui:${actionNonce}:onboard-tenant`} />
      <h3 className="text-xl font-bold">Business, owner, first shop, and initial coverage</h3><p className="mt-1 text-sm text-stone-500">All four records are created atomically by the platform API.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field name="legalName" label="Business legal name" required /><Field name="displayName" label="Business display name" required />
        <Select name="billingMode" label="Billing scope" options={[["business", "Business-wide"], ["per_shop", "Per shop"]]} />
        <Field name="ownerAuthUserId" label="Owner account UUID" required mono /><Field name="ownerDisplayName" label="Owner display name" required /><Field name="ownerPhone" label="Owner phone (optional)" />
        <Field name="contactName" label="Billing contact (optional)" /><Field name="contactEmail" label="Contact email (optional)" type="email" /><Field name="contactPhone" label="Contact phone (optional)" />
        <Field name="shopName" label="First shop name" required /><Field name="shopInternalCode" label="Shop internal code" required mono pattern="[A-Z0-9][A-Z0-9_-]*" />
        <Field name="defaultServiceMinutes" label="Default service minutes" required type="number" min="5" max="480" defaultValue="30" />
        <Field name="shopOpenTime" label="Opening time" required type="time" defaultValue="09:00" /><Field name="shopCloseTime" label="Closing time" required type="time" defaultValue="22:00" /><Field name="shopEodTime" label="End-of-day time" required type="time" defaultValue="23:00" />
        <Field name="paidFrom" label="Coverage from" required type="date" /><Field name="paidUntil" label="Coverage until" required type="date" /><Field name="initialPaymentAmount" label="Initial payment (AED)" required inputMode="decimal" pattern="\d+(\.\d{1,2})?" />
        <Field name="initialReceiptReference" label="Initial receipt reference" required mono /><Field name="tradeLicenseNumber" label="Trade licence (optional)" /><Field name="tradeLicenseExpiry" label="Trade licence expiry" type="date" />
        <Select name="vatRegistered" label="VAT registration" options={[["false", "Not VAT registered"], ["true", "VAT registered"]]} /><Field name="trn" label="TRN if VAT registered" pattern="[0-9]{15}" mono /><Field name="invoiceAddress" label="Invoice address (optional)" />
      </div>
      {state.status !== "idle" && <p role="status" className={`mt-5 rounded-lg p-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{state.message}{state.requestId ? ` Request ${state.requestId}.` : ""}</p>}
      <button type="submit" disabled={pending} className="mt-5 min-h-12 rounded-lg bg-stone-900 px-6 font-bold text-yellow-400 hover:bg-stone-800 disabled:cursor-wait disabled:opacity-60">{pending ? "Onboarding…" : "Onboard business"}</button>
    </form>}

    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[50rem] text-left text-sm"><thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr><th className="p-4">Business</th><th className="p-4">Legal name</th><th className="p-4">Billing</th><th className="p-4 text-center">Shops</th><th className="p-4">Status</th><th className="p-4">Created</th></tr></thead><tbody className="divide-y divide-stone-200">{tenants.items.map((tenant) => <tr key={tenant.id}><td className="p-4"><p className="font-bold">{tenant.displayName}</p><p className="mt-1 font-mono text-xs text-stone-400">{tenant.id}</p></td><td className="p-4">{tenant.legalName}</td><td className="p-4">{tenant.billingMode.replace("_", " ")}</td><td className="p-4 text-center font-bold">{tenant.shopCount}</td><td className="p-4"><span className="rounded-full border border-stone-300 px-3 py-1 text-xs font-bold uppercase">{tenant.status}</span></td><td className="p-4 text-stone-500">{new Date(tenant.createdAt).toLocaleDateString("en-AE", { timeZone: "Asia/Dubai" })}</td></tr>)}</tbody></table></div>{!tenants.items.length && <p className="p-8 text-center text-stone-500">No businesses on this page.</p>}<Pager cursorKey="tenants_cursor" nextCursor={tenants.nextCursor} /></div>
    <TenantSetupTools tenants={tenants.items} actionNonce={actionNonce} />
  </section>;
}

function Field(props: { name: string; label: string; required?: boolean; mono?: boolean; type?: string; pattern?: string; min?: string; max?: string; defaultValue?: string; inputMode?: "decimal" }) {
  return <div><label htmlFor={props.name} className="mb-2 block text-sm font-semibold text-stone-700">{props.label}</label><input id={props.name} name={props.name} required={props.required} type={props.type} pattern={props.pattern} min={props.min} max={props.max} defaultValue={props.defaultValue} inputMode={props.inputMode} className={`min-h-12 w-full rounded-lg border border-stone-300 px-3 focus:border-stone-900 focus:outline-none ${props.mono ? "font-mono text-sm" : ""}`} /></div>;
}

function Select({ name, label, options }: { name: string; label: string; options: string[][] }) {
  return <div><label htmlFor={name} className="mb-2 block text-sm font-semibold text-stone-700">{label}</label><select id={name} name={name} className="min-h-12 w-full rounded-lg border border-stone-300 bg-white px-3 focus:border-stone-900 focus:outline-none">{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></div>;
}
