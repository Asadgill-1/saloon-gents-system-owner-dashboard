export type PublicEnvironment = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

export function readPublicEnvironment(
  source: Record<string, string | undefined> = process.env,
): PublicEnvironment {
  const supabaseUrl = source.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = source.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  const apiBaseUrl = source.NEXT_PUBLIC_API_BASE_URL || "https://api.gents-saloon.com";

  return {
    supabaseUrl,
    supabaseAnonKey,
    apiBaseUrl,
  };
}
