import { redirect } from "next/navigation";
import { LoginForm } from "@/app/_components/login-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient(); const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/");
  return <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-12 text-stone-100">
    <section className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-8 shadow-2xl" aria-labelledby="login-title">
      <div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500 font-serif text-xl font-bold text-stone-950">GS</div><h1 id="login-title" className="font-serif text-3xl font-bold text-stone-50">Platform master console</h1><p className="mt-2 text-sm text-stone-400">Database-verified platform administrators only</p></div>
      <LoginForm />
    </section>
  </main>;
}
