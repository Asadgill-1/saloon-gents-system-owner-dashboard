import { redirect } from "next/navigation";

import { signOut } from "@/app/actions";
import { PlatformConsoleClient } from "@/app/_components/platform-console-client";
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

  return <PlatformConsoleClient />;
}
