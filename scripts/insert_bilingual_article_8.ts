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
  console.log("Inserting bilingual article 8 (Pennsylvania datacenter boom)...");

  const content = [
    {
      en: "The rapid expansion of data centers across Pennsylvania has [triggered]{khởi xướng/gây ra} growing debate among politicians, environmental groups, utility companies, and local residents over the economic benefits and potential costs of supporting the artificial intelligence and cloud-computing industries. Technology companies are increasingly seeking locations with access to reliable electricity, available land, and strong network infrastructure, making Pennsylvania an attractive destination for large-scale data center development. Supporters argue that these projects bring investment, create construction and technology-related jobs, and strengthen the state’s position in the digital economy.",
      vi: "Sự mở rộng nhanh chóng của các trung tâm dữ liệu trên khắp Pennsylvania đã gây ra cuộc tranh luận ngày càng lớn giữa các chính trị gia, các nhóm môi trường, các công ty dịch vụ tiện ích và người dân địa phương về lợi ích kinh tế cũng như chi phí tiềm ẩn của việc hỗ trợ các ngành công nghiệp trí tuệ nhân tạo và điện toán đám mây. Các công ty công nghệ đang ngày càng tìm kiếm những địa điểm có nguồn điện đáng tin cậy, quỹ đất sẵn có và cơ sở hạ tầng mạng mạnh mẽ, biến Pennsylvania thành một điểm đến hấp dẫn cho việc phát triển trung tâm dữ liệu quy mô lớn. Những người ủng hộ lập luận rằng các dự án này mang lại nguồn đầu tư, tạo ra các công việc liên quan đến xây dựng và công nghệ, đồng thời củng cố vị thế của bang trong nền kinh tế kỹ thuật số."
    },
    {
      en: "However, critics have raised concerns about the [enormous]{khổng lồ/to lớn} energy demands of modern data centers, particularly those supporting AI systems that require vast computing resources. Some lawmakers and environmental advocates worry that rising electricity consumption could place pressure on power grids, increase energy prices for consumers, and slow progress toward climate goals if additional fossil-fuel generation is required. Communities near proposed facilities have also questioned the impact on local resources, land use, and infrastructure.",
      vi: "Tuy nhiên, những người chỉ trích đã dấy lên mối lo ngại về nhu cầu năng lượng khổng lồ của các trung tâm dữ liệu hiện đại, đặc biệt là những trung tâm hỗ trợ hệ thống AI đòi hỏi tài nguyên tính toán khổng lồ. Một số nhà lập pháp và những người ủng hộ môi trường lo ngại rằng mức tiêu thụ điện gia tăng có thể gây áp lực lên lưới điện, làm tăng giá điện cho người tiêu dùng và làm chậm tiến trình đạt được các mục tiêu khí hậu nếu cần thêm nguồn phát điện từ nhiên liệu hóa thạch. Các cộng đồng gần các cơ sở được đề xuất xây dựng cũng đặt câu hỏi về tác động đối với tài nguyên địa phương, việc sử dụng đất và cơ sở hạ tầng."
    },
    {
      en: "The debate reflects a broader discussion taking place across the United States as states compete to attract technology investment while balancing environmental and economic priorities. Industry representatives maintain that data centers are essential for future innovation and argue that advances in energy efficiency and renewable power can help [address]{giải quyết} many of the concerns. Nevertheless, policymakers continue to examine how to regulate and support the sector in a way that promotes economic growth without creating [excessive]{quá mức/thừa thãi} burdens on local communities or energy systems. The controversy in Pennsylvania highlights the increasingly important role that data centers play in modern society and the complex challenges governments face as demand for digital infrastructure continues to accelerate.",
      vi: "Cuộc tranh luận này phản ánh một cuộc thảo luận rộng hơn đang diễn ra trên khắp Hoa Kỳ khi các bang cạnh tranh để thu hút đầu tư công nghệ trong khi cân bằng giữa các ưu tiên kinh tế và môi trường. Đại diện ngành công nghiệp khẳng định rằng các trung tâm dữ liệu là rất thiết yếu cho sự đổi mới trong tương lai và lập luận rằng những tiến bộ trong hiệu quả năng lượng và năng lượng tái tạo có thể giúp giải quyết nhiều mối lo ngại. Mặc dù vậy, các nhà hoạch định chính sách vẫn tiếp tục xem xét cách điều tiết và hỗ trợ lĩnh vực này theo cách thúc đẩy tăng trưởng kinh tế mà không tạo ra gánh nặng quá mức cho các cộng đồng địa phương hoặc hệ thống năng lượng. Sự tranh cãi ở Pennsylvania làm nổi bật vai trò ngày càng quan trọng mà các trung tâm dữ liệu đảm nhận trong xã hội hiện đại và những thách thức phức tạp mà các chính phủ phải đối mặt khi nhu cầu về cơ sở hạ tầng kỹ thuật số tiếp tục tăng nhanh."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/technology/2026/jun/16/pennsylvania-datacenter-boom-sparks-debate-among-politicians-and-communities",
      source_label: "The Guardian",
      title: "Pennsylvania’s datacenter boom sparks debate among politicians and communities",
      title_vi: "Sự bùng nổ trung tâm dữ liệu của Pennsylvania gây tranh cãi giữa các chính trị gia và cộng đồng",
      category: "Technology",
      category_vi: "Công nghệ",
      excerpt: "The rapid expansion of data centers across Pennsylvania has triggered growing debate over economic benefits and energy costs.",
      excerpt_vi: "Sự mở rộng nhanh chóng của các trung tâm dữ liệu trên khắp Pennsylvania đã gây ra nhiều tranh luận về lợi ích kinh tế và chi phí năng lượng.",
      author: "Kari Paul",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article:", data);
}

main().catch(console.error);
