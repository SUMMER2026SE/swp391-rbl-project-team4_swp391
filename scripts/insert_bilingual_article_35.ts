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
  console.log("Inserting bilingual article 35 (NYT Obama Trump)...");

  const content = [
    {
      en: "The article reports that former U.S. President Barack Obama has privately and publicly cautioned that Donald Trump’s newly announced Iran framework risks repeating many of the same structural weaknesses that critics once identified in the 2015 nuclear agreement negotiated during Obama’s administration. According to the report, Obama’s [intervention]{sự can thiệp/sự xen vào} comes amid renewed debate in Washington over whether Trump’s approach represents a stronger, more [coercive]{ép buộc/cưỡng chế} version of the earlier deal or a return to similar trade-offs under a different political framing.",
      vi: "Bài báo đưa tin cựu Tổng thống Mỹ Barack Obama đã kín đáo và công khai cảnh báo rằng khuôn khổ Iran mới công bố của Donald Trump có nguy cơ lặp lại nhiều điểm yếu cấu trúc tương tự như những điểm yếu mà giới phê bình từng chỉ ra trong thỏa thuận hạt nhân năm 2015 được đàm phán dưới thời chính quyền Obama. Theo báo cáo, sự can thiệp của Obama diễn ra trong bối cảnh các cuộc tranh luận mới đang nổ ra tại Washington về việc liệu cách tiếp cận của Trump đại diện cho một phiên bản mạnh mẽ, mang tính cưỡng chế hơn của thỏa thuận trước đó hay là một sự quay trở lại các thỏa hiệp tương tự dưới một cấu trúc chính trị khác."
    },
    {
      en: "Obama is described as arguing that while the 2015 Joint Comprehensive Plan of Action (JCPOA) was imperfect, it established a detailed verification system, strict limits on enrichment, and [multilateral]{đa phương} enforcement mechanisms involving major powers such as the United Kingdom, France, Germany, Russia, and China. He is said to have emphasized that diplomacy, even with adversaries like Iran, requires sustained international coordination and robust monitoring to be effective over time, warning that shortcuts or overly simplified frameworks risk collapsing under geopolitical pressure.",
      vi: "Obama được mô tả là đã lập luận rằng mặc dù Kế hoạch Hành động Chung Toàn diện (JCPOA) năm 2015 là chưa hoàn hảo, nó đã thiết lập một hệ thống xác minh chi tiết, các giới hạn nghiêm ngặt về làm giàu hạt nhân và các cơ chế thực thi đa phương liên quan đến các cường quốc lớn như Vương quốc Anh, Pháp, Đức, Nga và Trung Quốc. Ông được cho là đã nhấn mạnh rằng ngoại giao, ngay cả với các đối thủ như Iran, đòi hỏi sự phối hợp quốc tế bền vững và hoạt động giám sát chặt chẽ để có hiệu lực lâu dài, cảnh báo rằng các lối tắt hoặc các khuôn khổ đơn giản hóa quá mức có nguy cơ sụp đổ dưới áp lực địa chính trị."
    },
    {
      en: "The article also notes that Obama drew comparisons between the JCPOA and Trump’s current interim agreement, particularly regarding the sequencing of sanctions relief and Iranian compliance. According to Obama’s critique, early financial incentives or economic relief—if not tightly conditioned—could reduce [leverage]{sức bật/lực bẩy/sức ảnh hưởng} over Iran during the most sensitive phases of nuclear negotiations. He reportedly expressed concern that the current framework may rely too heavily on future negotiation stages to resolve core issues rather than locking in [enforceable]{khả thi/có thể thực thi} commitments from the outset.",
      vi: "Bài viết cũng lưu ý rằng Obama đã đưa ra những so sánh giữa JCPOA và thỏa thuận tạm thời hiện tại của Trump, đặc biệt liên quan đến trình tự nới lỏng các lệnh trừng phạt và sự tuân thủ của Iran. Theo bài phê bình của Obama, các động lực tài chính hoặc cứu trợ kinh tế sớm — nếu không đi kèm với các điều kiện chặt chẽ — có thể làm giảm sức ảnh hưởng đối với Iran trong các giai đoạn nhạy cảm nhất của đàm phán hạt nhân. Ông được báo cáo là đã bày tỏ lo ngại rằng khuôn khổ hiện tại có thể phụ thuộc quá nhiều vào các giai đoạn đàm phán trong tương lai để giải quyết các vấn đề cốt lõi thay vì khóa chặt các cam kết có thể thực thi ngay từ đầu."
    },
    {
      en: "At the same time, the piece highlights sharp political divisions in Washington. Supporters of Trump’s approach argue that the new deal reflects lessons learned from the Obama-era agreement, particularly the belief that Iran benefited disproportionately from sanctions relief while continuing destabilizing regional activities. Critics counter that abandoning the structure of the JCPOA without a fully equivalent replacement could weaken inspection regimes and increase long-term uncertainty about Iran’s nuclear capabilities.",
      vi: "Đồng thời, bài viết cũng làm nổi bật những phân cực chính trị sâu sắc ở Washington. Những người ủng hộ cách tiếp cận của Trump lập luận rằng thỏa thuận mới phản ánh các bài học rút ra từ thỏa thuận thời Obama, đặc biệt là niềm tin rằng Iran đã được hưởng lợi không tương xứng từ việc nới lỏng các lệnh trừng phạt trong khi vẫn tiếp tục các hoạt động gây mất ổn định khu vực. Những người chỉ trích phản bác rằng việc từ bỏ cấu trúc của JCPOA mà không có một sự thay thế tương đương hoàn toàn có thể làm suy yếu các cơ chế thanh tra và làm gia tăng sự bất định lâu dài về năng lực hạt nhân của Iran."
    },
    {
      en: "Ultimately, the article frames Obama’s comments as part of a broader reassessment of U.S.–Iran diplomacy, where both agreements—the 2015 JCPOA and the 2026 Trump framework—are being evaluated not only on their immediate outcomes but also on their durability and ability to prevent nuclear escalation over time.",
      vi: "Cuối cùng, bài viết định hình những bình luận của Obama như một phần của cuộc đánh giá lại rộng lớn hơn về ngoại giao Mỹ-Iran, nơi cả hai thỏa thuận — JCPOA 2015 và khuôn khổ Trump 2026 — đang được đánh giá không chỉ dựa trên các kết quả tức thời mà còn về độ bền vững và khả năng ngăn chặn leo thang hạt nhân theo thời gian."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "the-new-york-times",
      source_url: "https://www.nytimes.com/2026/06/16/us/politics/obama-warns-trumps-iran-deal-risks-repeating-past-mistakes-nyt-reports",
      source_label: "The New York Times",
      title: "Obama warns Trump’s Iran deal risks repeating past mistakes, NYT reports",
      title_vi: "Obama cảnh báo thỏa thuận Iran của Trump có nguy cơ lặp lại sai lầm trong quá khứ, NYT đưa tin",
      category: "Politics",
      category_vi: "Chính trị",
      excerpt: "Former President Barack Obama warned that Donald Trump's new Iran deal risks repeating structural weaknesses of the JCPOA.",
      excerpt_vi: "Cựu Tổng thống Barack Obama cảnh báo rằng thỏa thuận Iran mới của Trump có nguy cơ lặp lại các điểm yếu cấu trúc của JCPOA.",
      author: "Peter Baker",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 35:", data);
}

main().catch(console.error);
