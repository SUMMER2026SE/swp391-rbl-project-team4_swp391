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
  console.log("Inserting bilingual article 26 (FIFA Tickets)...");

  const content = [
    {
      en: "The article argues that FIFA’s strategy of sharply increasing World Cup ticket prices may ultimately undermine the atmosphere, accessibility, and long-term appeal of the tournament, even if it boosts short-term revenues. It notes that the 2026 World Cup has become one of the most expensive major sporting events ever, with ticket prices rising far beyond historical levels. While FIFA’s goal is to maximize income from a globally popular product with relatively [inelastic]{không co giãn/ít biến động} demand, the article suggests that football depends heavily on mass participation and crowd atmosphere, which high prices risk [eroding]{xói mòn/bào mòn}.",
      vi: "Bài viết lập luận rằng chiến lược tăng mạnh giá vé World Cup của FIFA cuối cùng có thể làm suy yếu bầu không khí, khả năng tiếp cận và sức hấp dẫn lâu dài của giải đấu, ngay cả khi nó thúc đẩy doanh thu ngắn hạn. Bài báo lưu ý rằng World Cup 2026 đã trở thành một trong những sự kiện thể thao lớn đắt đỏ nhất từ trước đến nay, với giá vé tăng vượt xa các mức lịch sử. Mặc dù mục tiêu của FIFA là tối đa hóa thu nhập từ một sản phẩm phổ biến toàn cầu có nhu cầu tương đối ít co giãn, bài viết gợi ý rằng bóng đá phụ thuộc nhiều vào sự tham gia của đại chúng và bầu không khí của đám đông, những yếu tố mà giá vé cao có nguy cơ bào mòn."
    },
    {
      en: "A key concern is that football stadiums are not like typical luxury entertainment venues: their value comes from full, energetic crowds rather than [exclusivity]{tính độc quyền/tính riêng biệt}. If tickets become too expensive for average fans, stadiums may include more corporate seats and wealthier tourists, potentially reducing the intensity and [authenticity]{tính xác thực/tính nguyên bản/tính chân thực} of match-day atmosphere. The article warns that empty seats or less engaged crowds could diminish the viewing experience both in-stadium and on television, which could in turn reduce the tournament’s global appeal.",
      vi: "Mối lo ngại chính là các sân vận động bóng đá không giống như các địa điểm giải trí sang trọng thông thường: giá trị của chúng đến từ những đám đông đầy ắp, tràn đầy năng lượng chứ không phải từ tính độc quyền. Nếu vé trở nên quá đắt đối với những người hâm mộ trung bình, các sân vận động có thể xuất hiện nhiều ghế dành cho khách hàng doanh nghiệp và khách du lịch giàu có hơn, có khả năng làm giảm cường độ và tính chân thực của bầu không khí ngày thi đấu. Bài viết cảnh báo rằng những hàng ghế trống hoặc đám đông ít cuồng nhiệt hơn có thể làm giảm trải nghiệm xem cả trên sân vận động lẫn trên truyền hình, từ đó có thể làm giảm sức hút toàn cầu của giải đấu."
    },
    {
      en: "The piece also highlights the risk that FIFA is misjudging demand elasticity. While high-profile matches—such as those involving host nations or top-ranked teams—may still sell out at high prices, less attractive [fixtures]{trận đấu/lịch thi đấu cố định} could struggle to fill stadiums. This uneven demand could lead to visible empty sections, which would undermine the impression of success despite strong overall ticket revenue figures. Early signs from ticket sales and resale markets already suggest that some matches are harder to sell at inflated prices.",
      vi: "Bài báo cũng nhấn mạnh rủi ro rằng FIFA đang đánh giá sai mức độ co giãn của nhu cầu. Trong khi các trận đấu nổi bật — chẳng hạn như các trận có sự tham gia của quốc gia chủ nhà hoặc các đội xếp hạng hàng đầu — vẫn có thể bán hết vé với giá cao, các trận đấu kém hấp dẫn hơn có thể gặp khó khăn để lấp đầy khán đài. Sự nhu cầu không đồng đều này có thể dẫn đến các khu vực trống có thể nhìn thấy rõ, điều này sẽ làm giảm đi ấn tượng về sự thành công bất chấp số liệu doanh thu vé tổng thể ở mức cao. Những dấu hiệu ban đầu từ đợt bán vé và thị trường bán lại đã cho thấy một số trận đấu khó bán hơn với mức giá bị đẩy cao."
    },
    {
      en: "Another argument is that FIFA’s pricing model may be shifting the World Cup away from its traditional fan base. Historically, the tournament has been accessible to a broad range of supporters, including working- and middle-class fans who travel internationally to follow their teams. By increasing costs for tickets, travel, and accommodation, the World Cup risks becoming more of a premium tourism product than a mass global sporting festival. This could weaken the emotional connection between fans and the tournament over time.",
      vi: "Một lập luận khác là mô hình định giá của FIFA có thể đang dịch chuyển World Cup ra xa khỏi cơ sở người hâm mộ truyền thống của nó. Trong lịch sử, giải đấu này luôn dễ tiếp cận đối với nhiều nhóm người ủng hộ, bao gồm cả những người hâm mộ thuộc tầng lớp lao động và trung lưu, những người đi du lịch quốc tế để cổ vũ cho đội của họ. Bằng cách tăng chi phí mua vé, đi lại và chỗ ở, World Cup có nguy cơ trở thành một sản phẩm du lịch cao cấp hơn là một lễ hội thể thao đại chúng toàn cầu. Điều này có thể làm suy yếu mối liên kết cảm xúc giữa người hâm mộ và giải đấu theo thời gian."
    },
    {
      en: "Ultimately, the article concludes that while FIFA may succeed financially in the short term, there is a real risk that aggressive pricing could damage the product itself. Football’s global popularity depends not only on elite competition but also on atmosphere, inclusiveness, and fan culture. If those elements are eroded, FIFA could find that maximizing revenue today comes at the cost of diminishing the World Cup’s long-term cultural and sporting value.",
      vi: "Cuối cùng, bài viết kết luận rằng mặc dù FIFA có thể thành công về mặt tài chính trong ngắn hạn, nhưng có một rủi ro thực tế là việc định giá quá cao có thể gây tổn hại cho chính sản phẩm này. Sự phổ biến toàn cầu của bóng đá không chỉ phụ thuộc vào các cuộc cạnh tranh đỉnh cao mà còn vào bầu không khí, tính hòa nhập và văn hóa của người hâm mộ. Nếu các yếu tố đó bị bào mòn, FIFA có thể nhận thấy rằng việc tối đa hóa doanh thu ngày hôm nay phải trả giá bằng việc làm giảm giá trị thể thao và văn hóa lâu dài của World Cup."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/graphic-detail/2026/05/18/fifas-exorbitant-world-cup-tickets-could-backfire",
      source_label: "Substack",
      title: "FIFA’s exorbitant World Cup tickets could backfire",
      title_vi: "Vé xem World Cup đắt đỏ của FIFA có thể phản tác dụng",
      category: "Graphic Detail",
      category_vi: "Chi tiết đồ họa",
      excerpt: "FIFA’s strategy of sharply increasing World Cup ticket prices may ultimately undermine the tournament’s atmosphere.",
      excerpt_vi: "Chiến lược tăng giá vé World Cup quá mức của FIFA cuối cùng có thể làm suy yếu bầu không khí của giải đấu.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 26:", data);
}

main().catch(console.error);
