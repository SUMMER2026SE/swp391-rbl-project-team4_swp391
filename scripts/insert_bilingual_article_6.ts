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
      en: "The latest developments in the war in Ukraine focused on growing pressure on Russia and signs that the United States may soon restore stricter sanctions on Russian oil exports. Speaking during the G7 summit, President Donald Trump suggested that the temporary [waiver]{lệnh miễn trừ} allowing certain transactions involving Russian oil could soon come to an end now that oil [shipments]{lô hàng vận chuyển} through the Strait of Hormuz have resumed following a ceasefire in the Middle East. The waiver had originally been introduced to stabilize global energy markets during [disruptions]{sự gián đoạn} caused by regional conflict, but its possible [expiration]{sự hết hạn} would represent a significant increase in economic pressure on Moscow.",
      vi: "Những diễn biến mới nhất trong cuộc chiến ở Ukraine tập trung vào áp lực ngày càng tăng đối với Nga và những dấu hiệu cho thấy Hoa Kỳ có thể sớm khôi phục các lệnh trừng phạt nghiêm khắc hơn đối với xuất khẩu dầu mỏ của Nga. Phát biểu trong hội nghị thượng đỉnh G7, Tổng thống Donald Trump gợi ý rằng lệnh miễn trừ tạm thời cho phép một số giao dịch liên quan đến dầu mỏ của Nga có thể sớm kết thúc khi các lô hàng vận chuyển dầu qua eo biển Hormuz đã được nối lại sau lệnh ngừng bắn ở Trung Đông. Lệnh miễn trừ ban đầu được đưa ra nhằm ổn định thị trường năng lượng toàn cầu trong thời gian xảy ra sự gián đoạn do xung đột khu vực, nhưng khả năng nó hết hạn sẽ đại diện cho một sự gia tăng đáng kể áp lực kinh tế đối với Moscow."
    },
    {
      en: "Ukrainian President Volodymyr Zelenskyy used the summit to argue that Russia is not winning the war and urged Western leaders to strengthen sanctions while expanding military support for Ukraine. European governments largely [backed]{ủng hộ} these calls and discussed additional measures targeting Russian financial institutions, military suppliers, and the so-called shadow fleet used to transport [sanctioned]{bị trừng phạt} oil. Meanwhile, fighting continued on the ground as Russian missile and drone attacks caused civilian [casualties]{thương vong} and damage to [infrastructure]{cơ sở hạ tầng} across Ukraine. Ukrainian forces also maintained pressure through long-range drone strikes against Russian military and energy targets.",
      vi: "Tổng thống Ukraine Volodymyr Zelenskyy đã tận dụng hội nghị thượng đỉnh để lập luận rằng Nga đang không giành chiến thắng trong cuộc chiến và hối thúc các nhà lãnh đạo phương Tây thắt chặt các lệnh trừng phạt đồng thời mở rộng hỗ trợ quân sự cho Ukraine. Các chính phủ châu Âu phần lớn ủng hộ những lời kêu gọi này và thảo luận về các biện pháp bổ sung nhằm vào các tổ chức tài chính, nhà cung cấp quân sự của Nga và cái gọi là hạm đội bóng tối được sử dụng để vận chuyển dầu bị trừng phạt. Trong khi đó, giao tranh tiếp tục diễn ra trên thực địa khi các cuộc tấn công bằng tên lửa và máy bay không người lái của Nga gây ra thương vong cho dân thường và làm hư hại cơ sở hạ tầng trên khắp Ukraine. Các lực lượng Ukraine cũng duy trì áp lực thông qua các cuộc tấn công bằng máy bay không người lái tầm xa nhằm vào các mục tiêu quân sự và năng lượng của Nga."
    },
    {
      en: "The [briefing]{bản tóm tắt} noted that political attention among Western leaders has increasingly returned to Ukraine after months of focus on conflicts in the Middle East, with several governments viewing the current moment as an opportunity to increase pressure on the [Kremlin]{Điện Kremlin} and encourage [negotiations]{đàm phán}. Despite ongoing diplomatic discussions, both sides continue to exchange attacks, highlighting the difficulty of achieving a lasting [settlement]{sự dàn xếp} while the war remains active on multiple fronts.",
      vi: "Bản tóm tắt lưu ý rằng sự chú ý chính trị của các nhà lãnh đạo phương Tây ngày càng quay trở lại Ukraine sau nhiều tháng tập trung vào các xung đột ở Trung Đông, với việc một số chính phủ coi thời điểm hiện tại là cơ hội để gia tăng áp lực lên Điện Kremlin và khuyến khích đàm phán. Bất chấp các cuộc thảo luận ngoại giao đang diễn ra, cả hai bên vẫn tiếp tục các cuộc tấn công lẫn nhau, làm nổi bật sự khó khăn trong việc đạt được một sự dàn xếp lâu dài trong khi chiến tranh vẫn tiếp tục diễn ra tích cực trên nhiều mặt trận."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/world/2026/jun/17/ukraine-war-briefing-sanctions-waiver-on-russian-oil-could-end-soon-trump-suggests",
      source_label: "The Guardian",
      title: "Ukraine war briefing: sanctions waiver on Russian oil could end soon, Trump suggests",
      title_vi: "Tin vắn chiến tranh Ukraine: Miễn trừ trừng phạt dầu mỏ Nga có thể sớm kết thúc, theo gợi ý của Trump",
      category: "World News",
      category_vi: "Tin thế giới",
      excerpt: "The United States may soon restore stricter sanctions on Russian oil exports as Trump suggests waiver could end.",
      excerpt_vi: "Hoa Kỳ có thể sớm khôi phục các lệnh trừng phạt nghiêm khắc hơn đối với xuất khẩu dầu mỏ của Nga khi Trump gợi ý lệnh miễn trừ có thể kết thúc.",
      author: "Guardian staff and agencies",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
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
