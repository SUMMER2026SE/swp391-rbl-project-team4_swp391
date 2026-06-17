import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join("=").trim();
        process.env[key] = val;
      }
    });
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kaoybbpezkkmufzbhxru.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb3liYnBlemtrbXVmemJoeHJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI2Nzc5NSwiZXhwIjoyMDk0ODQzNzk1fQ.7VT1X4qttHogRpiJoKNxjFJ5cMUAqmQyg4m_7wxk3F8";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function main() {
  console.log("Inserting bilingual article...");

  const content = [
    {
      en: "Federal authorities announced that they had [disrupted]{đập tan} an alleged terrorist plot targeting a UFC event held on the White House grounds, leading to the arrest of several suspects across multiple states. According to investigators, the group planned a [coordinated]{phối hợp} attack involving explosive-laden drones and sniper teams with the intention of creating panic among spectators before targeting government officials and other high-profile attendees during the [evacuation]{sự sơ tán}. The event, which was part of the “Freedom 250” celebrations marking the 250th anniversary of American [independence]{sự độc lập}, attracted thousands of spectators and featured the attendance of President Donald Trump and other senior political figures.",
      vi: "Các nhà chức trách liên bang tuyên bố rằng họ đã đập tan một âm mưu khủng bố nhằm vào sự kiện UFC được tổ chức trên khuôn viên Nhà Trắng, dẫn đến việc bắt giữ một số nghi phạm ở nhiều bang khác nhau. Theo các nhà điều tra, nhóm này đã lên kế hoạch cho một cuộc tấn công phối hợp liên quan đến máy bay không người lái mang chất nổ và các đội bắn tỉa với mục đích gây ra sự hoảng loạn cho khán giả trước khi nhắm mục tiêu vào các quan chức chính phủ và những người tham dự cấp cao khác trong quá trình sơ tán. Sự kiện này là một phần của lễ kỷ niệm “Tự do 250” đánh dấu kỷ niệm 250 năm ngày độc lập của nước Mỹ, thu hút hàng ngàn khán giả và có sự tham dự của Tổng thống Donald Trump cùng các nhân vật chính trị cấp cao khác."
    },
    {
      en: "The FBI said the operation was uncovered after receiving information about [suspicious]{khả nghi} activity and weapons purchases, allowing authorities to [intervene]{can thiệp} before the plan could be carried out. Prosecutors described the conspiracy as highly organized, involving [encrypted]{mã hóa} communications, [reconnaissance]{trinh sát} efforts, and discussions about broader anti-government objectives. Investigators believe additional individuals may have been connected to the scheme, and the inquiry remains ongoing.",
      vi: "FBI cho biết hoạt động này được phát hiện sau khi nhận được thông tin về hoạt động khả nghi và mua sắm vũ khí, cho phép các cơ quan chức năng can thiệp trước khi kế hoạch có thể được thực hiện. Các công tố viên mô tả âm mưu này có tổ chức cao, liên quan đến các liên lạc được mã hóa, các nỗ lực trinh sát và thảo luận về các mục tiêu chống chính phủ rộng lớn hơn. Các nhà điều tra tin rằng những cá nhân khác có thể có liên quan đến âm mưu này và cuộc điều tra vẫn đang tiếp diễn."
    },
    {
      en: "Officials emphasized that there was no immediate danger to the public once the arrests had been made and praised the cooperation between federal, state, and local law-enforcement agencies. The case has renewed concerns about domestic [extremism]{chủ nghĩa cực đoan}, online [radicalization]{sự cực đoan hóa}, and the growing use of drones as potential tools for terrorist attacks. Security experts noted that major public gatherings involving political leaders continue to present attractive targets for extremist groups, making intelligence gathering and [preventive]{phòng ngừa} operations critical components of national security efforts. The successful disruption of the alleged plot was described by authorities as a significant [achievement]{thành tích} that prevented what could have become one of the most serious attacks on a high-profile public event in recent years.",
      vi: "Các quan chức nhấn mạnh rằng không có mối đe dọa trực tiếp nào đối với công chúng sau khi các vụ bắt giữ được thực hiện, đồng thời ca ngợi sự hợp tác giữa các cơ quan thực thi pháp luật liên bang, tiểu bang và địa phương. Vụ việc đã làm dấy lên những lo ngại về chủ nghĩa cực đoan trong nước, sự cực đoan hóa trực tuyến và việc sử dụng ngày càng tăng của máy bay không người lái như một công cụ tiềm năng cho các cuộc tấn công khủng bố. Các chuyên gia bảo mật lưu ý rằng các cuộc tụ họp công cộng lớn liên quan đến các nhà lãnh đạo chính trị tiếp tục là mục tiêu hấp dẫn đối với các nhóm cực đoan, khiến việc thu thập thông tin tình báo và các hoạt động phòng ngừa trở thành thành phần cốt lõi của các nỗ lực an ninh quốc gia. Việc đập tan thành công âm mưu này được các cơ quan chức năng mô tả là một thành tích đáng kể giúp ngăn chặn một vụ tấn công nghiêm trọng nhất vào một sự kiện công cộng cấp cao trong những năm gần đây."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/us-news/2026/jun/16/white-house-ufc-fight-planned-attacks-foiled-after-fbi-arrests-suspects",
      source_label: "The Guardian",
      title: "White House UFC fight planned attacks foiled after FBI arrests suspects",
      title_vi: "Đập tan kế hoạch tấn công sự kiện UFC tại Nhà Trắng sau khi FBI bắt giữ các nghi phạm",
      category: "World News",
      category_vi: "Tin thế giới",
      excerpt: "Federal authorities disrupted an alleged terrorist plot targeting a UFC event held on the White House grounds.",
      excerpt_vi: "Các nhà chức trách liên bang đã đập tan một âm mưu khủng bố nhằm vào sự kiện UFC tại Nhà Trắng.",
      author: "Hugo Lowell",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article:", data);
}

main().catch(console.error);
