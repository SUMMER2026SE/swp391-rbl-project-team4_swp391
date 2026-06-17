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
  console.log("Inserting bilingual article 19 (China North Korea)...");

  const content = [
    {
      en: "The podcast examines a significant shift in China’s approach toward North Korea’s nuclear weapons program, focusing on Beijing’s increasingly noticeable silence regarding denuclearization. For many years, China publicly supported efforts to prevent North Korea from becoming a permanent nuclear power and regularly called for negotiations aimed at [dismantling]{giải tán/tháo dỡ/triệt phá} Pyongyang’s nuclear arsenal. However, recent diplomatic developments suggest that Chinese leaders are no longer emphasizing that objective as strongly as they once did. During President Xi Jinping’s first visit to North Korea in nearly seven years, official statements highlighted friendship, economic cooperation, and regional stability while making little or no reference to denuclearization, a striking contrast with previous summits. Analysts view this [omission]{sự bỏ sót/sự bỏ qua} as evidence that Beijing may have accepted the reality that North Korea is unlikely to abandon its nuclear weapons in the foreseeable future.",
      vi: "Buổi phát sóng (podcast) xem xét một sự thay đổi lớn trong cách tiếp cận của Trung Quốc đối với chương trình vũ khí hạt nhân của Triều Tiên, tập trung vào sự im lặng ngày càng đáng chú ý của Bắc Kinh liên quan đến việc phi hạt nhân hóa. Trong nhiều năm, Trung Quốc đã công khai hỗ trợ các nỗ lực ngăn chặn Triều Tiên trở thành một cường quốc hạt nhân lâu dài và thường xuyên kêu gọi các cuộc đàm phán nhằm tháo dỡ kho vũ khí hạt nhân của Bình Nhưỡng. Tuy nhiên, những diễn biến ngoại giao gần đây cho thấy các nhà lãnh đạo Trung Quốc không còn nhấn mạnh mục tiêu đó mạnh mẽ như trước nữa. Trong chuyến viếng thăm Triều Tiên đầu tiên của Chủ tịch Tập Cận Bình sau gần 7 năm, các tuyên bố chính thức đã nhấn mạnh đến tình hữu nghị, hợp tác kinh tế và ổn định khu vực trong khi hầu như không đề cập đến việc phi hạt nhân hóa, một sự tương phản nổi bật với các hội nghị thượng đỉnh trước đây. Các nhà phân tích xem sự bỏ qua này là bằng chứng cho thấy Bắc Kinh có thể đã chấp nhận thực tế rằng Triều Tiên khó có thể từ bỏ vũ khí hạt nhân trong tương lai gần."
    },
    {
      en: "The discussion argues that China’s changing position is closely tied to broader geopolitical developments. As competition between China and the United States intensifies, Beijing increasingly views North Korea through the lens of strategic rivalry rather than [non-proliferation]{phi phổ biến (vũ khí)} policy. A nuclear-armed North Korea can complicate American military planning in East Asia and force Washington to devote resources to the Korean Peninsula. At the same time, China remains concerned about instability along its border and fears that excessive pressure on Pyongyang could trigger political collapse, refugee flows, or a unified Korea aligned with the United States. These considerations have made regional stability a higher priority than pursuing denuclearization goals that appear increasingly unrealistic.",
      vi: "Cuộc thảo luận lập luận rằng lập trường thay đổi của Trung Quốc gắn liền với các diễn biến địa chính trị rộng lớn hơn. Khi sự cạnh tranh giữa Trung Quốc và Hoa Kỳ gia tăng, Bắc Kinh ngày càng nhìn nhận Triều Tiên qua lăng kính đối đầu chiến lược hơn là chính sách phi phổ biến vũ khí hạt nhân. Một Triều Tiên sở hữu vũ khí hạt nhân có thể làm phức tạp thêm các kế hoạch quân sự của Mỹ ở Đông Á và buộc Washington phải dành nguồn lực cho Bán đảo Triều Tiên. Đồng thời, Trung Quốc vẫn lo ngại về sự mất ổn định dọc theo biên giới của mình và lo sợ rằng áp lực quá mức lên Bình Nhưỡng có thể gây ra sụp đổ chính trị, các dòng người tị nạn hoặc một bán đảo Triều Tiên thống nhất đứng về phía Hoa Kỳ. Những cân nhắc này đã khiến sự ổn định khu vực trở thành ưu tiên cao hơn việc theo đuổi các mục tiêu phi hạt nhân hóa đang có vẻ ngày càng phi thực tế."
    },
    {
      en: "The podcast also explores how North Korea has become more confident in recent years due to its expanding relationships with both Russia and China. Kim Jong Un has repeatedly declared his country’s nuclear status to be permanent and irreversible, while continued weapons development has strengthened Pyongyang’s bargaining position. China’s reduced willingness to publicly challenge North Korea on nuclear issues has been interpreted by some observers as a diplomatic victory for Kim. Although Beijing officially maintains its opposition to nuclear proliferation, its actions suggest a more [pragmatic]{thực dụng/thực tế} strategy focused on managing North Korea rather than fundamentally changing its behavior.",
      vi: "Buổi phát sóng cũng khám phá việc Triều Tiên đã trở nên tự tin hơn trong những năm gần đây nhờ vào việc mở rộng các mối quan hệ với cả Nga và Trung Quốc. Kim Jong Un đã nhiều lần tuyên bố vị thế hạt nhân của đất nước ông là vĩnh viễn và không thể đảo ngược, trong khi sự phát triển vũ khí liên tục đã củng cố vị thế thương lượng của Bình Nhưỡng. Sự giảm sút thiện chí của Trung Quốc trong việc thách thức công khai Triều Tiên về các vấn đề hạt nhân đã được một số nhà quan sát giải thích là một chiến thắng ngoại giao cho ông Kim. Mặc dù Bắc Kinh duy trì lập trường phản đối phổ biến vũ khí hạt nhân một cách chính thức, các hành động của họ gợi mở một chiến lược thực tế hơn tập trung vào việc kiểm soát Triều Tiên thay vì thay đổi căn bản hành vi của nước này."
    },
    {
      en: "Ultimately, the podcast concludes that China’s silence does not necessarily mean it supports North Korea’s nuclear ambitions. Rather, it reflects a recognition that the strategic environment has changed dramatically. Beijing appears to believe that preserving influence over Pyongyang and maintaining regional stability are currently more achievable objectives than pursuing complete denuclearization. This shift highlights the growing complexity of East Asian geopolitics, where great-power competition, security concerns, and diplomatic realities increasingly shape policy decisions. As a result, the long-standing international goal of a nuclear-free Korean Peninsula may be receiving less attention than at any point in recent decades, even as North Korea continues to expand its capabilities.",
      vi: "Cuối cùng, buổi phát sóng kết luận rằng sự im lặng của Trung Quốc không nhất thiết có nghĩa là nước này ủng hộ tham vọng hạt nhân của Triều Tiên. Thay vào đó, nó phản ánh sự thừa nhận rằng môi trường chiến lược đã thay đổi sâu sắc. Bắc Kinh dường như tin rằng việc bảo toàn tầm ảnh hưởng đối với Bình Nhưỡng và duy trì sự ổn định khu vực hiện là các mục tiêu khả thi hơn so với việc theo đuổi phi hạt nhân hóa hoàn toàn. Sự chuyển dịch này làm nổi bật sự phức tạp ngày càng tăng của địa chính trị Đông Á, nơi cạnh tranh giữa các cường quốc, các mối lo ngại về an ninh và thực tế ngoại giao đang ngày càng định hình các quyết định chính sách. Hệ quả là, mục tiêu quốc tế lâu nay về một Bán đảo Triều Tiên không có hạt nhân có thể đang nhận được ít sự chú ý hơn bất kỳ thời điểm nào trong những thập kỷ gần đây, ngay cả khi Triều Tiên tiếp tục mở rộng các năng lực của mình."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/podcasts/2026/06/16/why-has-china-gone-quiet-on-north-koreas-nukes",
      source_label: "Substack",
      title: "Why Has China Gone Quiet on North Korea’s Nukes?",
      title_vi: "Tại sao Trung Quốc lại im lặng trước vũ khí hạt nhân của Triều Tiên?",
      category: "Podcasts",
      category_vi: "Podcasts",
      excerpt: "The podcast examines a significant shift in China’s approach toward North Korea’s nuclear weapons program.",
      excerpt_vi: "Buổi phát sóng xem xét một sự thay đổi lớn trong cách tiếp cận của Trung Quốc đối với chương trình vũ khí hạt nhân của Triều Tiên.",
      author: "The Intelligence Podcast Team",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1530982009880-fa0197262d18?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 19:", data);
}

main().catch(console.error);
