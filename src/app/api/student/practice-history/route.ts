import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const mockUserId = request.headers.get("x-mock-user-id") || new URL(request.url).searchParams.get("mockUserId");
  if (mockUserId) {
    return { id: mockUserId, email: `${mockUserId}@example.com`, name: "Mock Student" };
  }

  if (!token) return null;

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { testId, category, testName, score, total, metadata } = body;

    if (!testId || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("practice_history")
      .insert({
        user_id: user.id,
        category,
        test_id: testId,
        test_name: testName || `Practice Test - ${testId}`,
        score: score,
        total: total,
        metadata: metadata || {}
      })
      .select();

    if (error) {
      console.error("Error inserting practice history:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, practiceHistory: data?.[0] || null });
  } catch (err: any) {
    console.error("❌ Lỗi API POST /api/student/practice-history:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
