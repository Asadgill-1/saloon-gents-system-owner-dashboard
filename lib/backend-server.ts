import "server-only";

import { classifyPlatformAccess, type PlatformAccessState } from "@/lib/backend-contracts";
import { readPublicEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getPlatformAccess(): Promise<PlatformAccessState> {
  try {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();
    if (claimsError || !claimsData?.claims) {
      return { kind: "unauthenticated" };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      return { kind: "unauthenticated" };
    }

    const env = readPublicEnvironment();
    const response = await fetch(new URL("/api/v1/me/context", env.apiBaseUrl), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const body: unknown = await response.json().catch(() => null);
    return classifyPlatformAccess(response.status, body);
  } catch {
    return { kind: "unavailable" };
  }
}
