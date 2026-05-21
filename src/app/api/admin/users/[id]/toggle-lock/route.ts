import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logActivity } from "@/lib/activityLogger";

// PATCH: Khóa hoặc Mở khóa tài khoản nhanh trực tiếp trên Supabase Auth DB
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`⚡ [Supabase Auth] Đang thay đổi trạng thái khóa tài khoản: ${id}...`);

    // Fetch user details first
    const { data: { user: currentUser }, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(id);
    if (fetchError || !currentUser) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng này trên Supabase." },
        { status: 404 }
      );
    }

    const currentMetadata = currentUser.user_metadata || {};
    const newLockState = !currentMetadata.isLocked;

    const newMetadata = {
      ...currentMetadata,
      isLocked: newLockState,
    };

    // Update metadata and ban duration on Supabase
    // 87600h is 10 years, "none" removes the ban
    const { data: { user }, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: newMetadata,
      ban_duration: newLockState ? "87600h" : "none",
    });

    if (updateError || !user) {
      throw new Error(updateError?.message || "Không thể cập nhật trạng thái khóa.");
    }

    const name = user.user_metadata?.name || user.email || "Người dùng";
    const statusMessage = newLockState
      ? `Đã khóa tài khoản '${name}' thành công trên Supabase!`
      : `Đã mở khóa tài khoản '${name}' thành công trên Supabase!`;

    const formattedUser = {
      id: user.id,
      name: user.user_metadata?.name || name,
      email: user.email || "",
      role: user.user_metadata?.role || "GUEST",
      isLocked: newLockState,
      updatedAt: user.updated_at,
    };

    // Ghi nhận lịch sử hoạt động
    await logActivity(
      newLockState ? "LOCK" : "UNLOCK",
      formattedUser.name,
      formattedUser.email,
      newLockState ? "Khóa tài khoản người dùng" : "Mở khóa tài khoản người dùng",
      request
    );

    return NextResponse.json({
      message: statusMessage,
      user: formattedUser,
    });
  } catch (error: any) {
    console.error("❌ Lỗi API PATCH toggle-lock:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi thay đổi trạng thái khóa của tài khoản trên Supabase.", error: error.message },
      { status: 500 }
    );
  }
}
