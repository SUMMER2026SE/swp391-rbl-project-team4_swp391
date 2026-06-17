import { supabase } from "@/lib/supabase";

/**
 * fetch() wrapper that attaches the current Supabase access token as a
 * Bearer Authorization header. Required for admin API routes guarded by
 * requireRole(), because this app keeps the session in localStorage (not
 * cookies), so the server can only read the token from this header.
 *
 * Any caller-supplied headers (e.g. Content-Type) are preserved.
 */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  return fetch(input, { ...init, headers });
}
