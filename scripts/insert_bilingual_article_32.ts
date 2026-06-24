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
  console.log("Inserting bilingual article 32 (Reuters NEXT)...");

  const content = [
    {
      en: "The article reports on the Reuters NEXT Europe conference, where leading business figures, policymakers, and public officials gathered to discuss the most pressing economic, political, and geopolitical challenges facing Europe and the global economy. The event focused heavily on how companies and governments are navigating an increasingly unstable international environment shaped by trade tensions, energy shocks, technological disruption, and ongoing conflicts such as the war in Ukraine.",
      vi: "Bài viết đưa tin về hội nghị Reuters NEXT Europe, nơi các nhân vật kinh doanh hàng đầu, các nhà hoạch định chính sách và các quan chức công quyền tụ họp để thảo luận về các thách thức kinh tế, chính trị và địa chính trị cấp bách nhất mà châu Âu và nền kinh tế toàn cầu đang phải đối mặt. Sự kiện tập trung mạnh vào cách các công ty và chính phủ đang chèo lái trong một môi trường quốc tế ngày càng bất ổn được định hình bởi những căng thẳng thương mại, các cú sốc năng lượng, sự gián đoạn công nghệ và các xung đột đang diễn ra như cuộc chiến ở Ukraine."
    },
    {
      en: "A central theme of the discussions was geopolitical uncertainty, particularly the ripple effects of the U.S.–Iran conflict and broader instability in global energy markets. Business leaders highlighted how these tensions are contributing to higher costs, disrupted supply chains, and delayed investment decisions. Executives from major multinational firms warned that even if diplomatic progress is achieved, the economic consequences of recent crises—especially inflationary pressures and logistical [bottlenecks]{nút thắt cổ chai}—are likely to [persist]{kéo dài/dai dẳng} for some time.",
      vi: "Chủ đề trung tâm của các cuộc thảo luận là sự bất định địa chính trị, đặc biệt là các tác động lan tỏa từ cuộc xung đột Mỹ-Iran và sự mất ổn định rộng lớn hơn trong thị trường năng lượng toàn cầu. Các nhà lãnh đạo doanh nghiệp nhấn mạnh cách những căng thẳng này đang góp phần làm tăng chi phí, gián đoạn chuỗi cung ứng và làm chậm trễ các quyết định đầu tư. Các giám đốc điều hành từ các công ty đa quốc gia lớn cảnh báo rằng ngay cả khi đạt được tiến trình ngoại giao, hậu quả kinh tế của các cuộc khủng hoảng gần đây — đặc biệt là áp lực lạm phát và các nút thắt cổ chai hậu cần — có khả năng sẽ kéo dài trong một thời gian."
    },
    {
      en: "Another key topic was Europe’s long-term competitiveness. Policymakers and corporate leaders emphasized the need for structural reforms to strengthen the EU single market, improve regulatory efficiency, and boost innovation. Concerns were raised that Europe continues to lag behind the United States and China in productivity growth and technological leadership, particularly in high-value sectors such as artificial intelligence and advanced manufacturing. Speakers stressed that without deeper integration and faster decision-making, Europe risks losing further ground in global economic competition.",
      vi: "Một chủ đề quan trọng khác là khả năng cạnh tranh lâu dài của châu Âu. Các nhà hoạch định chính sách và các nhà lãnh đạo doanh nghiệp nhấn mạnh sự cần thiết của các cải cách cơ cấu nhằm củng cố thị trường chung EU, cải thiện hiệu quả quản lý và thúc đẩy đổi mới. Các mối lo ngại đã được nâng lên rằng châu Âu tiếp tục tụt hậu so với Hoa Kỳ và Trung Quốc về tăng trưởng năng suất và vị thế dẫn đầu công nghệ, đặc biệt là trong các lĩnh vực có giá trị cao như trí tuệ nhân tạo và sản xuất tiên tiến. Các diễn giả nhấn mạnh rằng nếu không có sự hội nhập sâu sắc hơn và ra quyết định nhanh chóng hơn, châu Âu có nguy cơ mất thêm vị thế trong cạnh tranh kinh tế toàn cầu."
    },
    {
      en: "The conference also addressed energy security and industrial [resilience]{sự kiên cường/khả năng phục hồi}. Companies noted that volatile energy prices remain a major constraint on growth and investment, particularly for energy-intensive industries such as chemicals, automotive production, and heavy manufacturing. There was broad agreement that Europe needs more coordinated energy policy and infrastructure investment to reduce dependence on external suppliers and stabilize costs.",
      vi: "Hội nghị cũng giải quyết vấn đề an ninh năng lượng và khả năng phục hồi công nghiệp. Các công ty lưu ý rằng giá năng lượng đầy biến động vẫn là rào cản lớn đối với tăng trưởng và đầu tư, đặc biệt là đối với các ngành tiêu thụ nhiều năng lượng như hóa chất, sản xuất ô tô và sản xuất hạng nặng. Đã có sự đồng thuận rộng rãi rằng châu Âu cần có chính sách năng lượng và đầu tư cơ sở hạ tầng phối hợp chặt chẽ hơn để giảm sự phụ thuộc vào các nhà cung cấp bên ngoài và ổn định chi phí."
    },
    {
      en: "Finally, the event highlighted the growing role of private capital and cross-border investment in shaping Europe’s economic future. Leaders called for reforms to mobilize savings more efficiently within the EU and to encourage more venture capital and innovation funding. While there was consensus on the need for action, the article notes that political [fragmentation]{sự phân mảnh/sự vỡ vụn} within Europe continues to slow implementation, raising doubts about how quickly meaningful reforms can be delivered.",
      vi: "Cuối cùng, sự kiện làm nổi bật vai trò ngày càng tăng của vốn tư nhân và đầu tư xuyên biên giới trong việc định hình tương lai kinh tế của châu Âu. Các nhà lãnh đạo kêu gọi cải cách để huy động các khoản tiết kiệm hiệu quả hơn trong EU và khuyến khích nhiều nguồn quỹ đầu tư mạo hiểm và đổi mới hơn. Mặc dù có sự đồng thuận về sự cần thiết phải hành động, bài viết lưu ý rằng sự phân mảnh chính trị ở châu Âu tiếp tục làm chậm tiến trình thực hiện, dấy lên nghi ngờ về việc các cải cách có ý nghĩa có thể được đưa ra nhanh chóng như thế nào."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/business/reuters-next-europe-business-leaders-examine-issues-2026-06-03",
      source_label: "Reuters",
      title: "Reuters NEXT Europe: business leaders and policymakers examine biggest issues",
      title_vi: "Reuters NEXT Châu Âu: Các nhà lãnh đạo doanh nghiệp và hoạch định chính sách xem xét các vấn đề lớn nhất",
      category: "Business",
      category_vi: "Kinh doanh",
      excerpt: "Reuters NEXT Europe conference focused on navigating an unstable international environment.",
      excerpt_vi: "Hội nghị Reuters NEXT Châu Âu tập trung vào việc định hướng trong một môi trường quốc tế đầy bất ổn.",
      author: "Reuters Staff",
      read_time: "5 mins",
      image_url: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 32:", data);
}

main().catch(console.error);
