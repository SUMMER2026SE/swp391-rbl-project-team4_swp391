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
  console.log("Inserting bilingual article 12 (America's Suburbs)...");

  const content = [
    {
      en: "America’s suburbs are undergoing a major [demographic]{nhân khẩu học} transformation as the large generation of baby boomers ages in place, causing many suburban communities to become significantly older than they were just a few decades ago. Areas that were originally built to [accommodate]{đáp ứng/chứa/cung cấp chỗ ở} young families after the Second World War are now seeing rising median ages as long-time homeowners remain in their houses well into retirement. While some suburbs continue to attract younger residents, population growth has increasingly shifted toward outer suburban and exurban areas, leaving many established suburbs with a growing concentration of older adults. Demographers warn that this trend could place new demands on housing, healthcare, transportation, and local government services that were not originally designed for aging populations. Studies show that Americans are increasingly choosing to remain in their homes as they grow older rather than [relocating]{chuyển chỗ ở}, reinforcing the aging of suburban neighborhoods.",
      vi: "Các vùng ngoại ô của Mỹ đang trải qua một cuộc biến đổi nhân khẩu học lớn khi thế hệ bùng nổ trẻ sơ sinh (baby boomers) già đi ngay tại nơi cư trú của họ, khiến nhiều cộng đồng ngoại ô trở nên già hơn đáng kể so với chỉ vài thập kỷ trước. Những khu vực ban đầu được xây dựng để đáp ứng chỗ ở cho các gia đình trẻ sau Thế chiến thứ hai hiện đang chứng kiến độ tuổi trung vị gia tăng do những chủ nhà lâu năm vẫn ở lại ngôi nhà của họ cho đến khi nghỉ hưu. Trong khi một số vùng ngoại ô tiếp tục thu hút những cư dân trẻ tuổi hơn, sự gia tăng dân số lại ngày càng chuyển dịch về phía các vùng ngoài ngoại ô và rìa đô thị (exurban), để lại nhiều vùng ngoại ô lâu đời với tỷ lệ người cao tuổi tập trung ngày càng cao. Các nhà nhân khẩu học cảnh báo rằng xu hướng này có thể đặt ra những yêu cầu mới đối với nhà ở, chăm sóc sức khỏe, giao thông và các dịch vụ chính quyền địa phương vốn ban đầu không được thiết kế cho dân số già. Các nghiên cứu cho thấy người Mỹ ngày càng lựa chọn ở lại nhà của họ khi già đi thay vì chuyển chỗ ở, điều này càng làm tăng tốc độ già hóa của các khu dân cư ngoại ô."
    },
    {
      en: "The shift presents both opportunities and challenges. Older residents contribute substantially to local economies through spending, volunteering, caregiving, and community engagement, making them an increasingly important economic force. At the same time, many suburbs lack the public transportation systems, healthcare infrastructure, and walkable environments that older adults may need as they age. Experts have warned that some communities could face rising levels of social [isolation]{sự cô lập/sự cách biệt}, housing mismatches, and financial hardship among seniors if local planning does not adapt to changing demographics. Recent research has highlighted growing concerns about suburban poverty among older Americans and the difficulty many face accessing services in car-dependent neighborhoods.",
      vi: "Sự chuyển dịch này mang lại cả cơ hội lẫn thách thức. Cư dân lớn tuổi đóng góp đáng kể cho nền kinh tế địa phương thông qua chi tiêu, hoạt động tình nguyện, chăm sóc người thân và gắn kết cộng đồng, biến họ trở thành một lực lượng kinh tế ngày càng quan trọng. Đồng thời, nhiều vùng ngoại ô lại thiếu hệ thống giao thông công cộng, cơ sở hạ tầng y tế và môi trường thân thiện với người đi bộ mà người lớn tuổi có thể cần khi họ già đi. Các chuyên gia đã cảnh báo rằng một số cộng đồng có thể phải đối mặt với mức độ cô lập xã hội ngày càng tăng, sự mất cân đối về nhà ở và khó khăn tài chính ở người cao tuổi nếu quy hoạch địa phương không thích ứng với sự thay đổi nhân khẩu học. Nghiên cứu gần đây đã làm nổi bật những lo ngại ngày càng tăng về tình trạng nghèo đói ở vùng ngoại ô của những người Mỹ lớn tuổi và những khó khăn mà nhiều người gặp phải khi tiếp cận các dịch vụ trong các khu dân cư phụ thuộc vào xe hơi."
    },
    {
      en: "The aging of suburbia is also expected to influence the housing market and future patterns of development. As younger generations struggle with housing affordability and delayed homeownership, many suburban homes remain occupied by older owners for longer periods. Meanwhile, some of the fastest population growth in the United States is occurring in outer suburban and exurban communities where housing is cheaper and land is more available. Urban planners believe the next phase of suburban development will require more [diverse]{đa dạng} housing options, improved transportation networks, and services tailored to older residents. The trend reflects a broader demographic shift across the United States, where an aging population is reshaping communities and forcing policymakers to rethink how suburban areas will function in the decades ahead.",
      vi: "Sự già hóa của các vùng ngoại ô cũng được dự báo là sẽ ảnh hưởng đến thị trường nhà ở và các hình thái phát triển trong tương lai. Khi các thế hệ trẻ hơn gặp khó khăn về khả năng chi trả nhà ở và trì hoãn việc sở hữu nhà, nhiều ngôi nhà ở ngoại ô vẫn tiếp tục được sở hữu bởi những chủ nhà lớn tuổi trong thời gian dài hơn. Trong khi đó, một số khu vực có tốc độ tăng trưởng dân số nhanh nhất ở Hoa Kỳ đang diễn ra tại các cộng đồng ngoài ngoại ô và rìa đô thị, nơi nhà ở rẻ hơn và quỹ đất sẵn có nhiều hơn. Các nhà quy hoạch đô thị tin rằng giai đoạn phát triển ngoại ô tiếp theo sẽ đòi hỏi các lựa chọn nhà ở đa dạng hơn, mạng lưới giao thông được cải thiện và các dịch vụ được điều chỉnh riêng cho cư dân lớn tuổi. Xu hướng này phản ánh sự chuyển dịch nhân khẩu học rộng lớn hơn trên khắp Hoa Kỳ, nơi dân số già đang định hình lại các cộng đồng và buộc các nhà hoạch định chính sách phải suy nghĩ lại về cách các vùng ngoại ô hoạt động trong những thập kỷ tới."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/interactive/2026/06/11/americas-suburbs-are-growing-old-fast",
      source_label: "The Economist",
      title: "America’s Suburbs Are Growing Old Fast",
      title_vi: "Các vùng ngoại ô nước Mỹ đang già đi nhanh chóng",
      category: "Interactive",
      category_vi: "Tương tác",
      excerpt: "America’s suburbs are undergoing a major demographic transformation as baby boomers age in place.",
      excerpt_vi: "Các vùng ngoại ô nước Mỹ đang trải qua biến đổi nhân khẩu học lớn khi thế hệ bùng nổ trẻ sơ sinh già đi tại chỗ.",
      author: "The Economist Data Team",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 12:", data);
}

main().catch(console.error);
