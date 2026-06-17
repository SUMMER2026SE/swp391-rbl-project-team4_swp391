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
      en: "A family’s celebration of the New York Knicks’ NBA championship victory ended in [tragedy]{bi kịch} when Los Angeles police officers fatally shot their two-year-old pet dog, Jameson, outside their apartment in Canoga Park. The incident began after a neighbor reported hearing what they believed to be a woman screaming, [prompting]{khiến cho} officers to conduct a welfare check at the residence. According to police, officers encountered the dog barking near the doorway and asked the owner to [secure]{giữ chặt} the animal. Authorities stated that after the door was briefly closed and reopened, the dog exited the apartment and [charged]{lao vào} toward an officer, leading to the fatal shooting.",
      vi: "Buổi ăn mừng chức vô địch NBA của đội New York Knicks của một gia đình đã kết thúc trong bi kịch khi các cảnh sát Los Angeles bắn chết chú chó cưng hai tuổi của họ, Jameson, bên ngoài căn hộ ở Canoga Park. Sự việc bắt đầu sau khi một người hàng xóm báo cáo nghe thấy tiếng hét được cho là của một phụ nữ, khiến các cảnh sát phải đến kiểm tra tình trạng phúc lợi tại nơi cư trú. Theo cảnh sát, các sĩ quan đã chạm trán với chú chó đang sủa gần cửa ra vào và yêu cầu chủ nhân giữ chặt con vật. Nhà chức trách tuyên bố rằng sau khi cửa được đóng lại và mở ra trong giây lát, chú chó đã lao ra khỏi căn hộ và xông tới một sĩ quan, dẫn đến vụ nổ súng gây tử vong."
    },
    {
      en: "The family strongly disputed that account, insisting that Jameson was friendly and [non-aggressive]{lành tính} and had simply approached the officers while they were celebrating the Knicks’ victory. Videos recorded after the shooting showed the [devastated]{sụp đổ} owner holding the dog’s body while repeatedly explaining that the family had only been celebrating the basketball championship. The footage quickly spread across social media, generating widespread public [outrage]{sự phẫn nộ} and calls for [accountability]{trách nhiệm giải trình}. Community activists demanded the release of police body-camera footage and greater transparency regarding the officers involved.",
      vi: "Gia đình kịch liệt bác bỏ lời kể đó, khẳng định rằng Jameson rất thân thiện, lành tính và chỉ đơn giản là tiếp cận các sĩ quan khi họ đang ăn mừng chiến thắng của Knicks. Các video được ghi lại sau vụ nổ súng cho thấy người chủ sụp đổ ôm xác chú chó trong khi liên tục giải thích rằng gia đình chỉ đang ăn mừng chức vô địch bóng rổ. Đoạn phim nhanh chóng lan truyền trên mạng xã hội, gây ra làn sóng phẫn nộ rộng rãi trong công chúng và kêu gọi trách nhiệm giải trình. Các nhà hoạt động cộng đồng yêu cầu công bố camera hành trình gắn trên người cảnh sát và minh bạch hơn về các sĩ quan liên quan."
    },
    {
      en: "A fundraising campaign launched to cover [cremation]{hỏa táng} expenses and support the family rapidly attracted significant public donations. The Los Angeles Police Department confirmed that its Force Investigation Division had opened an [inquiry]{cuộc điều tra} into the shooting and stated that the circumstances surrounding the incident remain under review. The case has [reignited]{thổi bùng lại} debate about police interactions with household pets and the use of [lethal]{chết người} force in situations involving animals, while supporters of the family argue that the shooting was unnecessary and avoidable.",
      vi: "Một chiến dịch gây quỹ được phát động để trang trải chi phí hỏa táng và hỗ trợ gia đình đã nhanh chóng thu hút được các khoản quyên góp đáng kể từ công chúng. Sở Cảnh sát Los Angeles xác nhận rằng Ban Điều tra Lực lượng của họ đã mở một cuộc điều tra về vụ nổ súng và tuyên bố rằng các tình huống xung quanh vụ việc vẫn đang được xem xét. Vụ việc đã thổi bùng lại cuộc tranh luận về các tương tác của cảnh sát với vật nuôi trong gia đình và việc sử dụng vũ lực gây chết người trong các tình huống liên quan đến động vật, trong khi những người ủng hộ gia đình lập luận rằng vụ nổ súng là không cần thiết và hoàn toàn có thể tránh được."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/us-news/2026/jun/16/los-angeles-police-fatally-shoot-pet-dog-family-celebrating-knicks-win",
      source_label: "The Guardian",
      title: "Los Angeles police fatally shoot pet dog of family celebrating Knicks win",
      title_vi: "Cảnh sát Los Angeles bắn chết chó cưng của gia đình đang ăn mừng chiến thắng của Knicks",
      category: "US News",
      category_vi: "Tin tức Mỹ",
      excerpt: "A family’s celebration of the New York Knicks’ victory ended in tragedy when LA police shot their pet dog.",
      excerpt_vi: "Buổi ăn mừng chiến thắng của đội New York Knicks của một gia đình đã kết thúc trong bi kịch khi cảnh sát LA bắn chết chú chó cưng của họ.",
      author: "Richard Luscombe",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
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
