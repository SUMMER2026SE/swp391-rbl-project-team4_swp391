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
      en: "Argentina began their 2026 World Cup [campaign]{chiến dịch} with an impressive 3-0 victory over Algeria in Group J, delivering a dominant performance that underlined their status as one of the tournament favorites. The South American side controlled [possession]{kiểm soát bóng} for long periods and created numerous scoring opportunities through quick passing [combinations]{phối hợp} and aggressive attacking play. Algeria initially defended well and attempted to threaten on the counterattack, but Argentina's quality gradually became [overwhelming]{áp đảo} as the match progressed.",
      vi: "Argentina đã bắt đầu chiến dịch World Cup 2026 của họ với chiến thắng ấn tượng 3-0 trước Algeria ở bảng J, mang lại một màn trình diễn áp đảo giúp củng cố vị thế là một trong những ứng cử viên nặng ký của giải đấu. Đội bóng Nam Mỹ đã kiểm soát bóng trong thời gian dài và tạo ra nhiều cơ hội ghi bàn thông qua các pha phối hợp chuyền bóng nhanh và lối chơi tấn công xông xáo. Algeria ban đầu phòng ngự tốt và cố gắng đe dọa bằng những pha phản công, nhưng chất lượng vượt trội của Argentina dần trở nên áp đảo khi trận đấu tiếp diễn."
    },
    {
      en: "The breakthrough goal [eased]{giải tỏa} any early pressure on the defending champions, allowing them to play with greater confidence and freedom. Additional goals in the second half reflected Argentina’s [superiority]{sự vượt trội} and ensured that the result was never seriously in doubt. The victory placed Argentina in a strong position in Group J and provided an important [boost]{sự thúc đẩy} to their hopes of advancing comfortably to the [knockout]{vòng loại trực tiếp} stage.",
      vi: "Bàn thắng khai thông thế bế tắc đã giải tỏa mọi áp lực ban đầu cho các nhà đương kim vô địch, cho phép họ chơi bóng với sự tự tin và tự do hơn. Các bàn thắng bổ sung trong hiệp hai phản ánh sự vượt trội của Argentina và đảm bảo rằng kết quả trận đấu không bao giờ bị nghi ngờ nghiêm trọng. Chiến thắng đã đưa Argentina vào một vị thế vững chắc ở bảng J và tạo động lực thúc đẩy quan trọng cho hy vọng đi tiếp một cách thoải mái vào vòng loại trực tiếp."
    },
    {
      en: "Algeria showed [determination]{sự quyết tâm} and [discipline]{kỷ luật} at times but struggled to cope with the technical ability and movement of their opponents. After the match, Argentine players and coaching staff praised the team’s focus and [intensity]{độ quyết liệt}, emphasizing the importance of starting the tournament with three points. Analysts noted that Argentina appeared well organized in both attack and defense, while Algeria would need positive results in their remaining group matches to keep their qualification hopes alive. The match reinforced expectations that Argentina could once again be a major [contender]{ứng cử viên vô địch} for the World Cup title, while also highlighting the challenges facing emerging teams when competing against one of football’s traditional powerhouses.",
      vi: "Algeria đôi lúc đã thể hiện sự quyết tâm và tính kỷ luật nhưng phải vật lộn để đối phó với khả năng kỹ thuật và sự di chuyển của các đối thủ. Sau trận đấu, các cầu thủ và ban huấn luyện Argentina ca ngợi sự tập trung và độ quyết liệt của toàn đội, nhấn mạnh tầm quan trọng của việc khởi đầu giải đấu với ba điểm. Các nhà phân tích lưu ý rằng Argentina có vẻ được tổ chức tốt trong cả tấn công lẫn phòng ngự, trong khi Algeria sẽ cần những kết quả tích cực trong các trận đấu vòng bảng còn lại để giữ vững hy vọng đi tiếp. Trận đấu củng cố những kỳ vọng rằng Argentina một lần nữa có thể là ứng cử viên vô địch nặng ký cho danh hiệu World Cup, đồng thời làm nổi bật những thách thức mà các đội bóng mới nổi phải đối mặt khi thi đấu với một trong những thế lực truyền thống của bóng đá thế giới."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/football/2026/jun/16/argentina-algeria-world-cup-group-j-match-report",
      source_label: "The Guardian",
      title: "Argentina 3-0 Algeria: World Cup Group J match report",
      title_vi: "Argentina 3-0 Algeria: Báo cáo trận đấu bảng J World Cup",
      category: "Sports",
      category_vi: "Thể thao",
      excerpt: "Argentina began their World Cup campaign with an impressive 3-0 victory over Algeria in Group J.",
      excerpt_vi: "Argentina đã bắt đầu chiến dịch World Cup của mình bằng chiến thắng ấn tượng 3-0 trước Algeria ở bảng J.",
      author: "Jacob Steinberg",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
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
