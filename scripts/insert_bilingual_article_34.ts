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
  console.log("Inserting bilingual article 34 (World Cup Debutants)...");

  const content = [
    {
      en: "The interactive piece explains how the first-time participants in the expanded 2026 FIFA World Cup secured qualification, highlighting the long and varied pathways taken by [debutant]{tân binh/đội ra mắt lần đầu} nations under FIFA’s new 48-team format. It focuses on how the restructuring of qualification slots across continents created new opportunities for emerging football nations to reach the tournament for the first time, making the World Cup more globally [representative]{mang tính đại diện} than in previous editions.",
      vi: "Bài tương tác giải thích cách các đội bóng tham gia lần đầu tại vòng chung kết FIFA World Cup 2026 mở rộng đã đảm bảo được suất vượt qua vòng loại, làm nổi bật những chặng đường dài và đa dạng mà các quốc gia tân binh đã trải qua dưới thể thức 48 đội mới của FIFA. Bài viết tập trung vào cách tái cơ cấu các suất vượt qua vòng loại giữa các châu lục đã tạo ra những cơ hội mới cho các quốc gia bóng đá mới nổi lần đầu tiên vươn tới giải đấu, giúp World Cup mang tính đại diện toàn cầu hơn so với các kỳ giải trước."
    },
    {
      en: "Among the standout debutants are countries such as Cape Verde, Curaçao, Jordan, and Uzbekistan, each of which achieved qualification through different regional routes and competitive circumstances. The article emphasizes that these breakthroughs were not accidental but the result of sustained development programs, improved domestic leagues, and successful qualifying campaigns against traditionally stronger opponents. In several cases, these teams [capitalized]{tận dụng/khai thác} on expanded confederation slots, but they also demonstrated competitive consistency throughout multi-stage qualification processes.",
      vi: "Trong số các đội tân binh nổi bật có các quốc gia như Cape Verde, Curaçao, Jordan và Uzbekistan, mỗi nước đều giành được suất vượt qua vòng loại thông qua các con đường khu vực và hoàn cảnh thi đấu khác nhau. Bài báo nhấn mạnh rằng những bước đột phá này không phải là ngẫu nhiên mà là kết quả của các chương trình phát triển bền vững, giải vô địch quốc nội được cải thiện và các chiến dịch vòng loại thành công trước các đối thủ truyền thống mạnh hơn. Trong một số trường hợp, các đội bóng này đã tận dụng tốt các suất mở rộng của liên đoàn, nhưng họ cũng chứng minh được sự nhất quán trong thi đấu trong suốt các quá trình vòng loại nhiều giai đoạn."
    },
    {
      en: "The piece also highlights how qualification formats differ across regions. In Africa and Asia, teams face long multi-round systems requiring consistency over many matches, while in CONCACAF and smaller [confederations]{liên đoàn}, final-round group stages or playoff systems determine qualification. These structural differences mean that each debutant’s path to the World Cup reflects not only sporting success but also the unique challenges of their regional qualification systems.",
      vi: "Bài viết cũng nêu bật cách thức thể thức vòng loại khác nhau giữa các khu vực. Ở Châu Phi và Châu Á, các đội phải đối mặt với các hệ thống nhiều vòng kéo dài đòi hỏi tính nhất quán qua nhiều trận đấu, trong khi ở CONCACAF và các liên đoàn nhỏ hơn, các vòng bảng cuối cùng hoặc hệ thống vòng loại trực tiếp (playoff) sẽ quyết định suất tham dự. Những khác biệt về mặt cấu trúc này đồng nghĩa với việc con đường đến World Cup của mỗi đội tân binh không chỉ phản ánh thành công trong thể thao mà còn cả những thử thách đặc thù của hệ thống vòng loại trong khu vực của họ."
    },
    {
      en: "Beyond individual stories, the article frames the 2026 World Cup as a structural turning point in international football. The expansion to 48 teams has reduced barriers to entry and allowed historically underrepresented nations to compete on the sport’s biggest stage. This has increased competitive [diversity]{sự đa dạng}, with more teams from Africa, Asia, and the Caribbean reaching the finals than in previous tournaments.",
      vi: "Vượt ra ngoài những câu chuyện cá nhân, bài viết coi World Cup 2026 là một bước ngoặt cấu trúc trong bóng đá quốc tế. Việc mở rộng lên 48 đội đã làm giảm các rào cản gia nhập và cho phép các quốc gia ít được đại diện trong lịch sử được thi đấu trên sân khấu lớn nhất của môn thể thao này. Điều này đã làm tăng sự đa dạng trong thi đấu, với nhiều đội bóng từ Châu Phi, Châu Á và vùng Caribe lọt vào vòng chung kết hơn các giải đấu trước đây."
    },
    {
      en: "Overall, the piece presents the debutants as symbols of a changing global football landscape, where broader access and deeper investment in football infrastructure are reshaping the traditional hierarchy of the sport. The result is a World Cup that is not only larger but also more inclusive, reflecting the growing competitiveness of nations outside football’s traditional power centers.",
      vi: "Nhìn chung, bài viết trình bày các đội tân binh như những biểu tượng của bối cảnh bóng đá toàn cầu đang thay đổi, nơi sự tiếp cận rộng rãi hơn và đầu tư sâu hơn vào cơ sở hạ tầng bóng đá đang định hình lại hệ thống phân cấp truyền thống của môn thể thao này. Kết quả là một kỳ World Cup không chỉ lớn hơn mà còn bao trùm hơn, phản ánh khả năng cạnh tranh ngày càng tăng của các quốc gia nằm ngoài các trung tâm quyền lực truyền thống của bóng đá."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/sports/soccer/how-world-cup-2026-debutants-earned-their-place-in-finals-2026-06-16",
      source_label: "Reuters",
      title: "How World Cup 2026 debutants earned their place in the finals",
      title_vi: "Các đội bóng tân binh World Cup 2026 đã giành vé vào vòng chung kết như thế nào",
      category: "Sports",
      category_vi: "Thể thao",
      excerpt: "The article explains how first-time participants secured their spot in the expanded 2026 FIFA World Cup.",
      excerpt_vi: "Bài viết giải thích cách các đội bóng tham gia lần đầu giành suất tại vòng chung kết FIFA World Cup 2026.",
      author: "Reuters Graphics Team",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 34:", data);
}

main().catch(console.error);
