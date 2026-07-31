"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, INITIAL_ACTION_STATE);
  return <form action={action} className="space-y-5">
    <div><label htmlFor="email" className="mb-2 block text-sm font-bold text-stone-300">Admin email address</label><input id="email" name="email" type="email" autoComplete="email" required className="min-h-12 w-full rounded-lg border border-stone-700 bg-stone-950 px-4 text-stone-100 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30" /></div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-bold text-stone-300">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} maxLength={256} className="min-h-12 w-full rounded-lg border border-stone-700 bg-stone-950 px-4 text-stone-100 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30" /></div>
    {state.status === "error" && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{state.message}</p>}
    <button type="submit" disabled={pending} className="min-h-12 w-full rounded-lg bg-yellow-500 font-bold text-stone-950 hover:bg-yellow-400 disabled:cursor-wait disabled:opacity-60">{pending ? "Signing in…" : "Sign in to platform console"}</button>
  </form>;
}
