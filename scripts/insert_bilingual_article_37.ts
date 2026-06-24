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
  console.log("Inserting bilingual article 37 (NYT Electric Cars)...");

  const content = [
    {
      en: "The article argues that despite fluctuations in gasoline prices, electric vehicles (EVs) remain significantly cheaper to operate than comparable gasoline-powered cars, reinforcing the long-term economic case for electrification even during periods of energy market [volatility]{sự biến động}. It notes that recent spikes in fuel prices—driven in part by geopolitical tensions and supply disruptions—have widened the cost gap between gasoline and electricity, making EVs even more financially attractive for many drivers.",
      vi: "Bài viết lập luận rằng mặc dù có những biến động về giá xăng, xe điện (EV) vẫn rẻ hơn đáng kể khi vận hành so với những chiếc xe chạy bằng xăng tương đương, củng cố luận điểm kinh tế dài hạn cho việc điện khí hóa ngay cả trong những thời kỳ thị trường năng lượng có sự biến động. Bài báo lưu ý rằng việc giá nhiên liệu tăng vọt gần đây — được thúc đẩy một phần bởi căng thẳng địa chính trị và gián đoạn nguồn cung — đã mở rộng khoảng cách chi phí giữa xăng và điện, khiến xe điện thậm chí còn trở nên hấp dẫn hơn về mặt tài chính đối với nhiều tài xế."
    },
    {
      en: "A key point in the analysis is the comparison of “fueling costs” rather than sticker prices. While EVs can still be more expensive to purchase [upfront]{trả trước/đầu tiên/trước mắt} in many cases, their operating costs are substantially lower due to cheaper electricity and reduced maintenance requirements. Even when gasoline prices fluctuate downward, the cost per mile for internal combustion engine vehicles typically remains higher than for EVs, especially for drivers who can charge at home rather than relying on public fast-charging networks.",
      vi: "Một điểm cốt lõi trong phân tích là sự so sánh về \"chi phí nhiên liệu\" thay vì giá bán niêm yết. Mặc dù xe điện trong nhiều trường hợp vẫn có thể đắt hơn khi mua trả trước, chi phí vận hành của chúng thấp hơn đáng kể nhờ nguồn điện rẻ hơn và yêu cầu bảo dưỡng giảm bớt. Ngay cả khi giá xăng biến động theo chiều hướng giảm, chi phí trên mỗi dặm của các phương tiện sử dụng động cơ đốt trong thường vẫn cao hơn so với xe điện, đặc biệt đối với các tài xế có thể sạc tại nhà thay vì dựa vào các mạng lưới sạc nhanh công cộng."
    },
    {
      en: "The article also emphasizes that consumer behavior is increasingly sensitive to fuel price shocks. Periods of high gas prices tend to accelerate EV adoption, as drivers reassess long-term transportation costs and seek stability against future price swings. However, the piece notes that this shift is not purely cyclical; it is reinforced by structural improvements in EV technology, including better battery efficiency, longer range, and expanding charging [infrastructure]{cơ sở hạ tầng}.",
      vi: "Bài báo cũng nhấn mạnh rằng hành vi của người tiêu dùng ngày càng nhạy cảm với các cú sốc giá nhiên liệu. Các giai đoạn giá xăng cao có xu hướng thúc đẩy việc chuyển sang xe điện, khi các tài xế đánh giá lại chi phí vận tải dài hạn và tìm kiếm sự ổn định trước những dao động giá cả trong tương lai. Tuy nhiên, bài viết lưu ý rằng sự chuyển dịch này không hoàn toàn mang tính chu kỳ; nó được củng cố bởi những cải tiến mang tính cấu trúc trong công nghệ xe điện, bao gồm hiệu suất pin tốt hơn, phạm vi hoạt động dài hơn và cơ sở hạ tầng sạc được mở rộng."
    },
    {
      en: "At the same time, the article cautions against viewing EVs as universally cheaper in every scenario. The total cost of ownership depends on factors such as purchase [incentives]{ưu đãi/sự khuyến khích}, electricity rates, driving habits, and local charging access. In some regions, particularly where electricity is expensive or charging infrastructure is limited, the financial advantage may narrow. Additionally, upfront vehicle prices and financing conditions still influence adoption decisions.",
      vi: "Đồng thời, bài viết cũng cảnh báo việc coi xe điện là rẻ hơn trong mọi tình huống. Tổng chi phí sở hữu phụ thuộc vào các yếu tố như các ưu đãi mua xe, biểu giá điện, thói quen lái xe và khả năng tiếp cận trạm sạc tại địa phương. Ở một số vùng, đặc biệt là nơi có giá điện đắt hoặc cơ sở hạ tầng sạc bị hạn chế, lợi thế tài chính có thể bị thu hẹp. Thêm vào đó, giá xe ban đầu và các điều kiện tài trợ vẫn ảnh hưởng đến các quyết định lựa chọn xe điện."
    },
    {
      en: "Ultimately, the piece concludes that while gas price spikes can temporarily boost interest in EVs, the broader trend is driven by persistent structural cost advantages. Over time, these underlying economics—not short-term fuel volatility—are likely to determine the pace of transition away from gasoline-powered vehicles.",
      vi: "Cuối cùng, bài viết kết luận rằng mặc dù giá xăng tăng vọt có thể tạm thời làm tăng mối quan tâm đến xe điện, xu hướng rộng lớn hơn được thúc đẩy bởi lợi thế chi phí cấu trúc bền bỉ. Theo thời gian, những yếu tố kinh tế nền tảng này — chứ không phải sự biến động nhiên liệu ngắn hạn — có khả năng sẽ quyết định tốc độ chuyển dịch khỏi các phương tiện chạy bằng xăng."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "the-new-york-times",
      source_url: "https://www.nytimes.com/2026/06/16/business/electric-cars-vs-gas-fuel-costs-nyt-upshot",
      source_label: "The New York Times",
      title: "Electric cars vs. gas: what rising fuel costs really change",
      title_vi: "Xe điện vs. Xe xăng: Chi phí nhiên liệu gia tăng thực sự thay đổi điều gì",
      category: "Business",
      category_vi: "Kinh doanh",
      excerpt: "Electric vehicles remain significantly cheaper to operate than gasoline cars, despite gas price fluctuations.",
      excerpt_vi: "Xe điện vẫn rẻ hơn đáng kể để vận hành so với xe xăng, bất chấp sự biến động giá xăng.",
      author: "Jeff Sommer",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 37:", data);
}

main().catch(console.error);
