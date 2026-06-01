import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { getStudentStreak, addNotification, getLocalDateString } from "@/lib/studentProgressDb";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function POST(request: NextRequest) {
  try {
    console.log("⚡ [Notification Trigger] Bắt đầu quét tiến trình học viên...");
    
    // 1. Lấy danh sách toàn bộ người dùng từ Supabase Auth
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      throw new Error(error.message);
    }

    const todayStr = getLocalDateString();
    const yesterdayStr = getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    let studyRemindersCount = 0;
    let streakWarningsCount = 0;
    const logDetails: string[] = [];

    // Lọc ra các tài khoản là STUDENT hoặc GUEST và có email hợp lệ
    const students = users.filter((u) => {
      const metadata = u.user_metadata || {};
      const role = metadata.role || "GUEST";
      return (role === "STUDENT" || role === "GUEST") && !!u.email;
    });

    for (const student of students) {
      const email = student.email!;
      const metadata = student.user_metadata || {};
      const name = metadata.name || email.split("@")[0];
      
      // Lấy cấu hình nhận thông báo của học viên (mặc định là true nếu chưa được thiết lập)
      const inAppEnabled = metadata.inAppReminders !== false;
      const emailEnabled = metadata.emailReminders !== false;
      const streakWarningEnabled = metadata.streakWarning !== false;

      // Lấy thông tin streak của học viên từ studentProgressDb
      const streak = await getStudentStreak(student.id);

      // Điều kiện 1: Học viên sắp mất streak (đã học vào hôm qua nhưng hôm nay chưa học)
      const isStreakWarningCandidate = 
        streak.currentStreak > 0 && 
        streak.lastStudyDate === yesterdayStr && 
        streak.lastStudyDate !== todayStr;

      // Điều kiện 2: Học viên hôm nay chưa học (dù có hay không có streak)
      const isStudyReminderCandidate = 
        streak.lastStudyDate !== todayStr;

      if (isStreakWarningCandidate && streakWarningEnabled) {
        // Gửi cảnh báo mất Streak
        const title = "Cảnh báo mất chuỗi học tập! 🔥";
        const content = `Chào ${name}, chuỗi ${streak.currentStreak} ngày học tập của bạn sắp bị đặt lại! Hãy vào luyện tập Speaking hoặc làm bài thi thử ngay bây giờ để duy trì streak nhé!`;
        
        // 1. Tạo thông báo trong ứng dụng
        if (inAppEnabled) {
          await addNotification(student.id, title, content, "STREAK_WARNING");
        }

        // 2. Gửi Email thông báo qua Resend
        if (emailEnabled && process.env.RESEND_API_KEY) {
          try {
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "noreply@luyenielts.site",
              to: email,
              subject: "Cảnh báo sắp mất Streak học tập! 🔥 - QualiIelts",
              html: getStreakWarningEmailHtml(name, streak.currentStreak)
            });
          } catch (err: any) {
            console.error(`Lỗi gửi email cảnh báo mất streak tới ${email}:`, err.message);
          }
        }
        
        streakWarningsCount++;
        logDetails.push(`Đã gửi cảnh báo mất streak cho học viên ${name} (${email}) - Streak hiện tại: ${streak.currentStreak}`);
      } 
      else if (isStudyReminderCandidate && isStudyReminderCandidate && !isStreakWarningCandidate) {
        // Gửi nhắc nhở học tập hàng ngày
        if (inAppEnabled || emailEnabled) {
          const title = "Đã đến giờ luyện thi IELTS rồi! 📚";
          const content = `Chào ${name}, hôm nay bạn chưa làm bài luyện tập nào trên QualiIelts. Dành ra 10 phút luyện Speaking hôm nay để tiến gần hơn tới band điểm mục tiêu nhé!`;

          // 1. Tạo thông báo trong ứng dụng
          if (inAppEnabled) {
            await addNotification(student.id, title, content, "STUDY_REMINDER");
          }

          // 2. Gửi Email thông báo qua Resend
          if (emailEnabled && process.env.RESEND_API_KEY) {
            try {
              await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "noreply@luyenielts.site",
                to: email,
                subject: "Đã đến lúc luyện tập IELTS hôm nay rồi! 📚 - QualiIelts",
                html: getStudyReminderEmailHtml(name, streak.currentStreak)
              });
            } catch (err: any) {
              console.error(`Lỗi gửi email nhắc học tới ${email}:`, err.message);
            }
          }

          studyRemindersCount++;
          logDetails.push(`Đã gửi nhắc nhở học tập cho học viên ${name} (${email})`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Quá trình quét và gửi thông báo hoàn tất!",
      studyRemindersCount,
      streakWarningsCount,
      logDetails
    });
  } catch (error: any) {
    console.error("❌ Lỗi API POST /api/admin/notifications/trigger-reminders:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi kích hoạt gửi nhắc nhở.", error: error.message },
      { status: 500 }
    );
  }
}

function getStreakWarningEmailHtml(name: string, streakCount: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, sans-serif; background: #f4f5f9; margin: 0; padding: 40px 16px;">
      <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(15,23,56,0.08);">
        <div style="background: linear-gradient(135deg, #0d153a 0%, #ff8e26 100%); padding: 32px; text-align: center;">
          <div style="font-size: 28px; font-weight: 900; color: white;">
            <span style="color: #ff8e26;">🔥</span> QualiIelts
          </div>
          <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 8px 0 0;">Cảnh báo sắp mất Streak học tập</p>
        </div>
        <div style="padding: 32px; text-align: center;">
          <h2 style="font-size: 20px; font-weight: 800; color: #0d153a; margin: 0 0 12px;">Đừng để dập tắt ngọn lửa học tập, ${name}!</h2>
          <p style="color: #5e6792; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Bạn đang có chuỗi học tập rất tuyệt vời là <strong>${streakCount} ngày liên tiếp</strong>. Chỉ còn vài tiếng nữa chuỗi này sẽ bị đặt lại về 0 nếu bạn bỏ lỡ ngày hôm nay!
          </p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/speaking"
            style="display: inline-block; background: #3B5C37; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
            Luyện tập ngay để Giữ Streak →
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getStudyReminderEmailHtml(name: string, streakCount: number): string {
  const streakText = streakCount > 0 ? `Bắt đầu ngày học tiếp theo để tăng chuỗi streak hiện tại của bạn (${streakCount} ngày) nhé!` : "Hãy tạo thói quen luyện tập hàng ngày từ hôm nay!";
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, sans-serif; background: #f4f5f9; margin: 0; padding: 40px 16px;">
      <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(15,23,56,0.08);">
        <div style="background: linear-gradient(135deg, #0d153a 0%, #3B5C37 100%); padding: 32px; text-align: center;">
          <div style="font-size: 28px; font-weight: 900; color: white;">
            <span style="color: #3B5C37;">📚</span> QualiIelts
          </div>
          <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 8px 0 0;">Nhắc nhở học tập hàng ngày</p>
        </div>
        <div style="padding: 32px; text-align: center;">
          <h2 style="font-size: 20px; font-weight: 800; color: #0d153a; margin: 0 0 12px;">Đã đến lúc học bài rồi, ${name}!</h2>
          <p style="color: #5e6792; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Hôm nay bạn chưa hoàn thành hoạt động luyện nói nào trên QualiIelts. ${streakText} Dành ra chỉ 10 phút hôm nay để nhanh chóng bứt phá điểm IELTS Speaking nhé.
          </p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/speaking"
            style="display: inline-block; background: #3B5C37; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
            Vào Luyện Speaking →
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}
