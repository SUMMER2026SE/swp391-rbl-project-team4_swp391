import { NextRequest, NextResponse } from "next/server";
import { requireRole, ADMIN_ONLY } from "@/lib/roles";
import { getPackages, createPackage, getInvoices } from "@/lib/paymentDb";
import { supabaseAdmin } from "@/lib/supabase";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  try {
    const packages = await getPackages();
    const invoices = await getInvoices();

    const buyerCounts: Record<string, number> = {};

    // Count purchases from invoices
    invoices.forEach((inv) => {
      if (inv.status === "PAID" || inv.status === "PENDING") {
        buyerCounts[inv.packageId] = (buyerCounts[inv.packageId] || 0) + 1;
      }
    });

    // Count subscriptions/metadata from Supabase users
    try {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      if (users) {
        users.forEach((u) => {
          const pkgId = u.user_metadata?.packageId;
          if (pkgId && pkgId !== "none") {
            buyerCounts[pkgId] = (buyerCounts[pkgId] || 0) + 1;
          }
        });
      }
    } catch {
      // Ignore if fail
    }

    const packagesWithCounts = packages.map((pkg) => ({
      ...pkg,
      buyerCount: buyerCounts[pkg.id] || buyerCounts[pkg.name] || 0,
    }));

    // Sort packages by durationMonths ascending then price
    packagesWithCounts.sort((a, b) => (a.durationMonths || 0) - (b.durationMonths || 0) || a.price - b.price);
    return NextResponse.json({ packages: packagesWithCounts });
  } catch (error: any) {
    console.error("❌ Lỗi API GET /api/admin/payments/packages:", error);
    return NextResponse.json(
      { message: "Không thể lấy danh sách gói thanh toán.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ADMIN_ONLY);
  if (!auth) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

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
