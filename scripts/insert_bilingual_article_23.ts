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
  console.log("Inserting bilingual article 23 (Latin America)...");

  const content = [
    {
      en: "The article argues that Latin America has unexpectedly become one of the better-performing emerging regions for investors during Donald Trump’s second term, despite—or in some cases because of—the geopolitical [disruption]{sự gián đoạn/sự hỗn loạn} his policies have created. While Trump’s approach to foreign policy has increased uncertainty across the Americas, it has also redirected capital flows, reshaped trade relationships, and strengthened investor interest in parts of Latin America.",
      vi: "Bài viết lập luận rằng Mỹ Latinh đã bất ngờ trở thành một trong những khu vực mới nổi có hiệu suất tốt hơn cho các nhà đầu tư trong nhiệm kỳ thứ hai của Donald Trump, bất chấp — hoặc trong một số trường hợp là vì — sự gián đoạn địa chính trị mà các chính sách của ông đã tạo ra. Trong khi cách tiếp cận chính sách đối ngoại của Trump làm tăng sự bất định trên khắp châu Mỹ, nó cũng điều hướng lại các dòng vốn, định hình lại mối quan hệ thương mại và củng cố sự quan tâm của các nhà đầu tư vào các khu vực của Mỹ Latinh."
    },
    {
      en: "A key driver of this trend is the rise in foreign direct investment, which has increased significantly as companies and governments reposition themselves in response to U.S. pressure on global supply chains and strategic resources. The region’s relative political and macroeconomic stability compared with previous decades has also helped attract capital. Inflation has been brought under better control in most countries, central banks have adopted more credible frameworks, and currencies in many cases are now floating or managed more [sustainably]{bền vững} than in the past. These reforms have made Latin America more [resilient]{kiên cường/đàn hồi/mạnh mẽ} to external shocks than it was in earlier cycles.",
      vi: "Động lực chính của xu hướng này là sự gia tăng đầu tư trực tiếp nước ngoài, vốn đã tăng đáng kể khi các công ty và chính phủ định vị lại bản thân để phản ứng với áp lực của Mỹ lên chuỗi cung ứng toàn cầu và các nguồn tài nguyên chiến lược. Sự ổn định chính trị và kinh tế vĩ mô tương đối của khu vực so với các thập kỷ trước cũng giúp thu hút dòng vốn. Lạm phát đã được kiểm soát tốt hơn ở hầu hết các quốc gia, các ngân hàng trung ương đã áp dụng các khung khổ đáng tin cậy hơn, và tiền tệ trong nhiều trường hợp hiện đang thả nổi hoặc được quản lý bền vững hơn so với trước đây. Những cải cách này đã làm cho Mỹ Latinh trở nên kiên cường hơn trước các cú sốc bên ngoài so với các chu kỳ trước đó."
    },
    {
      en: "The article also highlights how Trump’s emphasis on securing access to critical minerals and reshaping hemispheric supply chains has increased the strategic importance of countries such as Brazil, Chile, Argentina, and Paraguay. These countries hold large reserves of copper, lithium, and rare-earth elements, which are increasingly [vital]{quan trọng/thiết yếu} for electric vehicles, renewable energy systems, and advanced technologies. As a result, both U.S. and Chinese firms are competing more aggressively for access to these resources, driving up investment and deal activity in the region.",
      vi: "Bài báo cũng nhấn mạnh cách Trump nhấn mạnh vào việc đảm bảo tiếp cận các khoáng sản quan trọng và định hình lại chuỗi cung ứng ở bán cầu đã làm tăng tầm quan trọng chiến lược của các nước như Brazil, Chile, Argentina và Paraguay. Những quốc gia này nắm giữ trữ lượng lớn đồng, lithium và các nguyên tố đất hiếm, những nguyên tố ngày càng thiết yếu cho xe điện, hệ thống năng lượng tái tạo và công nghệ tiên tiến. Hệ quả là, cả các công ty Mỹ và Trung Quốc đều đang cạnh tranh gay gắt hơn để tiếp cận các nguồn tài nguyên này, thúc đẩy đầu tư và hoạt động giao dịch trong khu vực."
    },
    {
      en: "At the same time, the article stresses that this optimism is fragile. Much of the recent inflow of capital is driven by expectations that U.S. policy will continue to prioritize Latin America as a strategic partner, but this could change quickly depending on political developments in Washington. Trump’s unpredictable foreign policy style—combining interventionism, tariffs, and sudden diplomatic shifts—creates volatility that could [deter]{ngăn cản/răn đe} long-term investors if tensions escalate further.",
      vi: "Đồng thời, bài viết nhấn mạnh rằng sự lạc quan này rất mong manh. Phần lớn dòng vốn chảy vào gần đây được thúc đẩy bởi những kỳ vọng rằng chính sách của Hoa Kỳ sẽ tiếp tục ưu tiên Mỹ Latinh như một đối tác chiến lược, nhưng điều này có thể thay đổi nhanh chóng tùy thuộc vào các diễn biến chính trị ở Washington. Phong cách chính sách đối ngoại không thể đoán trước của Trump — kết hợp giữa chủ nghĩa can thiệp, thuế quan và các chuyển dịch ngoại giao đột ngột — tạo ra sự biến động có thể ngăn cản các nhà đầu tư dài hạn nếu căng thẳng leo thang hơn nữa."
    },
    {
      en: "Structural weaknesses in the region remain a significant constraint. Countries like Brazil still face fiscal pressures from large pension obligations, Argentina remains dependent on external financial support, and Mexico has experienced periods of economic contraction. Infrastructure gaps, bureaucratic inefficiencies, and uneven institutional quality continue to limit productivity and long-term growth potential.",
      vi: "Các điểm yếu mang tính cơ cấu trong khu vực vẫn là một hạn chế đáng kể. Các quốc gia như Brazil vẫn phải đối mặt với áp lực tài khóa từ các nghĩa vụ hưu trí lớn, Argentina vẫn phụ thuộc vào hỗ trợ tài chính bên ngoài, và Mexico đã trải qua những giai đoạn suy thoái kinh tế. Các khoảng cách cơ sở hạ tầng, sự kém hiệu quả của bộ máy quan liêu và chất lượng thể chế không đồng đều tiếp tục hạn chế năng suất và tiềm năng tăng trưởng dài hạn."
    },
    {
      en: "Ultimately, the article concludes that Latin America is benefiting from a combination of geopolitical repositioning and gradual domestic reform, but its attractiveness as an investment destination depends heavily on external political conditions. Trump’s policies have helped increase attention and capital flows toward the region, but they have also introduced instability that could reverse those gains if global or regional tensions intensify.",
      vi: "Cuối cùng, bài viết kết luận rằng Mỹ Latinh đang được hưởng lợi từ sự kết hợp giữa định vị lại địa chính trị và cải cách trong nước dần dần, nhưng tính hấp dẫn của nó như một điểm đến đầu tư phụ thuộc rất nhiều vào các điều kiện chính trị bên ngoài. Các chính sách của Trump đã giúp tăng cường sự chú ý và dòng vốn hướng tới khu vực, nhưng chúng cũng đưa vào các yếu tố không ổn định có thể đảo ngược những thành quả đó nếu căng thẳng toàn cầu hoặc khu vực gia tăng."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/finance-and-economics/2026/06/14/does-donald-trump-make-latin-america-a-good-bet",
      source_label: "Substack",
      title: "Does Donald Trump make Latin America a good bet?",
      title_vi: "Liệu Donald Trump có biến Mỹ Latinh thành lựa chọn đầu tư tốt?",
      category: "Finance & Economics",
      category_vi: "Tài chính & Kinh tế",
      excerpt: "Latin America has unexpectedly become one of the better-performing emerging regions for investors during Trump's second term.",
      excerpt_vi: "Mỹ Latinh đã bất ngờ trở thành một trong những khu vực mới nổi hoạt động tốt hơn cho các nhà đầu tư trong nhiệm kỳ hai của Trump.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 23:", data);
}

main().catch(console.error);
