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
  console.log("Inserting bilingual article 31 (G7 Europeans)...");

  const content = [
    {
      en: "European leaders used the G7 summit in France to press U.S. President Donald Trump on two major geopolitical issues: the risks surrounding the emerging U.S.–Iran deal and the future strategy for ending the war in Ukraine. According to the article, France, Germany, and the United Kingdom warned that the current Iran agreement, while reducing immediate conflict risk, could leave unresolved nuclear and missile-related concerns if it remains too limited in [scope]{phạm vi/quy mô}. European officials expressed concern that an “interim-style” deal might [stabilize]{ổn định hóa/làm cho ổn định} tensions temporarily but fail to prevent Iran from continuing long-term development of sensitive military capabilities.",
      vi: "Các nhà lãnh đạo châu Âu đã sử dụng hội nghị thượng đỉnh G7 tại Pháp để gây sức ép với Tổng thống Mỹ Donald Trump về hai vấn đề địa chính trị lớn: các rủi ro xung quanh thỏa thuận Mỹ-Iran đang thành hình và chiến lược tương lai nhằm chấm dứt chiến tranh ở Ukraine. Theo bài viết, Pháp, Đức và Vương quốc Anh cảnh báo rằng thỏa thuận Iran hiện tại, dù làm giảm nguy cơ xung đột tức thì, có thể để lại các mối lo ngại chưa được giải quyết liên quan đến hạt nhân và tên lửa nếu nó vẫn có phạm vi quá hạn chế. Các quan chức châu Âu bày tỏ lo ngại rằng một thỏa thuận kiểu \"tạm thời\" có thể ổn định hóa tạm thời căng thẳng nhưng không ngăn được Iran tiếp tục phát triển lâu dài các năng lực quân sự nhạy cảm."
    },
    {
      en: "On Ukraine, European leaders urged the United States to rethink its approach to the war, arguing that recent battlefield shifts and Ukrainian drone operations inside Russian territory have improved Kyiv’s negotiating position. They pressed Trump to support stronger pressure on Moscow, including the possibility of additional sanctions on Russian energy exports. While Trump signaled openness to [facilitating]{tạo điều kiện/thúc đẩy} peace talks between Ukraine and Russia, European diplomats reportedly found him noncommittal on concrete new punitive measures.",
      vi: "Về vấn đề Ukraine, các nhà lãnh đạo châu Âu kêu gọi Hoa Kỳ xem xét lại cách tiếp cận đối với cuộc chiến, lập luận rằng những chuyển dịch trên chiến trường gần đây và các hoạt động máy bay không người lái của Ukraine bên trong lãnh thổ Nga đã cải thiện vị thế đàm phán của Kyiv. Họ hối thúc Trump ủng hộ áp lực mạnh mẽ hơn lên Moscow, bao gồm cả khả năng áp đặt thêm các lệnh trừng phạt đối với xuất khẩu năng lượng của Nga. Trong khi Trump báo hiệu sự cởi mở trong việc tạo điều kiện cho các cuộc đàm phán hòa bình giữa Ukraine và Nga, các nhà ngoại giao châu Âu được báo cáo là nhận thấy ông không cam kết về các biện pháp trừng phạt mới cụ thể."
    },
    {
      en: "The discussions reflected broader tensions within the G7 over how to manage multiple overlapping global crises. European governments are seeking a more [coordinated]{phối hợp/đồng bộ} Western position that avoids allowing diplomatic momentum on Iran to weaken support for Ukraine. At the same time, the United States appears focused on rapid deal-making and de-escalation strategies, prioritizing immediate stabilization over longer-term structural guarantees.",
      vi: "Các cuộc thảo luận phản ánh căng thẳng rộng lớn hơn trong G7 về cách quản lý nhiều cuộc khủng hoảng toàn cầu chồng chéo nhau. Các chính phủ châu Âu đang tìm kiếm một lập trường phối hợp chặt chẽ hơn của phương Tây nhằm tránh để đà ngoại giao về Iran làm suy yếu sự hỗ trợ dành cho Ukraine. Đồng thời, Hoa Kỳ dường như đang tập trung vào việc ra quyết định nhanh chóng và các chiến lược giảm leo thang, ưu tiên sự ổn định ngay lập tức hơn là các đảm bảo cấu trúc lâu dài."
    },
    {
      en: "Overall, the article portrays a subtle but important divide: Europe is pushing for more durable frameworks on both Iran and Ukraine, while the U.S. under Trump is emphasizing quick diplomatic breakthroughs, even if they leave unresolved issues for later negotiation.",
      vi: "Nhìn chung, bài viết phác họa một sự chia rẽ tinh tế nhưng quan trọng: châu Âu đang thúc đẩy các khuôn khổ bền vững hơn cho cả Iran và Ukraine, khi Mỹ dưới thời Trump đang nhấn mạnh vào các đột phá ngoại giao nhanh chóng, ngay cả khi chúng để lại những vấn đề chưa giải quyết cho các cuộc đàm phán sau này."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/world/europeans-test-trump-on-iran-deal-risks-at-g7-2026-06-16",
      source_label: "Reuters",
      title: "Europeans test Trump on Iran deal risks, urge Ukraine rethink at G7",
      title_vi: "Các nước châu Âu chất vấn Trump về rủi ro thỏa thuận Iran, hối thúc xem xét lại vấn đề Ukraine tại G7",
      category: "World News",
      category_vi: "Tin thế giới",
      excerpt: "European leaders warn Trump that the current Iran deal could leave unresolved nuclear concerns.",
      excerpt_vi: "Các nhà lãnh đạo châu Âu cảnh báo Trump rằng thỏa thuận Iran hiện tại có thể để lại các mối lo ngại hạt nhân chưa giải quyết.",
      author: "Reuters Staff",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 31:", data);
}

main().catch(console.error);
