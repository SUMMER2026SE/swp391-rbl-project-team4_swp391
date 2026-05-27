import { NextRequest, NextResponse } from "next/server";
import { getPackages, createPackage } from "@/lib/paymentDb";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  try {
    const packages = await getPackages();
    // Sort packages by newest first or by price
    packages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ packages });
  } catch (error: any) {
    console.error("❌ Lỗi API GET /api/admin/payments/packages:", error);
    return NextResponse.json(
      { message: "Không thể lấy danh sách gói thanh toán.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, durationMonths, description, features, isActive } = body;

    if (!name || price === undefined || durationMonths === undefined) {
      return NextResponse.json(
        { message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc: Tên gói, Giá tiền, Thời hạn." },
        { status: 400 }
      );
    }

    const newPkg = await createPackage({
      name,
      price: Number(price),
      durationMonths: Number(durationMonths),
      description: description || "",
      features: features || [],
      isActive: isActive !== false
    });

    // Log admin activity
    await logActivity(
      "CREATE",
      newPkg.name,
      "payment-package",
      `Tạo gói thanh toán mới thành công: ${newPkg.name} (${newPkg.price.toLocaleString("vi-VN")} VNĐ, ${newPkg.durationMonths} tháng)`,
      request
    );

    return NextResponse.json(
      { message: "Tạo gói thanh toán thành công!", package: newPkg },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Lỗi API POST /api/admin/payments/packages:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi tạo gói thanh toán.", error: error.message },
      { status: 500 }
    );
  }
}
