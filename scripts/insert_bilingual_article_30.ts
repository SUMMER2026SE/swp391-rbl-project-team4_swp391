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
  console.log("Inserting bilingual article 30 (US DeepSeek)...");

  const content = [
    {
      en: "The article reports that the United States has [delayed]{trì hoãn} adding Chinese AI startup DeepSeek, along with more than 100 other companies, to its export blacklist despite internal approvals that flagged them as national security risks. According to sources familiar with the matter, the companies were previously cleared by an interagency review process for placement on the Commerce Department’s Entity List, which restricts U.S. firms from exporting sensitive technology to designated [entities]{thực thể} without a license.",
      vi: "Bài viết báo cáo rằng Hoa Kỳ đã trì hoãn việc đưa công ty khởi nghiệp AI DeepSeek của Trung Quốc, cùng với hơn 100 công ty khác, vào danh sách đen xuất khẩu của mình bất chấp các phê duyệt nội bộ đã gắn nhãn họ là các rủi ro an ninh quốc gia. Theo các nguồn tin quen thuộc với vấn đề này, các công ty trước đó đã được thông qua bởi một quy trình xem xét liên ngành để đưa vào Danh sách Thực thể của Bộ Thương mại, danh sách hạn chế các công ty Mỹ xuất khẩu công nghệ nhạy cảm cho các thực thể được chỉ định mà không có giấy phép."
    },
    {
      en: "DeepSeek, which has attracted global attention for its low-cost artificial intelligence models, is among the firms identified in U.S. government assessments as potentially supporting Chinese military or intelligence-related activities. Other companies considered for listing include semiconductor firms and suppliers accused of involvement in restricted technology transfers or of supporting foreign adversaries, including Russia-linked supply chains and Chinese universities involved in advanced chip [research]{nghiên cứu}.",
      vi: "DeepSeek, công ty đã thu hút sự chú ý toàn cầu nhờ các mô hình trí tuệ nhân tạo giá rẻ, nằm trong số các công ty được xác định trong các đánh giá của chính phủ Mỹ là có khả năng hỗ trợ các hoạt động quân sự hoặc tình báo của Trung Quốc. Các công ty khác được cân nhắc đưa vào danh sách bao gồm các công ty bán dẫn và các nhà cung cấp bị cáo buộc liên quan đến việc chuyển giao công nghệ bị hạn chế hoặc hỗ trợ các đối thủ nước ngoài, bao gồm các chuỗi cung ứng liên kết với Nga và các trường đại học Trung Quốc tham gia nghiên cứu chip tiên tiến."
    },
    {
      en: "The decision to delay the blacklist update is reported to reflect broader concerns within the U.S. administration about escalating tensions with China amid an already strained trade and technology relationship. Officials appear cautious about taking steps that could further intensify economic retaliation or disrupt ongoing diplomatic and commercial channels between the two countries. At the same time, critics argue that the delay weakens [enforcement]{việc thực thi/sự thi hành} of export control policies and may allow sensitive American technologies to continue flowing to entities considered high-risk by national security agencies.",
      vi: "Quyết định trì hoãn cập nhật danh sách đen được báo cáo là phản ánh các mối lo ngại rộng lớn hơn trong chính quyền Hoa Kỳ về căng thẳng leo thang với Trung Quốc trong bối cảnh mối quan hệ thương mại và công nghệ vốn đã căng thẳng. Các quan chức tỏ ra thận trọng trong việc thực hiện các bước đi có thể làm gia tăng thêm hành động trả đũa kinh tế hoặc làm gián đoạn các kênh ngoại giao và thương mại đang diễn ra giữa hai nước. Đồng thời, những người chỉ trích lập luận rằng sự trì hoãn này làm yếu đi việc thực thi các chính sách kiểm soát xuất khẩu và có thể cho phép các công nghệ nhạy cảm của Mỹ tiếp tục chảy sang các thực thể được các cơ quan an ninh quốc gia coi là có rủi ro cao."
    },
    {
      en: "The article also notes that the Entity List has not been updated since October 2025, marking the longest gap in new additions in more than a decade. Analysts cited in reporting suggest this pause raises questions about the effectiveness and consistency of U.S. export control enforcement, especially at a time when competition in artificial intelligence and semiconductor technology is intensifying rapidly between Washington and Beijing.",
      vi: "Bài viết cũng lưu ý rằng Danh sách Thực thể chưa được cập nhật kể từ tháng 10 năm 2025, đánh dấu khoảng cách dài nhất về các bổ sung mới trong hơn một thập kỷ. Các nhà phân tích được trích dẫn trong báo cáo cho rằng sự tạm dừng này dấy lên các câu hỏi về tính hiệu quả và nhất quán của việc thực thi kiểm soát xuất khẩu của Mỹ, đặc biệt vào thời điểm sự cạnh tranh trong công nghệ trí tuệ nhân tạo và bán dẫn đang tăng tốc nhanh chóng giữa Washington và Bắc Kinh."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/technology/us-holds-off-blacklisting-chinas-deepseek-2026-06-17",
      source_label: "Reuters",
      title: "US holds off blacklisting China’s DeepSeek, more than 100 firms deemed security risks",
      title_vi: "Mỹ trì hoãn đưa DeepSeek của Trung Quốc vào danh sách đen, hơn 100 công ty được coi là rủi ro an ninh",
      category: "World News",
      category_vi: "Tin thế giới",
      excerpt: "The U.S. has delayed adding DeepSeek and other companies to its export blacklist.",
      excerpt_vi: "Hoa Kỳ đã trì hoãn việc thêm DeepSeek và các công ty khác vào danh sách đen xuất khẩu của mình.",
      author: "Reuters Staff",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 30:", data);
}

main().catch(console.error);
