export type PublicEnvironment = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

export function readPublicEnvironment(
  source: Record<string, string | undefined> = process.env,
): PublicEnvironment {
  const values = {
    supabaseUrl: source.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: source.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    apiBaseUrl: source.NEXT_PUBLIC_API_BASE_URL,
  };
  const missing = Object.entries(values).filter(([, candidate]) => !candidate).map(([name]) => name);
  if (missing.length) throw new Error(`Missing public environment: ${missing.join(", ")}`);
  const placeholderPattern = /(^|[.-])(example|placeholder)([.-]|$)|replace[-_]/i;
  if (Object.values(values).some((candidate) => placeholderPattern.test(candidate!))) {
    throw new Error("Public environment contains placeholder values");
  }
  for (const [name, candidate] of [["NEXT_PUBLIC_SUPABASE_URL", values.supabaseUrl], ["NEXT_PUBLIC_API_BASE_URL", values.apiBaseUrl]] as const) {
    const parsed = new URL(candidate!);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(`${name} must use HTTP or HTTPS`);
    if (source.NODE_ENV === "production" && parsed.protocol !== "https:") throw new Error(`${name} must use HTTPS in production`);
  }
  return values as PublicEnvironment;
}
