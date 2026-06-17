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
  console.log("Inserting bilingual article 21 (Oil Prices)...");

  const content = [
    {
      en: "The article argues that even if diplomatic progress between the United States and Iran reduces tensions in the Middle East, global oil prices are likely to remain elevated for months due to [lingering]{kéo dài/dai dẳng} supply disruptions and structural [bottlenecks]{nút thắt cổ chai} in the energy market. While markets initially reacted positively to signs of a potential deal—particularly expectations that shipping through the Strait of Hormuz could gradually resume—analysts warn that the physical recovery of oil production and transport capacity will take much longer than financial markets assume. Many Gulf producers are expected to restore output only gradually, with production likely recovering to around 30–50% of pre-crisis levels in the near term, before slowly climbing toward 80–90% over several months.",
      vi: "Bài viết lập luận rằng ngay cả khi tiến trình ngoại giao giữa Hoa Kỳ và Iran làm giảm bớt căng thẳng ở Trung Đông, giá dầu toàn cầu vẫn có khả năng duy trì ở mức cao trong nhiều tháng do tình trạng gián đoạn nguồn cung kéo dài và các nút thắt cổ chai mang tính cơ cấu trong thị trường năng lượng. Trong khi thị trường ban đầu phản ứng tích cực với các dấu hiệu của một thỏa thuận tiềm năng — đặc biệt là kỳ vọng rằng hoạt động vận tải qua eo biển Hormuz có thể dần khôi phục — các nhà phân tích cảnh báo rằng việc phục hồi trên thực tế của sản xuất dầu và công suất vận tải sẽ mất nhiều thời gian hơn so với các giả định của thị trường tài chính. Nhiều nhà sản xuất vùng Vịnh dự kiến sẽ khôi phục sản lượng một cách từ từ, với sản lượng có khả năng phục hồi về khoảng 30–50% mức trước khủng hoảng trong thời gian ngắn, trước khi leo dần lên 80–90% trong vòng vài tháng."
    },
    {
      en: "A key factor keeping prices high is the damage to infrastructure and logistics networks caused during the conflict. Even if formal hostilities ease, oil exporters face delays in restarting production facilities, clearing storage backlogs, and repairing damaged terminals. Tanker availability, insurance costs, and security risks in key shipping routes also continue to [constrain]{ràng buộc/hạn chế/kìm hãm} supply flows. These frictions mean that global oil markets cannot return quickly to equilibrium, even under a peace scenario.",
      vi: "Một yếu tố then chốt giữ cho giá dầu ở mức cao là thiệt hại đối với cơ sở hạ tầng và mạng lưới hậu cần (logistics) gây ra trong cuộc xung đột. Ngay cả khi các hành động thù địch chính thức lắng dịu, các nhà xuất khẩu dầu vẫn phải đối mặt với sự chậm trễ trong việc tái khởi động các cơ sở sản xuất, giải tỏa lượng hàng tồn kho tồn đọng và sửa chữa các cảng xuất khẩu bị hư hại. Tính sẵn có của tàu chở dầu, chi phí bảo hiểm và rủi ro an ninh trên các tuyến đường vận tải biển quan trọng cũng tiếp tục kìm hãm dòng cung ứng. Những rào cản này đồng nghĩa với việc thị trường dầu mỏ toàn cầu không thể nhanh chóng trở lại trạng thái cân bằng, ngay cả trong một kịch bản hòa bình."
    },
    {
      en: "The article also highlights that demand conditions are adding further upward pressure on prices. Seasonal consumption increases, particularly during summer travel periods, are coinciding with attempts by major economies to rebuild strategic petroleum reserves. Countries such as China are expected to continue stockpiling oil, which tightens available supply on global markets. As a result, even modest disruptions in output can have [outsized]{quá khổ/quá lớn/vượt trội} effects on pricing.",
      vi: "Bài báo cũng nhấn mạnh rằng các điều kiện nhu cầu đang tạo thêm áp lực tăng giá. Mức tăng tiêu thụ theo mùa, đặc biệt là trong các giai đoạn du lịch mùa hè, đang trùng hợp với các nỗ lực xây dựng lại kho dự trữ dầu mỏ chiến lược của các nền kinh tế lớn. Các quốc gia như Trung Quốc dự kiến sẽ tiếp tục tích trữ dầu, điều này làm thắt chặt nguồn cung sẵn có trên thị trường toàn cầu. Kết quả là, ngay cả những gián đoạn sản lượng khiêm tốn cũng có thể có những tác động quá lớn đến giá cả."
    },
    {
      en: "Financial markets, according to the piece, may be underestimating how slowly energy systems recover after geopolitical shocks. While oil prices have retreated from wartime peaks, they remain significantly above pre-conflict levels, and analysts expect them to stay elevated well into the year. The article emphasizes that commodity markets often react faster than real-world supply chains can adjust, leading to a gap between optimism about peace and the slower reality of physical recovery.",
      vi: "Theo bài viết, các thị trường tài chính có thể đang đánh giá thấp mức độ chậm chạp trong việc phục hồi của các hệ thống năng lượng sau các cú sốc địa chính trị. Trong khi giá dầu đã rút lui khỏi các mức đỉnh thời chiến, chúng vẫn cao hơn đáng kể so với mức trước xung đột, và các nhà phân tích dự báo chúng sẽ duy trì ở mức cao trong suốt cả năm. Bài viết nhấn mạnh rằng các thị trường hàng hóa thường phản ứng nhanh hơn khả năng điều chỉnh của chuỗi cung ứng trong thế giới thực, dẫn đến một khoảng cách giữa sự lạc quan về hòa bình và thực tế chậm chạp của sự phục hồi về mặt vật lý."
    },
    {
      en: "Ultimately, the piece concludes that the oil market is entering a prolonged adjustment phase rather than a rapid normalization. Even in the best-case scenario of sustained diplomatic progress, structural constraints, damaged infrastructure, and persistent demand pressures mean that “high for longer” energy prices are likely to remain a defining feature of the global economy over the coming months.",
      vi: "Cuối cùng, bài viết kết luận rằng thị trường dầu mỏ đang bước vào giai đoạn điều chỉnh kéo dài hơn là phục hồi bình thường nhanh chóng. Ngay cả trong kịch bản tốt nhất của tiến trình ngoại giao bền vững, các rào cản mang tính cơ cấu, cơ sở hạ tầng bị hư hại và áp lực nhu cầu dai dẳng đồng nghĩa với việc giá năng lượng \"ở mức cao lâu hơn\" có thể sẽ tiếp tục là một đặc trưng rõ nét của nền kinh tế toàn cầu trong những tháng tới."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/finance-and-economics/2026/06/16/deal-or-no-deal-oil-prices-will-stay-high-for-months",
      source_label: "Substack",
      title: "Deal or No Deal, Oil Prices Will Stay High for Months",
      title_vi: "Đạt thỏa thuận hay không, giá dầu vẫn sẽ ở mức cao trong nhiều tháng",
      category: "Finance & Economics",
      category_vi: "Tài chính & Kinh tế",
      excerpt: "Even if diplomatic progress reduces Middle East tensions, global oil prices are likely to remain elevated.",
      excerpt_vi: "Ngay cả khi tiến trình ngoại giao làm giảm bớt căng thẳng ở Trung Đông, giá dầu toàn cầu vẫn có khả năng duy trì ở mức cao.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 21:", data);
}

main().catch(console.error);
