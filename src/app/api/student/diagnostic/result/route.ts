import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let query = supabaseAdmin
      .from("diagnostic_results")
      .select("*")
      .eq("user_id", user.id);

    if (id && id !== "latest") {
      query = query.eq("id", id);
    } else {
      // Fetch latest
      query = query.order("created_at", { ascending: false }).limit(1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Database query error fetching diagnostic results:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, result: null });
    }

    // Return the first match
    return NextResponse.json({ success: true, result: data[0] });

  } catch (err: any) {
    console.error("❌ Exception in Diagnostic Result API:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
