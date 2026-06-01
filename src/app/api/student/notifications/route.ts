import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/lib/studentProgressDb";
import { supabaseAdmin } from "@/lib/supabase";

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  
  // Support mock header or query param for easy local testing
  const mockUserId = request.headers.get("x-mock-user-id") || new URL(request.url).searchParams.get("mockUserId");
  if (mockUserId) {
    return { id: mockUserId, email: `${mockUserId}@example.com`, name: "Mock Student" };
  }

  if (!token) {
    return null;
  }

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

    const notifications = await getNotifications(user.id);
    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error("❌ Lỗi API GET /api/student/notifications:", error);
    return NextResponse.json(
      { message: "Không thể tải danh sách thông báo.", error: error.message },
      { status: 500 }
    );
  }
}
