import { NextRequest, NextResponse } from "next/server";
import { logStudyActivity } from "@/lib/studentProgressDb";
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

    const body = await request.json().catch(() => ({}));
    const { activity = "Luyện tập IELTS Speaking Room" } = body;

    const streak = await logStudyActivity(user.id, activity);
    return NextResponse.json({ success: true, streak });
  } catch (error: any) {
    console.error("❌ Lỗi API POST /api/student/study-log:", error);
    return NextResponse.json(
      { message: "Không thể lưu tiến độ học tập.", error: error.message },
      { status: 500 }
    );
  }
}
