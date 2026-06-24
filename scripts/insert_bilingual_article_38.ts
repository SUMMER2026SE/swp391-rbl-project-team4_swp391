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
  console.log("Inserting bilingual article 38 (NYT Chronotype)...");

  const content = [
    {
      en: "The article introduces the concept of chronotype, which describes a person’s natural preference for sleep and wake timing, and explains how it may shape daily energy patterns, productivity, and overall health. It presents the idea that people are not all biologically aligned with the same schedule—some naturally feel alert in the morning, while others peak later in the day or have [irregular]{bất thường/không đều đặn} rhythms.",
      vi: "Bài viết giới thiệu khái niệm chronotype (kiểu thời gian sinh học), mô tả xu hướng tự nhiên của một người đối với thời gian ngủ và thức, và giải thích cách nó có thể định hình các mức năng lượng hàng ngày, năng suất và sức khỏe tổng thể. Nó đưa ra ý tưởng rằng mọi người không hoàn toàn đồng nhất về mặt sinh học với cùng một lịch trình — một số người tự nhiên cảm thấy tỉnh táo vào buổi sáng, khi những người khác đạt trạng thái đỉnh cao muộn hơn trong ngày hoặc có nhịp sinh học bất thường."
    },
    {
      en: "A key focus is the growing interest in [categorizing]{phân loại} chronotypes beyond the simple “morning person” or “night owl” distinction. The article describes popular models that divide people into groups such as lions (early risers), bears (steady daytime rhythm), wolves (evening types), and dolphins (light or irregular sleepers). These categories are meant to help individuals better understand their internal body clock and adjust their routines accordingly.",
      vi: "Một trọng tâm chính là sự quan tâm ngày càng tăng đối với việc phân loại các kiểu thời gian sinh học vượt ra ngoài sự phân biệt đơn giản giữa \"người buổi sáng\" hay \"cú đêm\". Bài viết mô tả các mô hình phổ biến chia mọi người thành các nhóm như sư tử (người dậy sớm), gấu (nhịp độ ban ngày ổn định), sói (kiểu buổi tối) và cá heo (người ngủ chập chờn hoặc không đều đặn). Các danh mục này nhằm giúp các cá nhân hiểu rõ hơn về đồng hồ sinh học bên trong cơ thể họ và điều chỉnh thói quen của họ cho phù hợp."
    },
    {
      en: "The piece also discusses the chronotype quiz, which is designed to help readers identify their own sleep pattern based on questions about alertness, preferred sleep times, and energy fluctuations throughout the day. While not a medical [diagnostic]{chẩn đoán} tool, the quiz is presented as a way to reflect on habits that may otherwise go unnoticed, especially in relation to sleep quality and daytime performance.",
      vi: "Bài viết cũng thảo luận về bài trắc nghiệm chronotype, được thiết kế để giúp người đọc xác định mô hình giấc ngủ của chính họ dựa trên các câu hỏi về sự tỉnh táo, thời gian ngủ ưa thích và sự dao động năng lượng trong suốt cả ngày. Mặc dù không phải là một công cụ chẩn đoán y tế, bài trắc nghiệm được trình bày như một cách để phản ánh các thói quen có thể bị bỏ qua, đặc biệt là liên quan đến chất lượng giấc ngủ và hiệu suất ban ngày."
    },
    {
      en: "Experts quoted in the article explain that chronotype is linked to the body’s circadian rhythm, a biological system that regulates hormones, alertness, and metabolism over a roughly 24-hour cycle. Genetics plays a role in determining chronotype, but so do age, lifestyle, and environmental factors such as light exposure and work schedules. The article notes that teenagers tend to shift later in their sleep timing, while older adults often become more morning-oriented.",
      vi: "Các chuyên gia được trích dẫn trong bài viết giải thích rằng chronotype có liên quan đến nhịp sinh học của cơ thể, một hệ thống sinh học điều hòa hormone, sự tỉnh táo và trao đổi chất trong một chu kỳ khoảng 24 giờ. Di truyền đóng một vai trò trong việc quyết định chronotype, nhưng tuổi tác, lối sống và các yếu tố môi trường như tiếp xúc với ánh sáng và lịch làm việc cũng vậy. Bài viết lưu ý rằng thanh thiếu niên có xu hướng dịch chuyển thời gian ngủ muộn hơn, khi người lớn tuổi thường hướng về buổi sáng nhiều hơn."
    },
    {
      en: "Finally, the article highlights why understanding chronotype matters: when people live in [alignment]{sự thẳng hàng/sự căn chỉnh/sự đồng nhất} with their natural rhythm, they may experience better sleep, improved concentration, and higher productivity. However, mismatches between biological timing and social obligations—such as school or work schedules—can lead to fatigue and reduced well-being, a phenomenon sometimes referred to as “social jet lag.”",
      vi: "Cuối cùng, bài viết nhấn mạnh lý do tại sao việc hiểu chronotype lại quan trọng: khi mọi người sống đồng nhất với nhịp điệu tự nhiên của họ, họ có thể trải nghiệm giấc ngủ tốt hơn, cải thiện sự tập trung và năng suất cao hơn. Tuy nhiên, sự mất cân đối giữa thời gian sinh học và các nghĩa vụ xã hội — chẳng hạn như lịch học hoặc lịch làm việc — có thể dẫn đến mệt mỏi và giảm thể trạng khỏe mạnh, một hiện tượng đôi khi được gọi là \"lệch múi giờ xã hội\" (social jet lag)."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "the-new-york-times",
      source_url: "https://www.nytimes.com/2026/06/15/well/mind/do-you-wake-up-same-time-chronotype-nyt-well",
      source_label: "The New York Times",
      title: "Do You Wake Up at the Same Time Every Day? Your Chronotype May Explain Why",
      title_vi: "Bạn có thức dậy vào cùng một thời điểm mỗi ngày? Chronotype của bạn có thể giải thích lý do",
      category: "Well",
      category_vi: "Sức khỏe",
      excerpt: "Your natural preference for sleep and wake timing, known as chronotype, shapes your daily energy.",
      excerpt_vi: "Xu hướng tự nhiên đối với thời gian ngủ và thức, gọi là chronotype, định hình năng lượng hàng ngày của bạn.",
      author: "Amanda Chan",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1511295742364-92767fa62d9f?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 38:", data);
}

main().catch(console.error);
