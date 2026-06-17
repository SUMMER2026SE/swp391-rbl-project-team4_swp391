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
  console.log("Inserting bilingual article 22 (Bull Market)...");

  const content = [
    {
      en: "The article argues that U.S. equity markets are showing increasingly speculative and “manic” characteristics after a prolonged bull run, with investor behaviour, valuations, and trading patterns all suggesting a late-cycle phase of [exuberance]{sự hân hoan/sự tăng trưởng dồi dào/sự hào hứng phấn khích}. While the market has been supported by strong corporate earnings, particularly in technology and AI-related sectors, the pace and nature of recent gains point to growing signs of excess. Indicators such as elevated price-to-earnings ratios, surging retail participation, and heavy use of options and leveraged products suggest that investors are increasingly betting on continued price rises rather than underlying fundamentals.",
      vi: "Bài viết lập luận rằng thị trường chứng khoán Hoa Kỳ đang thể hiện các đặc tính đầu cơ và \"hưng phấn\" ngày càng tăng sau một đợt tăng giá kéo dài, với hành vi của nhà đầu tư, định giá và mô hình giao dịch đều cho thấy giai đoạn cuối chu kỳ của sự hào hứng phấn khích. Mặc dù thị trường được hỗ trợ bởi kết quả kinh doanh mạnh mẽ của các doanh nghiệp, đặc biệt là trong lĩnh vực công nghệ và các ngành liên quan đến AI, tốc độ và tính chất của các mức tăng gần đây chỉ ra các dấu hiệu dư thừa ngày càng lớn. Các chỉ số như tỷ số giá trên thu nhập (P/E) ở mức cao, sự tham gia của các nhà đầu tư cá nhân tăng vọt, và việc sử dụng nhiều quyền chọn cũng như sản phẩm đòn bẩy cho thấy các nhà đầu tư đang ngày càng đặt cược vào sự tăng giá liên tục hơn là các yếu tố cơ bản cốt lõi."
    },
    {
      en: "A central theme of the piece is the rise of speculative trading activity among retail investors, who are now more deeply [embedded]{gắn liền/bám rễ sâu} in derivatives markets than in previous cycles. The widespread use of zero-day options and other short-dated instruments has amplified intraday volatility and created feedback loops where small price movements can trigger large directional bets. This has contributed to sharp swings in individual stocks and indices, even in the absence of major new economic information. The article suggests that this behaviour reflects growing confidence that markets will continue rising, rather than disciplined long-term investment strategies.",
      vi: "Chủ đề trung tâm của bài viết là sự trỗi dậy của hoạt động giao dịch đầu cơ trong giới nhà đầu tư cá nhân, những người hiện đang bám rễ sâu hơn vào thị trường phái sinh so với các chu kỳ trước. Việc sử dụng rộng rãi các quyền chọn 0 ngày (zero-day options) và các công cụ ngắn hạn khác đã làm khuếch đại sự biến động trong ngày và tạo ra các vòng lặp phản hồi nơi các chuyển động giá nhỏ có thể kích hoạt các khoản đặt cược định hướng lớn. Điều này góp phần gây ra các dao động mạnh ở từng cổ phiếu riêng lẻ và các chỉ số, ngay cả khi không có thông tin kinh tế mới lớn nào. Bài báo gợi mở rằng hành vi này phản ánh niềm tin ngày càng tăng rằng thị trường sẽ tiếp tục tăng, hơn là các chiến lược đầu tư dài hạn có kỷ luật."
    },
    {
      en: "At the same time, institutional investors have also contributed to [momentum]{động lực/đà tăng trưởng} dynamics, particularly through systematic and quantitative strategies that reinforce existing trends. As more capital flows into already high-performing sectors—especially large technology firms tied to artificial intelligence—the market becomes increasingly concentrated. This concentration amplifies both gains and potential risks, as a small number of companies now account for a disproportionate share of index performance. The article notes that such conditions are often associated with late-stage bull markets, where momentum rather than fundamentals becomes the dominant driver of returns.",
      vi: "Đồng thời, các nhà đầu tư tổ chức cũng góp phần vào động lực đà tăng trưởng, đặc biệt thông qua các chiến lược hệ thống và định lượng nhằm củng cố các xu hướng hiện tại. Khi có nhiều vốn hơn chảy vào các lĩnh vực vốn đã hoạt động hiệu quả cao — đặc biệt là các công ty công nghệ lớn gắn liền với trí tuệ nhân tạo — thị trường ngày càng trở nên tập trung. Sự tập trung này làm khuếch đại cả lợi ích lẫn rủi ro tiềm ẩn, vì một số lượng nhỏ các công ty hiện đang chiếm một tỷ lệ không cân xứng trong hiệu suất của chỉ số. Bài viết lưu ý rằng các điều kiện như vậy thường liên quan đến các thị trường giá lên giai đoạn cuối, nơi đà tăng trưởng chứ không phải các yếu tố cơ bản trở thành động lực chi phối lợi nhuận."
    },
    {
      en: "Despite these warning signs, the article does not argue that a crash is [imminent]{sắp xảy ra/cận kề}. Instead, it frames the current environment as one characterized by stretched valuations and heightened risk-taking, where optimism about future earnings growth—particularly from AI—has become a powerful force sustaining the rally. Corporate profits remain strong, and economic conditions have not yet deteriorated enough to trigger a reversal. However, the combination of speculative trading, narrow market leadership, and elevated expectations creates vulnerability to any negative shock.",
      vi: "Bất chấp những dấu hiệu cảnh báo này, bài viết không lập luận rằng một sự sụp đổ sắp xảy ra. Thay vào đó, nó định hình môi trường hiện tại là môi trường có đặc điểm định giá bị kéo căng và mức độ chấp nhận rủi ro gia tăng, nơi sự lạc quan về tăng trưởng thu nhập trong tương lai — đặc biệt là từ AI — đã trở thành một lực lượng mạnh mẽ duy trì đợt tăng giá này. Lợi nhuận của các doanh nghiệp vẫn mạnh mẽ và các điều kiện kinh tế vẫn chưa suy giảm đủ để kích hoạt một sự đảo chiều. Tuy nhiên, sự kết hợp giữa giao dịch đầu cơ, vai trò dẫn dắt thị trường bị thu hẹp và kỳ vọng tăng cao tạo ra tính dễ tổn thương trước bất kỳ cú sốc tiêu cực nào."
    },
    {
      en: "Ultimately, the piece suggests that while the bull market may still have room to run, its character has changed. It is no longer driven primarily by broad-based economic expansion, but by concentrated bets on a small set of high-growth narratives. The “manic phase” label reflects the idea that investor psychology has become a key driver of prices, increasing the risk that future adjustments—if they occur—could be sharper and more [abrupt]{đột ngột/bất ngờ} than in earlier stages of the cycle.",
      vi: "Cuối cùng, bài viết gợi ý rằng mặc dù thị trường giá lên có thể vẫn còn dư địa để tiếp tục, tính chất của nó đã thay đổi. Nó không còn được thúc đẩy chủ yếu bởi sự mở rộng kinh tế trên diện rộng, mà bởi các khoản đặt cược tập trung vào một nhóm nhỏ các câu chuyện tăng trưởng cao. Nhãn hiệu \"giai đoạn hưng phấn\" phản ánh ý tưởng rằng tâm lý nhà đầu tư đã trở thành động lực chính thúc đẩy giá cả, làm tăng rủi ro rằng các điều chỉnh trong tương lai — nếu chúng xảy ra — có thể sắc nét và đột ngột hơn so với các giai đoạn trước của chu kỳ."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/finance-and-economics/2026/06/16/americas-bull-market-has-entered-its-manic-phase",
      source_label: "Substack",
      title: "America’s Bull Market Has Entered Its Manic Phase",
      title_vi: "Thị trường tăng giá của Mỹ đã bước vào giai đoạn hưng phấn",
      category: "Finance & Economics",
      category_vi: "Tài chính & Kinh tế",
      excerpt: "U.S. equity markets are showing increasingly speculative and manic characteristics after a prolonged bull run.",
      excerpt_vi: "Thị trường cổ phiếu Hoa Kỳ đang thể hiện các đặc tính đầu cơ và hưng phấn ngày càng tăng sau đợt tăng giá kéo dài.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 22:", data);
}

main().catch(console.error);
