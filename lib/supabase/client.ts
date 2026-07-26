import { createBrowserClient } from "@supabase/ssr";

import { readPublicEnvironment } from "@/lib/env";

export function createClient() {
  const env = readPublicEnvironment();
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
