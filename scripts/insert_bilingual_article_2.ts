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
  console.log("Inserting bilingual article...");

  const content = [
    {
      en: "A Russian warship reportedly fired warning shots near a British yacht in the English Channel during a tense [maritime]{hàng hải} incident that occurred amid heightened tensions between London and Moscow. The encounter took place more than 20 miles south of the Isle of Wight when the British yacht, identified as Bright Future, sailed close to the Russian [frigate]{tàu tuần phòng} Admiral Grigorovich. According to Russian and British officials, attempts were made to alert the yacht after it approached the heavily armed vessel, and warning shots were fired as a [precaution]{sự phòng ngừa} to avoid a possible [collision]{sự va chạm} rather than to target the yacht directly. No injuries or damage were reported, and the vessel continued its journey after the incident.",
      vi: "Một tàu chiến Nga được báo cáo đã bắn các phát súng cảnh cáo gần một du thuyền của Anh ở eo biển Manche trong một sự cố hàng hải căng thẳng xảy ra giữa lúc căng thẳng gia tăng giữa London và Moscow. Cuộc chạm trán diễn ra cách phía nam đảo Wight hơn 20 dặm khi chiếc du thuyền Anh, được xác định là Bright Future, đi sát tàu hộ tống Admiral Grigorovich của Nga. Theo các quan chức Nga và Anh, các nỗ lực cảnh báo du thuyền đã được thực hiện sau khi nó tiếp cận con tàu vũ trang hạng nặng, và các phát súng cảnh cáo đã được bắn ra như một biện pháp phòng ngừa để tránh một vụ va chạm có thể xảy ra hơn là nhằm mục tiêu trực tiếp vào du thuyền. Không có thương tích hay hư hại nào được báo cáo, và con tàu tiếp tục hành trình sau sự cố."
    },
    {
      en: "The yacht was carrying a retired British couple who later described the experience as frightening and unusual but said they never felt they were being [deliberately]{cố ý} attacked. Royal Navy personnel [subsequently]{sau đó} checked on the crew to ensure their safety. The episode occurred against a backdrop of increasing [friction]{xích mích} between the United Kingdom and Russia, including recent British actions against vessels linked to Russia’s so-called shadow fleet and the growing military [presence]{sự hiện diện} of Russian ships near British waters.",
      vi: "Du thuyền chở một cặp vợ chồng người Anh đã nghỉ hưu, những người sau đó mô tả trải nghiệm này là đáng sợ và bất thường nhưng cho biết họ chưa bao giờ cảm thấy mình bị tấn công cố ý. Lực lượng Hải quân Hoàng gia sau đó đã kiểm tra thủy thủ đoàn để đảm bảo an toàn cho họ. Sự việc xảy ra trong bối cảnh bất đồng ngày càng gia tăng giữa Vương quốc Anh và Nga, bao gồm các hành động gần đây của Anh chống lại các tàu liên quan đến cái gọi là hạm đội bóng tối của Nga và sự hiện diện quân sự ngày càng tăng của các tàu Nga gần vùng biển của Anh."
    },
    {
      en: "Defence analysts noted that such incidents become more likely when naval vessels operate in close [proximity]{sự gần gũi} to civilian traffic, especially in [congested]{tắc nghẽn} waterways such as the English Channel. Although British authorities treated the event as an isolated maritime safety incident, it nevertheless highlighted the risks created by rising [geopolitical]{địa chính trị} tensions and the possibility that misunderstandings at sea could [escalate]{leo thang} into more serious confrontations between the two countries.",
      vi: "Các nhà phân tích quốc phòng lưu ý rằng những sự cố như vậy có nhiều khả năng xảy ra hơn khi các tàu hải quân hoạt động trong khoảng cách gần với các phương tiện dân sự, đặc biệt là ở những tuyến đường thủy tắc nghẽn như eo biển Manche. Mặc dù các nhà chức trách Anh coi sự kiện này là một sự cố an toàn hàng hải đơn lẻ, nhưng nó vẫn làm nổi bật những rủi ro do căng thẳng địa chính trị gia tăng và khả năng những hiểu lầm trên biển có thể leo thang thành các cuộc đối đầu nghiêm trọng hơn giữa hai nước."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/uk-news/2026/jun/16/russian-frigate-fires-warning-shots-at-british-yacht-in-channel-reports",
      source_label: "The Guardian",
      title: "Russian frigate fires warning shots at British yacht in Channel – reports",
      title_vi: "Chiến hạm Nga bắn cảnh cáo du thuyền Anh ở eo biển Channel – theo báo cáo",
      category: "World News",
      category_vi: "Tin thế giới",
      excerpt: "A Russian warship reportedly fired warning shots near a British yacht in the English Channel amid heightened tensions.",
      excerpt_vi: "Một tàu chiến của Nga được báo cáo là đã bắn cảnh cáo gần một du thuyền của Anh trên eo biển Manche trong bối cảnh căng thẳng leo thang.",
      author: "Dan Sabbagh",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
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
