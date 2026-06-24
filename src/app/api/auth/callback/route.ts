import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDesc || error)}`
    );
  }

  if (code) {
    const { data, error: exchangeError } = await supabaseAdmin.auth.exchangeCodeForSession(code);
    if (!exchangeError && data?.user) {
      // Initialize metadata for new Google users
      if (!data.user.user_metadata?.role) {
        const name = data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Người dùng";
        await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
          user_metadata: {
            role: "STUDENT",
            name,
            isLocked: false,
          },
        });

        // Ensure profile exists in DB
        await supabaseAdmin.from("profiles").upsert({
          id: data.user.id,
          role: "STUDENT",
        }, { onConflict: "id" });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
