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
  console.log("Inserting bilingual article 33 (G7 Europeans v2)...");

  const content = [
    {
      en: "European leaders used the G7 summit in France to press the United States on two major geopolitical fronts: the emerging Iran nuclear deal and the ongoing war in Ukraine. According to the article, France, Germany, and the United Kingdom expressed concern that the current U.S.–Iran framework may reduce immediate tensions but still leave unresolved issues around Iran’s nuclear program, missile capabilities, and regional influence. European officials reportedly warned that a limited or [interim]{tạm thời/lâm thời} agreement could stabilize the situation in the short term without delivering a durable long-term solution, increasing the risk of renewed [escalation]{sự leo thang} later.",
      vi: "Các nhà lãnh đạo châu Âu đã sử dụng hội nghị thượng đỉnh G7 tại Pháp để gây sức ép với Hoa Kỳ trên hai mặt trận địa chính trị lớn: thỏa thuận hạt nhân Iran đang thành hình và cuộc chiến đang diễn ra ở Ukraine. Theo bài viết, Pháp, Đức và Vương quốc Anh bày tỏ lo ngại rằng khuôn khổ Mỹ-Iran hiện tại có thể làm giảm bớt căng thẳng trước mắt nhưng vẫn để lại các vấn đề chưa được giải quyết xung quanh chương trình hạt nhân, năng lực tên lửa và ảnh hưởng khu vực của Iran. Các quan chức châu Âu được báo cáo là đã cảnh báo rằng một thỏa thuận hạn chế hoặc tạm thời có thể ổn định tình hình trong ngắn hạn nhưng không mang lại một giải pháp lâu dài bền vững, làm tăng nguy cơ leo thang trở lại sau này."
    },
    {
      en: "On Ukraine, European governments urged Washington to reassess its current strategy, arguing that battlefield developments and Ukraine’s increasing use of drone warfare have shifted the balance and created new opportunities for pressure on Russia. Some European leaders pushed for stronger U.S. backing for additional sanctions on Russian energy exports, as well as a more coordinated Western approach to forcing Moscow toward negotiations. However, the article notes that the U.S. position under President Trump appeared more cautious, with emphasis on de-escalation and diplomatic [flexibility]{sự linh hoạt} rather than immediate expansion of sanctions.",
      vi: "Về vấn đề Ukraine, các chính phủ châu Âu kêu gọi Washington đánh giá lại chiến lược hiện tại của mình, lập luận rằng những diễn biến trên chiến trường và việc Ukraine ngày càng tăng cường sử dụng chiến tranh máy bay không người lái đã làm thay đổi cán cân và tạo ra những cơ hội mới để gia tăng sức ép lên Nga. Một số nhà lãnh đạo châu Âu đã hối thúc sự ủng hộ mạnh mẽ hơn từ Mỹ đối với các lệnh trừng phạt bổ sung đối với xuất khẩu năng lượng của Nga, cũng như một cách tiếp cận phối hợp chặt chẽ hơn của phương Tây nhằm buộc Moscow tham gia đàm phán. Tuy nhiên, bài viết lưu ý rằng lập trường của Mỹ dưới thời Tổng thống Trump tỏ ra thận trọng hơn, chú trọng vào việc giảm leo thang và sự linh hoạt ngoại giao thay vì mở rộng ngay lập tức các lệnh trừng phạt."
    },
    {
      en: "The discussions highlighted broader divisions within the G7 over how to manage multiple simultaneous geopolitical crises. European countries are increasingly concerned that rapid diplomatic moves—particularly on Iran—could weaken broader Western [leverage]{sức bật/lực bẩy/sức ảnh hưởng} if not paired with clear enforcement mechanisms. At the same time, the U.S. appears focused on achieving near-term diplomatic breakthroughs even if longer-term frameworks remain unresolved.",
      vi: "Các cuộc thảo luận đã làm nổi bật những chia rẽ rộng lớn hơn trong G7 về cách quản lý nhiều cuộc khủng hoảng địa chính trị diễn ra đồng thời. Các nước châu Âu ngày càng lo ngại rằng các bước đi ngoại giao nhanh chóng — đặc biệt là về vấn đề Iran — có thể làm yếu đi sức ảnh hưởng rộng lớn hơn của phương Tây nếu không đi kèm với các cơ chế thực thi rõ ràng. Đồng thời, Mỹ dường như đang tập trung vào việc đạt được các đột phá ngoại giao ngắn hạn ngay cả khi các khuôn khổ dài hạn vẫn chưa được giải quyết."
    },
    {
      en: "Overall, the article portrays a subtle but growing transatlantic tension: Europe is pushing for structured, rules-based long-term containment strategies, while the United States is prioritizing faster negotiations and pragmatic short-term stabilization across both the Iran and Ukraine conflicts.",
      vi: "Nhìn chung, bài viết khắc họa một sự căng thẳng xuyên Đại Tây Dương tuy tinh tế nhưng đang gia tăng: Châu Âu đang thúc đẩy các chiến lược ngăn chặn dài hạn có cấu trúc và dựa trên quy tắc, trong khi Hoa Kỳ đang ưu tiên các cuộc đàm phán nhanh hơn và sự ổn định ngắn hạn thực tế trong cả hai cuộc xung đột Iran và Ukraine."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/world/europeans-test-trump-on-iran-deal-risks-g7-alternative-2026-06-16",
      source_label: "Reuters",
      title: "Europeans test Trump on Iran deal risks, urge Ukraine rethink at G7",
      title_vi: "Các nước châu Âu chất vấn Trump về rủi ro thỏa thuận Iran, hối thúc xem xét lại vấn đề Ukraine tại G7",
      category: "World News",
      category_vi: "Tin thế giới",
      excerpt: "Transatlantic tensions grow at the G7 over diplomatic approaches to Iran and Ukraine.",
      excerpt_vi: "Căng thẳng xuyên Đại Tây Dương gia tăng tại G7 về các tiếp cận ngoại giao đối với Iran và Ukraine.",
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

  console.log("Success! Inserted article 33:", data);
}

main().catch(console.error);
