import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dwixxavpqrnhwnnaxuhq.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ydthWLz_DJEMIrsr8faPqw_pk0QyVVS";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client-side Supabase client (using anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Server-side Admin Supabase client
// 1. If running on client-side, fallback to anon key to prevent "supabaseKey is required" crash
// 2. If running on server-side, use service role key for admin privileges
export const supabaseAdmin = createClient(
  supabaseUrl,
  (typeof window === "undefined" && supabaseServiceRoleKey) ? supabaseServiceRoleKey : supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
