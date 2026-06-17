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
      en: "Iran's Foreign Minister Abbas Araghchi stated that any lasting peace agreement between Iran and the United States would require the [withdrawal]{sự rút quân} of Israeli forces from southern Lebanon, making the issue a central condition in ongoing [diplomatic]{ngoại giao} negotiations. Speaking as discussions continued over a broader framework intended to reduce tensions in the Middle East, Araghchi argued that the [ceasefire]{lệnh ngừng bắn} announced between Washington and Tehran should apply across all fronts, including Lebanon. He warned that any continued Israeli military presence or further attacks inside Lebanese territory would be viewed by Iran as a [violation]{sự vi phạm} of the emerging agreement. The statement highlighted a major point of disagreement between the parties, as Israeli officials insisted that their forces would remain in parts of southern Lebanon for security reasons.",
      vi: "Ngoại trưởng Iran Abbas Araghchi tuyên bố rằng bất kỳ thỏa thuận hòa bình lâu dài nào giữa Iran và Hoa Kỳ sẽ yêu cầu sự rút quân của các lực lượng Israel khỏi miền nam Lebanon, biến vấn đề này thành một điều kiện cốt lõi trong các cuộc đàm phán ngoại giao đang diễn ra. Phát biểu khi các cuộc thảo luận tiếp tục về một khuôn khổ rộng lớn hơn nhằm giảm thiểu căng thẳng ở Trung Đông, ông Araghchi lập luận rằng lệnh ngừng bắn được công bố giữa Washington và Tehran nên được áp dụng trên tất cả các mặt trận, bao gồm cả Lebanon. Ông cảnh báo rằng bất kỳ sự hiện diện quân sự tiếp tục nào của Israel hoặc các cuộc tấn công tiếp theo vào lãnh thổ Lebanon sẽ bị Iran coi là sự vi phạm thỏa thuận đang hình thành. Tuyên bố này đã làm nổi bật một điểm bất đồng lớn giữa các bên, khi các quan chức Israel khẳng định rằng lực lượng của họ sẽ tiếp tục ở lại các khu vực thuộc miền nam Lebanon vì lý do an ninh."
    },
    {
      en: "The [dispute]{cuộc tranh chấp} has complicated efforts to transform the current ceasefire into a more [comprehensive]{toàn diện} [settlement]{thỏa ước} that would address regional security concerns, the future of Iran’s nuclear program, sanctions relief, and the reopening of important trade routes such as the Strait of Hormuz. Meanwhile, Hezbollah signaled support for Iran’s position, arguing that a [durable]{bền vững} peace would be impossible without an Israeli withdrawal.",
      vi: "Cuộc tranh chấp này đã làm phức tạp thêm các nỗ lực chuyển đổi lệnh ngừng bắn hiện tại thành một thỏa ước toàn diện hơn, nhằm giải quyết các mối lo ngại về an ninh khu vực, tương lai của chương trình hạt nhân Iran, việc dỡ bỏ lệnh trừng phạt và mở lại các tuyến đường thương mại quan trọng như eo biển Hormuz. Trong khi đó, Hezbollah đã báo hiệu sự ủng hộ đối với lập trường của Iran, lập luận rằng một nền hòa bình bền vững sẽ là không thể nếu không có sự rút quân của Israel."
    },
    {
      en: "The United States has continued to push for diplomacy and [de-escalation]{sự xuống thang}, but uncertainty remains over whether all parties can agree on the final terms. European governments and regional actors are also closely monitoring the negotiations, concerned that unresolved issues in Lebanon could [undermine]{làm suy yếu} broader efforts to stabilize the region after months of conflict. The debate over Lebanon has therefore emerged as one of the most significant [obstacles]{trở ngại} to a final agreement, illustrating the difficulty of balancing [competing]{đối chọi} security interests while attempting to achieve a lasting peace",
      vi: "Hoa Kỳ tiếp tục thúc đẩy ngoại giao và sự xuống thang căng thẳng, nhưng sự không chắc chắn vẫn còn về việc liệu tất cả các bên có thể đồng ý với các điều khoản cuối cùng hay không. Các chính phủ châu Âu và các bên liên quan trong khu vực cũng đang theo dõi sát sao các cuộc đàm phán, lo ngại rằng các vấn đề chưa được giải quyết ở Lebanon có thể làm suy yếu các nỗ lực rộng lớn hơn nhằm ổn định khu vực sau nhiều tháng xung đột. Do đó, cuộc tranh luận về Lebanon đã nổi lên như một trong những trở ngại lớn nhất đối với một thỏa thuận cuối cùng, minh chứng cho sự khó khăn trong việc cân bằng các lợi ích an ninh đối chọi nhau trong khi cố gắng đạt được một nền hòa bình lâu dài."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "the-atlantic",
      source_url: "https://www.theguardian.com/world/2026/jun/16/irans-top-envoy-says-peace-deal-with-the-us-dependent-on-israels-withdrawal-from-lebanon",
      source_label: "The Guardian",
      title: "Iran's top envoy says peace deal with the US dependent on Israel's withdrawal from Lebanon",
      title_vi: "Đặc phái viên hàng đầu của Iran tuyên bố thỏa thuận hòa bình với Mỹ phụ thuộc vào việc Israel rút quân khỏi Lebanon",
      category: "Politics",
      category_vi: "Chính trị",
      excerpt: "Iran's Foreign Minister Abbas Araghchi stated that any lasting peace agreement with the US would require the withdrawal of Israeli forces from southern Lebanon.",
      excerpt_vi: "Ngoại trưởng Iran Abbas Araghchi tuyên bố rằng bất kỳ thỏa thuận hòa bình lâu dài nào với Mỹ sẽ yêu cầu sự rút quân của lực lượng Israel khỏi miền nam Lebanon.",
      author: "Patrick Wintour",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=1200&q=80",
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
