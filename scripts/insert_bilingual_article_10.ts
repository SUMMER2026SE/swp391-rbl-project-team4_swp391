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
  console.log("Inserting bilingual article 10 (Israel-Iran The Economist)...");

  const content = [
    {
      en: "Although Israel achieved several important military successes during the war with Iran, the emerging ceasefire has raised questions about whether those victories will ultimately translate into lasting [strategic]{mang tính chiến lược} gains. Israeli forces, supported by the United States, [inflicted]{gây ra/giáng xuống} significant damage on Iranian military infrastructure, weakened parts of Tehran’s missile capabilities, and placed unprecedented pressure on the Iranian leadership. However, as negotiations move toward a longer-term settlement, many of Israel’s original objectives remain only partially fulfilled. Iran’s government has survived the conflict, its political system remains intact, and key issues such as its missile program, regional influence, and future nuclear ambitions have not been permanently resolved. Analysts argue that the war may therefore end with Iran [battered]{bị tàn phá/bị dập vùi} but still capable of projecting power across the region.",
      vi: "Mặc dù Israel đã đạt được một số thành công quân sự quan trọng trong cuộc chiến với Iran, thỏa thuận ngừng bắn mới xuất hiện đã dấy lên những câu hỏi về việc liệu những chiến thắng đó rốt cuộc có chuyển hóa thành các lợi ích chiến lược lâu dài hay không. Các lực lượng Israel, được hỗ trợ bởi Hoa Kỳ, đã gây ra thiệt hại đáng kể cho cơ sở hạ tầng quân sự của Iran, làm suy yếu một phần khả năng tên lửa của Tehran và đặt áp lực chưa từng có lên giới lãnh đạo Iran. Tuy nhiên, khi các cuộc đàm phán hướng tới một giải pháp lâu dài hơn, nhiều mục tiêu ban đầu của Israel vẫn chỉ được hoàn thành một phần. Chính phủ Iran vẫn tồn tại qua cuộc xung đột, hệ thống chính trị của họ vẫn nguyên vẹn, và các vấn đề cốt lõi như chương trình tên lửa, ảnh hưởng khu vực và các tham vọng hạt nhân tương lai của nước này vẫn chưa được giải quyết triệt để. Các nhà phân tích lập luận rằng cuộc chiến do đó có thể kết thúc với một Iran bị tàn phá nặng nề nhưng vẫn đủ khả năng thể hiện quyền lực trên khắp khu vực."
    },
    {
      en: "The diplomatic process has also exposed growing tensions between Israel and the United States. While Washington has prioritized ending the conflict through negotiations and reopening critical trade routes such as the Strait of Hormuz, Israeli leaders have expressed concerns that a [premature]{quá sớm/non nớt/chưa chín muồi} settlement could allow Iran to recover and rebuild its capabilities. Reports suggest that Israel was not fully satisfied with the terms being discussed and feared that sanctions relief and renewed oil exports could strengthen Tehran economically over time. At the same time, disputes over Israel’s military presence in southern Lebanon have become a major [obstacle]{trở ngại/vật cản} to a broader peace agreement, with Iran insisting that an Israeli withdrawal is necessary for a lasting settlement.",
      vi: "Tiến trình ngoại giao cũng làm bộc lộ những căng thẳng ngày càng tăng giữa Israel và Hoa Kỳ. Trong khi Washington ưu tiên chấm dứt xung đột thông qua đàm phán và mở lại các tuyến đường thương mại quan trọng như eo biển Hormuz, các nhà lãnh đạo Israel lại bày tỏ lo ngại rằng một giải pháp quá sớm có thể cho phép Iran phục hồi và tái thiết lập các năng lực của mình. Các báo cáo cho thấy Israel không hoàn toàn hài lòng với các điều khoản đang được thảo luận và lo sợ rằng việc nới lỏng lệnh trừng phạt cũng như khôi phục xuất khẩu dầu mỏ có thể củng cố kinh tế cho Tehran theo thời gian. Đồng thời, những tranh chấp về sự hiện diện quân sự của Israel ở miền nam Lebanon đã trở thành trở ngại lớn đối với một thỏa thuận hòa bình rộng lớn hơn, khi Iran khăng khăng rằng việc Israel rút quân là cần thiết cho một giải pháp lâu dài."
    },
    {
      en: "The outcome has created a [paradox]{nghịch lý} for Israel. Militarily, the campaign demonstrated Israel’s ability to strike deep inside Iran and coordinate effectively with American forces. Politically, however, the final settlement may leave many of the underlying strategic challenges unresolved. Rather than producing a [decisive]{mang tính quyết định} transformation of the regional balance of power, the war appears to be ending with a fragile ceasefire that postpones many difficult questions for the future. Some regional observers believe Iran emerged weakened but not defeated, while Gulf states have begun reassessing their own security strategies in response to the conflict’s outcome. As a result, what initially appeared to be a major Israeli victory could ultimately be remembered as a \"glorious failure\"—a conflict that delivered impressive battlefield achievements but fell short of achieving its broader political objectives.",
      vi: "Kết quả này đã tạo ra một nghịch lý cho Israel. Về mặt quân sự, chiến dịch đã chứng minh khả năng đánh sâu vào bên trong lãnh thổ Iran và phối hợp hiệu quả với các lực lượng Mỹ của Israel. Tuy nhiên, về mặt chính trị, thỏa thuận cuối cùng có thể để lại nhiều thách thức chiến lược căn bản chưa được giải quyết. Thay vì tạo ra một sự chuyển đổi mang tính quyết định đối với cán cân quyền lực khu vực, cuộc chiến dường như đang kết thúc bằng một lệnh ngừng bắn mong manh nhằm trì hoãn nhiều câu hỏi khó khăn cho tương lai. Một số nhà quan sát khu vực tin rằng Iran bước ra khỏi cuộc chiến ở thế suy yếu nhưng không bị đánh bại, trong khi các quốc gia vùng Vịnh đã bắt đầu đánh giá lại các chiến lược an ninh của riêng họ nhằm phản ứng với kết quả của cuộc xung đột. Hệ quả là, những gì ban đầu có vẻ là một chiến thắng lớn của Israel cuối cùng có thể được ghi nhớ như một \"thất bại vẻ vang\" — một cuộc xung đột mang lại những thành tựu ấn tượng trên chiến trường nhưng không đạt được các mục tiêu chính trị rộng lớn hơn."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/middle-east-and-africa/2026/06/16/the-end-of-the-war-in-iran-threatens-glorious-failure-for-israel",
      source_label: "The Economist",
      title: "The End of the War in Iran Threatens Glorious Failure for Israel",
      title_vi: "Sự kết thúc của cuộc chiến ở Iran đe dọa mang lại một thất bại vẻ vang cho Israel",
      category: "Middle East & Africa",
      category_vi: "Trung Đông & Châu Phi",
      excerpt: "Although Israel achieved military successes against Iran, the emerging ceasefire raises questions about lasting strategic gains.",
      excerpt_vi: "Mặc dù Israel đạt được những thành công quân sự trước Iran, thỏa thuận ngừng bắn mới xuất hiện dấy lên câu hỏi về những lợi ích chiến lược lâu dài.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
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
