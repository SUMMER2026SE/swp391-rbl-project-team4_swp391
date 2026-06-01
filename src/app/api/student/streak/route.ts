import { NextRequest, NextResponse } from "next/server";
import { getStudentStreak } from "@/lib/studentProgressDb";
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

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const streak = await getStudentStreak(user.id);
    return NextResponse.json({ streak });
  } catch (error: any) {
    console.error("❌ Lỗi API GET /api/student/streak:", error);
    return NextResponse.json(
      { message: "Không thể lấy thông tin streak.", error: error.message },
      { status: 500 }
    );
  }
}
