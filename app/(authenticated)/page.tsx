import { redirect } from "next/navigation";

import { signOut } from "@/app/actions";
import { getPlatformAccess } from "@/lib/backend-server";

export default async function Home() {
  const state = await getPlatformAccess();
  if (state.kind === "unauthenticated") {
    redirect("/login");
  }
  if (state.kind === "unavailable") {
    return (
      <main className="shell-page">
        <section className="status-shell status-shell--unavailable" aria-labelledby="status-title">
          <p className="eyebrow">Gents Saloon Platform</p>
          <h1 id="status-title">Access unavailable</h1>
          <p className="lede">Contact the platform administrator for assistance.</p>
          <form action={signOut}>
            <button className="button" type="submit">
              Sign out
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="shell-page">
      <section className="status-shell status-shell--ready" aria-labelledby="platform-title">
        <p className="eyebrow">Global authorization active</p>
        <h1 id="platform-title">Platform controls ready</h1>
        <p className="lede">
          Tenant operations remain separate. Administrative modules arrive in their planned
          implementation phases.
        </p>
        <dl className="access-summary">
          <div>
            <dt>Scope</dt>
            <dd>Platform-wide</dd>
          </div>
          <div>
            <dt>Entitlement</dt>
            <dd>Independent of tenant subscription state</dd>
          </div>
        </dl>
        <form action={signOut}>
          <button className="button button--quiet" type="submit">
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
