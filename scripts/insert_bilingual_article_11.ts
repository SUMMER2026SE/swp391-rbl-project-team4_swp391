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
  console.log("Inserting bilingual article 11 (El Nino The Economist)...");

  const content = [
    {
      en: "Scientists are increasingly concerned that a powerful El Niño event developing in the Pacific Ocean could become one of the strongest ever recorded, with potentially [far-reaching]{sâu rộng/có ảnh hưởng lớn} consequences for weather patterns, agriculture, ecosystems, and global economies. Recent climate observations show rapidly warming sea-surface temperatures across key regions of the tropical Pacific, while atmospheric [indicators]{chỉ số/dấu hiệu} suggest that conditions are aligning for a major El Niño episode. Several forecasting models indicate that the event could rival or even exceed the intensity of historic El Niño events such as those of 1997–98 and 2015–16, both of which caused widespread droughts, floods, heatwaves, and economic [disruption]{sự gián đoạn/sự hỗn loạn} around the world. Meteorological agencies in Australia and elsewhere have officially declared that El Niño conditions are now underway, with some experts warning that it could become one of the strongest events observed since modern records began.",
      vi: "Các nhà khoa học ngày càng lo ngại rằng hiện tượng El Niño mạnh đang hình thành ở Thái Bình Dương có thể trở thành một trong những đợt mạnh nhất từng được ghi nhận, mang lại những hậu quả sâu rộng tiềm ẩn đối với các hình thái thời tiết, nông nghiệp, hệ sinh thái và nền kinh tế toàn cầu. Các quan sát khí hậu gần đây cho thấy nhiệt độ bề mặt nước biển đang ấm lên nhanh chóng tại các khu vực trọng điểm của vùng nhiệt đới Thái Bình Dương, trong khi các chỉ số khí quyển cho thấy các điều kiện đang hội tụ để tạo nên một đợt El Niño lớn. Một số mô hình dự báo chỉ ra rằng sự kiện này có thể sánh ngang hoặc thậm chí vượt quá cường độ của các đợt El Niño lịch sử như các đợt năm 1997–98 và 2015–16, cả hai đợt này đều gây ra hạn hán, lũ lụt, sóng nhiệt và gián đoạn kinh tế trên diện rộng trên khắp thế giới. Các cơ quan khí tượng ở Úc và các nơi khác đã chính thức tuyên bố rằng các điều kiện El Niño hiện đang diễn ra, với việc một số chuyên gia cảnh báo rằng đây có thể trở thành một trong những đợt mạnh nhất được ghi nhận kể từ khi các dữ liệu hiện đại bắt đầu được thu thập."
    },
    {
      en: "The effects of a major El Niño are expected to vary by region but could be severe on a global scale. Countries in Asia and Australia may experience hotter and drier conditions, increasing the risks of drought, crop failures, water shortages, and bushfires. In contrast, parts of the Americas could see heavier rainfall, flooding, and stronger storms. Scientists are particularly worried because the phenomenon is developing in a world that is already significantly warmer due to climate change. Higher background temperatures could [amplify]{khuyếch đại/làm trầm trọng thêm} the impacts of El Niño, leading to more extreme heatwaves, increased wildfire activity, and greater stress on food and water systems. Researchers also warn that disruptions to agriculture could contribute to food-price [inflation]{sự lạm phát} and humanitarian challenges in vulnerable regions.",
      vi: "Tác động của một đợt El Niño lớn dự kiến sẽ khác nhau tùy theo khu vực nhưng có thể rất nghiêm trọng trên quy mô toàn cầu. Các quốc gia ở châu Á và nước Úc có thể phải trải qua các điều kiện thời tiết nóng và khô hơn, làm tăng nguy cơ hạn hán, mất mùa, thiếu nước và cháy rừng. Ngược lại, các khu vực của châu Mỹ có thể chứng kiến lượng mưa lớn hơn, lũ lụt và các cơn bão mạnh hơn. Các nhà khoa học đặc biệt lo lắng vì hiện tượng này đang phát triển trong một thế giới vốn đã ấm hơn đáng kể do biến đổi khí hậu. Nhiệt độ nền cao hơn có thể làm trầm trọng thêm các tác động của El Niño, dẫn đến các đợt sóng nhiệt khắc nghiệt hơn, hoạt động cháy rừng gia tăng và gây ra áp lực lớn hơn lên hệ thống lương thực và nguồn nước. Các nhà nghiên cứu cũng cảnh báo rằng sự gián đoạn đối với nông nghiệp có thể góp phần làm lạm phát giá lương thực và tạo ra các thách thức nhân đạo ở các khu vực dễ bị tổn thương."
    },
    {
      en: "Climate experts emphasize that uncertainty remains regarding the exact peak intensity of the event, but the overall direction of risk is becoming increasingly clear. International organizations, including the World Meteorological Organization, have urged governments and businesses to prepare for possible climate-related disruptions in the coming months. Forecasts suggest that El Niño will likely [persist]{kéo dài/dai dẳng} through the end of 2026 and could influence global temperatures well into 2027. If projections prove accurate, the event may contribute to new temperature records and place additional [strain]{áp lực/sức ép} on regions already coping with extreme weather and environmental pressures. The possibility of a record-breaking El Niño therefore represents not only a meteorological concern but also a major economic, agricultural, and humanitarian challenge for countries around the world.",
      vi: "Các chuyên gia khí hậu nhấn mạnh rằng vẫn còn sự mơ hồ liên quan đến cường độ đỉnh điểm chính xác của hiện tượng này, nhưng hướng đi chung của rủi ro đang ngày càng trở nên rõ ràng. Các tổ chức quốc tế, bao gồm Tổ chức Khí tượng Thế giới, đã kêu gọi các chính phủ và doanh nghiệp chuẩn bị cho các đợt gián đoạn liên quan đến khí hậu có thể xảy ra trong những tháng tới. Các dự báo cho thấy El Niño có khả năng sẽ kéo dài cho đến cuối năm 2026 và có thể ảnh hưởng đến nhiệt độ toàn cầu kéo dài sang năm 2027. Nếu các dự báo chứng minh là chính xác, sự kiện này có thể góp phần thiết lập các kỷ lục nhiệt độ mới và gây thêm sức ép lên các khu vực vốn đang phải đối phó với thời tiết khắc nghiệt và các áp lực môi trường. Khả năng xảy ra một đợt El Niño phá kỷ lục do đó không chỉ đại diện cho một mối lo ngại về khí tượng mà còn là một thách thức lớn về kinh tế, nông nghiệp và nhân đạo đối với các quốc gia trên toàn thế giới."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/science-and-technology/2026/06/16/the-coming-el-nino-could-be-the-strongest-ever-recorded",
      source_label: "The Economist",
      title: "The Coming El Niño Could Be the Strongest Ever Recorded",
      title_vi: "Đợt El Niño sắp tới có thể là đợt mạnh nhất từng được ghi nhận",
      category: "Science & Technology",
      category_vi: "Khoa học & Công nghệ",
      excerpt: "A powerful El Niño developing in the Pacific Ocean could become one of the strongest ever recorded.",
      excerpt_vi: "Một đợt El Niño mạnh đang phát triển ở Thái Bình Dương có thể trở thành một trong những đợt mạnh nhất từng được ghi nhận.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1200&q=80",
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
