"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setErrorMsg("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-12 text-stone-100 font-sans antialiased">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-stone-800 bg-stone-900 p-8 shadow-2xl">
        {/* Branding & Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500 font-serif text-xl font-bold text-stone-950 shadow-lg mb-4">
            GS
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-50">
            Platform Master Console
          </h1>
          <p className="mt-2 text-xs text-stone-400">
            Global SaaS Administrator Sign In
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          {errorMsg && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/50 p-3 text-xs text-red-400 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@platform.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-stone-700 bg-stone-950 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-stone-700 bg-stone-950 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] rounded-lg bg-yellow-500 py-3 text-sm font-bold text-stone-950 hover:bg-yellow-400 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Platform Console"}
          </button>
        </form>

        <div className="border-t border-stone-800 pt-4 text-center">
          <p className="text-[11px] text-stone-500 font-mono">
            Protected Platform Scope — Server-Verified Admin Access
          </p>
        </div>
      </div>
    </main>
  );
}
