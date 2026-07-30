import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://butoxkmxkaybajoqrpza.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dG94a214a2F5YmFqb3FycHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDExMDksImV4cCI6MjEwMDQ3NzEwOX0.Cn0-3nsM_T093d_LHT29ctsCiyYrVr-NzOl1gxExcIs";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
