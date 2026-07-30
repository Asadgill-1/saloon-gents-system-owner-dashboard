import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://butoxkmxkaybajoqrpza.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dG94a214a2F5YmFqb3FycHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDExMDksImV4cCI6MjEwMDQ3NzEwOX0.Cn0-3nsM_T093d_LHT29ctsCiyYrVr-NzOl1gxExcIs";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
