import { NextRequest, NextResponse } from "next/server";
import { requireRole, ADMIN_ONLY } from "@/lib/roles";
import { getSettings, saveSettings } from "@/lib/settingsDb";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("❌ Lỗi API GET /api/admin/settings:", error);
    return NextResponse.json(
      { message: "Không thể lấy cấu hình hệ thống.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ADMIN_ONLY);
  if (!auth) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { system, email, bandScore } = body;

    if (!system || !email || !bandScore) {
      return NextResponse.json(
        { message: "Thiếu dữ liệu cấu hình hệ thống." },
        { status: 400 }
      );
    }

    // Validate weights sum (should equal 1.0 or 100)
    const { fluencyWeight, lexicalWeight, grammarWeight, pronunciationWeight } = bandScore;
    const totalWeight = Number(fluencyWeight) + Number(lexicalWeight) + Number(grammarWeight) + Number(pronunciationWeight);
    
    // Allow small rounding tolerance for floating point numbers
    if (Math.abs(totalWeight - 1.0) > 0.001 && Math.abs(totalWeight - 100) > 0.1) {
      return NextResponse.json(
        { message: `Tổng các trọng số chấm điểm Speaking phải bằng 1.0 (hoặc 100%). Hiện tại đang là: ${totalWeight}` },
        { status: 400 }
      );
    }

    // Standardize weights to scale of 0.0 to 1.0 if entered as percentages
    const adjustedBandScore = { ...bandScore };
    if (totalWeight > 50) {
      adjustedBandScore.fluencyWeight = Number(fluencyWeight) / 100;
      adjustedBandScore.lexicalWeight = Number(lexicalWeight) / 100;
      adjustedBandScore.grammarWeight = Number(grammarWeight) / 100;
      adjustedBandScore.pronunciationWeight = Number(pronunciationWeight) / 100;
    }

    const success = await saveSettings({
      system,
      email,
      bandScore: adjustedBandScore
    });

    if (!success) {
      throw new Error("Lỗi khi lưu tệp tin JSON cấu hình.");
    }

    // Log admin activity
    await logActivity(
      "UPDATE",
      "Cấu hình Hệ thống",
      "system-settings",
      `Cập nhật thành công các cấu hình hệ thống, thiết lập mail SMTP và ngưỡng điểm IELTS Band.`,
      request
    );

    return NextResponse.json({
      message: "Cấu hình hệ thống đã được lưu thành công!",
      settings: { system, email, bandScore: adjustedBandScore }
    });
  } catch (error: any) {
    console.error("❌ Lỗi API POST /api/admin/settings:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi lưu cấu hình hệ thống.", error: error.message },
      { status: 500 }
    );
  }
}

// PUT fallback support
export async function PUT(request: NextRequest) {
  const auth = await requireRole(request, ADMIN_ONLY);
  if (!auth) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  return POST(request);
}
