import { NextRequest, NextResponse } from "next/server";
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/lib/studentProgressDb";
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
    const { notificationId, action } = body;

    // Support deletion if requested
    if (action === "DELETE" && notificationId) {
      const success = await deleteNotification(user.id, notificationId);
      return NextResponse.json({ success });
    }

    let success = false;
    if (notificationId && notificationId !== "all") {
      success = await markNotificationAsRead(user.id, notificationId);
    } else {
      success = await markAllNotificationsAsRead(user.id);
    }

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error("❌ Lỗi API POST /api/student/notifications/read:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi cập nhật thông báo.", error: error.message },
      { status: 500 }
    );
  }
}
