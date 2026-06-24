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
  console.log("Inserting bilingual article 18 (Amphibious Villagers)...");

  const content = [
    {
      en: "The article explores the lives of a remarkable community in Indonesia whose daily existence is deeply [intertwined]{quấn chặt/gắn bó chặt chẽ} with the sea. Living in coastal settlements built on stilts above shallow waters, these villagers have developed a unique way of life that allows them to thrive in an environment where land and sea constantly overlap. For generations, the community has relied on fishing, diving, and maritime trade as its primary means of survival, creating a culture in which swimming and navigating the ocean are as natural as walking. Many children learn to swim before they can properly read or write, and the rhythms of everyday life are shaped by tides, weather conditions, and the movement of marine resources.",
      vi: "Bài viết khám phá cuộc sống của một cộng đồng phi thường ở Indonesia với sự tồn tại hàng ngày gắn bó chặt chẽ với biển cả. Sống trong các khu định cư ven biển được xây dựng trên những chiếc cột nhà sàn bên trên vùng nước nông, những dân làng này đã phát triển một lối sống độc đáo cho phép họ phát triển mạnh mẽ trong môi trường mà đất liền và biển cả liên tục giao nhau. Qua nhiều thế hệ, cộng đồng này đã phụ thuộc vào việc đánh bắt cá, lặn và thương mại hàng hải như những phương tiện sinh tồn chính, tạo ra một nền văn hóa nơi việc bơi lội và chèo lái trên đại dương cũng tự nhiên như đi bộ. Nhiều trẻ em học bơi trước khi có thể đọc hoặc viết một cách bài bản, và nhịp điệu của cuộc sống hàng ngày được định hình bởi thủy triều, điều kiện thời tiết và sự di chuyển của các nguồn tài nguyên biển."
    },
    {
      en: "Researchers studying these communities have found evidence that some groups possess extraordinary [adaptations]{sự thích nghi} to life in the water. Their traditions and livelihoods have encouraged generations of close interaction with the marine environment, leading to exceptional diving abilities and a profound understanding of ocean ecosystems. Villagers are capable of spending extended periods underwater while gathering food and resources, skills that have attracted the attention of scientists interested in human adaptation and evolution. Their [intimate]{thân mật/sâu sắc/mật thiết} relationship with the sea has allowed them to maintain a distinctive cultural identity despite rapid modernization elsewhere in Indonesia.",
      vi: "Các nhà nghiên cứu nghiên cứu các cộng đồng này đã tìm thấy bằng chứng cho thấy một số nhóm sở hữu những sự thích nghi phi thường với cuộc sống dưới nước. Truyền thống và sinh kế của họ đã thúc đẩy nhiều thế hệ tương tác chặt chẽ với môi trường biển, dẫn đến khả năng lặn đặc biệt và sự hiểu việc sâu sắc về các hệ sinh thái đại dương. Người dân làng có khả năng dành thời gian dài dưới nước khi thu lượm thức ăn và tài nguyên, những kỹ năng đã thu hút sự chú ý của các nhà khoa học quan tâm đến sự thích nghi và tiến hóa của con người. Mối quan hệ mật thiết của họ với biển cả đã cho phép họ duy trì một bản sắc văn hóa đặc trưng bất chấp quá trình hiện đại hóa nhanh chóng ở những nơi khác của Indonesia."
    },
    {
      en: "However, the article also highlights the growing challenges facing these communities. Climate change, rising sea levels, coastal erosion, overfishing, and environmental [degradation]{sự suy thoái} are threatening the ecosystems on which their livelihoods depend. Younger generations are increasingly drawn toward cities in search of education and employment opportunities, creating concerns about the preservation of traditional knowledge and customs. Government development projects and tourism have brought economic opportunities but have also introduced pressures that are transforming long-established ways of life. As a result, many villagers find themselves balancing the desire to maintain their cultural heritage with the need to adapt to a rapidly changing world.",
      vi: "Tuy nhiên, bài viết cũng nêu bật những thách thức ngày càng tăng mà các cộng đồng này phải đối mặt. Biến đổi khí hậu, nước biển dâng, xói mòn bờ biển, đánh bắt quá mức và suy thoái môi trường đang đe dọa các hệ sinh thái mà sinh kế của họ phụ thuộc vào. Các thế hệ trẻ ngày càng bị thu hút về phía các thành phố để tìm kiếm cơ hội giáo dục và việc làm, gây ra những lo ngại về việc bảo tồn các kiến thức và phong tục truyền thống. Các dự án phát triển của chính phủ và du lịch đã mang lại các cơ hội kinh tế nhưng cũng tạo ra các áp lực đang làm thay đổi lối sống lâu đời. Kết quả là, nhiều dân làng nhận thấy mình phải cân bằng giữa mong muốn duy trì di sản văn hóa của họ với nhu cầu thích nghi với một thế giới đang thay đổi nhanh chóng."
    },
    {
      en: "The story presents these amphibious communities as an example of humanity’s remarkable ability to adapt to diverse environments. Their lives challenge conventional assumptions about the boundaries between land and sea and demonstrate how culture, environment, and biology can interact over long periods of time. At the same time, their experience serves as a reminder of the [vulnerability]{sự dễ bị tổn thương/tính dễ tổn thương} of traditional societies in the face of environmental change and globalization. The future of these Indonesian sea-dwelling communities may depend on their ability to preserve their unique identity while navigating the economic, social, and ecological pressures of the twenty-first century.",
      vi: "Câu chuyện giới thiệu những cộng đồng lưỡng cư này như một ví dụ về khả năng thích ứng phi thường của nhân loại đối với các môi trường đa dạng. Cuộc sống của họ thách thức các giả định thông thường về ranh giới giữa đất liền và biển cả, đồng thời chứng minh cách văn hóa, môi trường và sinh học có thể tương tác với nhau qua những khoảng thời gian dài. Đồng thời, trải nghiệm của họ đóng vai trò như một lời nhắc nhở về tính dễ tổn thương của các xã hội truyền thống trước biến đổi môi trường và toàn cầu hóa. Tương lai của những cộng đồng cư dân sống trên biển này ở Indonesia có thể phụ thuộc vào khả năng giữ gìn bản sắc độc đáo của họ trong khi định hướng qua các áp lực kinh tế, xã hội và sinh thái của thế kỷ hai mươi mốt."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/1843/2026/06/12/the-amphibious-villagers-of-indonesia",
      source_label: "Substack",
      title: "The Amphibious Villagers of Indonesia",
      title_vi: "Cư dân lưỡng cư của Indonesia",
      category: "1843 Magazine",
      category_vi: "Tạp chí 1843",
      excerpt: "The article explores the lives of a remarkable community in Indonesia whose daily existence is deeply intertwined with the sea.",
      excerpt_vi: "Bài viết khám phá cuộc sống của một cộng đồng phi thường ở Indonesia với sự tồn tại hàng ngày gắn bó chặt chẽ với biển cả.",
      author: "Charlie Campbell",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 18:", data);
}

main().catch(console.error);
