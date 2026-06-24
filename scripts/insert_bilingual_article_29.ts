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
  console.log("Inserting bilingual article 29 (Algae Reflecting Pool)...");

  const content = [
    {
      en: "The article reports that crews in Washington, D.C. are working to remove an [algae]{tảo} bloom that has developed in the recently renovated Lincoln Memorial Reflecting Pool, a major landmark between the Lincoln Memorial and the Washington Monument. The pool was recently drained, resurfaced, and repainted as part of a large-scale restoration project, but warm weather and water conditions have quickly led to the return of algae growth.",
      vi: "Bài viết báo cáo rằng các đội công nhân ở Washington, D.C. đang nỗ lực loại bỏ hiện tượng tảo nở hoa xuất hiện ở Hồ Phản Chiếu Lincoln Memorial mới được cải tạo gần đây, một địa danh lớn nằm giữa Lincoln Memorial và Washington Monument. Hồ nước mới được hút cạn, làm lại bề mặt và sơn lại gần đây như một phần của dự án trùng tu quy mô lớn, nhưng thời tiết ấm áp và các điều kiện nước đã nhanh chóng dẫn đến sự trở lại của sự phát triển tảo."
    },
    {
      en: "According to officials, the National Park Service has deployed a combination of hydrogen peroxide treatments and advanced nanobubble ozone technology to treat the water and reduce contamination. These methods are intended to eliminate algae, bacteria such as E. coli, and other impurities while avoiding harsher chemical damage to the [ecosystem]{hệ sinh thái}. Workers have also been actively skimming and cleaning the surface of the pool as part of ongoing [maintenance]{bảo dưỡng/bảo trì} efforts.",
      vi: "Theo các quan chức, Cục Công viên Quốc gia đã triển khai sự kết hợp giữa các phương pháp xử lý bằng hydro peroxide và công nghệ ozone bong bóng nano tiên tiến để xử lý nước và giảm thiểu ô nhiễm. Các phương thức này nhằm tiêu diệt tảo, vi khuẩn như vi khuẩn liên cầu E. coli và các tạp chất khác trong khi tránh được các thiệt hại hóa chất khắc nghiệt hơn đối với hệ sinh thái. Các công nhân cũng đã tích cực vớt và làm sạch bề mặt hồ như một phần của các nỗ lực bảo trì liên tục."
    },
    {
      en: "Experts cited in reporting note that algae blooms are a [recurring]{định kỳ/lặp đi lặp lại} issue in the Reflecting Pool due to environmental conditions, including warm temperatures, stagnant water, and nutrient presence that can encourage rapid biological growth. While the recent renovation aimed to improve the pool’s appearance and water quality, some specialists suggest that such blooms may continue to reappear without more fundamental changes to water circulation or maintenance systems.",
      vi: "Các chuyên gia được trích dẫn trong báo cáo lưu ý rằng hiện tượng tảo nở hoa là một vấn đề lặp đi lặp lại ở Hồ Phản Chiếu do điều kiện môi trường, bao gồm nhiệt độ ấm, nước tù đọng và sự hiện diện của chất dinh dưỡng có thể thúc đẩy sự phát triển sinh học nhanh chóng. Mặc dù đợt cải tạo gần đây nhằm mục đích cải thiện diện mạo và chất lượng nước của hồ, một số chuyên gia gợi ý rằng tảo có thể sẽ tiếp tục xuất hiện trở lại nếu không có những thay đổi căn bản hơn đối với hệ thống tuần hoàn nước hoặc hệ thống bảo trì."
    },
    {
      en: "The article also highlights broader concerns about the sustainability of aesthetic restoration projects in urban public spaces, particularly when natural environmental conditions remain unchanged. Despite the high-profile renovation and increased maintenance efforts, the Reflecting Pool continues to face challenges in maintaining its intended clear, reflective appearance.",
      vi: "Bài viết cũng làm nổi bật những lo ngại rộng lớn hơn về tính bền vững của các dự án trùng tu mang tính thẩm mỹ trong các không gian công cộng đô thị, đặc biệt khi các điều kiện môi trường tự nhiên vẫn không thay đổi. Bất chấp đợt trùng tu nổi tiếng và các nỗ lực bảo trì gia tăng, Hồ Phản Chiếu vẫn tiếp tục đối mặt với những thách thức trong việc duy trì diện mạo trong suốt và phản chiếu như mong muốn."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/world/us/crews-battle-algae-bloom-in-washington-reflecting-pool-2026-06-16",
      source_label: "Reuters",
      title: "Crews battle algae bloom in Washington’s newly repainted Reflecting Pool",
      title_vi: "Các đội công nhân xử lý tảo nở hoa ở Hồ Phản Chiếu mới được sơn lại của Washington",
      category: "US News",
      category_vi: "Tin tức Mỹ",
      excerpt: "Crews are working to remove an algae bloom in the recently renovated Lincoln Memorial Reflecting Pool.",
      excerpt_vi: "Các đội công nhân đang nỗ lực loại bỏ hiện tượng tảo nở hoa tại Hồ Phản Chiếu mới cải tạo.",
      author: "Reuters Staff",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 29:", data);
}

main().catch(console.error);
