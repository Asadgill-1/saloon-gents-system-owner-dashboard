import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { readPublicEnvironment } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  const env = readPublicEnvironment();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Proxy refreshes cookies when this runs in a read-only Server Component.
        }
      },
    },
  });
}
