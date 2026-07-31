import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

import { signOut } from "@/app/actions";
import { PlatformConsoleClient } from "@/app/_components/platform-console-client";
import { getPlatformAccess, getPlatformData } from "@/lib/backend-server";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Home({ searchParams }: Props) {
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

  const params = await searchParams;
  const cursor = (name: string) => typeof params[name] === "string" ? params[name] : undefined;
  const platform = await getPlatformData({ tenants: cursor("tenants_cursor"), subscriptions: cursor("subscriptions_cursor"), receipts: cursor("receipts_cursor"), offboarding: cursor("offboarding_cursor"), bots: cursor("bots_cursor"), analytics: cursor("analytics_cursor") });
  if (platform.kind === "unauthenticated") redirect("/login");
  if (platform.kind === "unavailable") {
    return <main className="shell-page"><section className="status-shell status-shell--unavailable"><p className="eyebrow">Gents Saloon Platform</p><h1>Data unavailable</h1><p className="lede">The platform service could not load this view. Try again shortly.</p>{platform.requestId && <p className="mt-4 font-mono text-xs text-stone-500">Request {platform.requestId}</p>}<form action={signOut}><button className="button" type="submit">Sign out</button></form></section></main>;
  }
  return <PlatformConsoleClient displayName={state.displayName} data={platform.data} actionNonce={randomUUID()} />;
}
