import { NextRequest, NextResponse } from "next/server";
import { getActivityLogs, clearActivityLogs } from "@/lib/activityLogger";

// GET: Lấy danh sách lịch sử hoạt động kèm tìm kiếm, lọc loại hành động và phân trang
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const action = searchParams.get("action") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let list = await getActivityLogs();

    // 1. Lọc theo từ khóa tìm kiếm (Tên/Email Admin, Tên/Email Target hoặc Chi tiết)
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (log) =>
          log.adminName.toLowerCase().includes(s) ||
          log.adminEmail.toLowerCase().includes(s) ||
          log.targetName.toLowerCase().includes(s) ||
          log.targetEmail.toLowerCase().includes(s) ||
          log.details.toLowerCase().includes(s)
      );
    }

    // 2. Lọc theo loại Hành động
    if (action && action !== "ALL") {
      list = list.filter((log) => log.action === action);
    }

    // 3. Phân trang
    const totalLogs = list.length;
    const totalPages = Math.ceil(totalLogs / limit);
    const paginatedList = list.slice(skip, skip + limit);

    return NextResponse.json({
      logs: paginatedList,
      pagination: {
        totalLogs,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("❌ Lỗi API GET /api/admin/activity-logs:", error);
    return NextResponse.json(
      { message: "Không thể tải lịch sử hoạt động.", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Xóa sạch toàn bộ lịch sử hoạt động
export async function DELETE(request: NextRequest) {
  try {
    const success = await clearActivityLogs();
    if (!success) {
      throw new Error("Không thể thực hiện xóa logs trên máy chủ.");
    }
    return NextResponse.json({
      message: "Đã xóa toàn bộ lịch sử hoạt động của hệ thống thành công!",
    });
  } catch (error: any) {
    console.error("❌ Lỗi API DELETE /api/admin/activity-logs:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi xóa lịch sử hoạt động.", error: error.message },
      { status: 500 }
    );
  }
}
