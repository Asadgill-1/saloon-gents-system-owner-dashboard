import "server-only";

import { classifyPlatformAccess, type PlatformAccessState } from "@/lib/backend-contracts";
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

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gents-saloon.com";
    const response = await fetch(new URL("/api/v1/me/context", apiBaseUrl), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const body: unknown = await response.json().catch(() => null);
    return classifyPlatformAccess(response.status, body);
  } catch {
    return { kind: "unavailable" };
  }
}
