import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://butoxkmxkaybajoqrpza.supabase.co";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://witty-dogs-dig.loca.lt";

const supabaseRealtimeUrl = SUPABASE_URL.replace(/^http/, "ws");
const connectSources = [
  "'self'",
  SUPABASE_URL,
  supabaseRealtimeUrl,
  API_BASE_URL,
].filter(Boolean);
const scriptSources = ["'self'", "'unsafe-inline'", isDevelopment && "'unsafe-eval'"].filter(
  Boolean,
);

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSources.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src ${connectSources.join(" ")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
