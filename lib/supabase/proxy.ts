import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { readPublicEnvironment } from "@/lib/env";

function contentSecurityPolicy(nonce: string, env: ReturnType<typeof readPublicEnvironment>) {
  const realtimeUrl = env.supabaseUrl.replace(/^http/, "ws");
  const scripts = ["'self'", `'nonce-${nonce}'`, process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""].filter(Boolean);
  return ["default-src 'self'", `script-src ${scripts.join(" ")} 'strict-dynamic'`, "style-src 'self' 'unsafe-inline'", "img-src 'self' blob: data:", "font-src 'self'", `connect-src 'self' ${env.supabaseUrl} ${realtimeUrl} ${env.apiBaseUrl}`, "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"].join("; ");
}

export async function updateSession(request: NextRequest) {
  const env = readPublicEnvironment();
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce, env);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  if (
    !data?.claims &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    response = NextResponse.redirect(url);
  }
  response.headers.set("Content-Security-Policy", csp);
  return response;
}
