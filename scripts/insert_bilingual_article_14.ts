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
  console.log("Inserting bilingual article 14 (War on Terror)...");

  const content = [
    {
      en: "Rosa Brooks argues that the political and legal changes introduced after the September 11 attacks gradually weakened many of the democratic safeguards that had previously [constrained]{ràng buộc/hạn chế} executive power in the United States. In response to terrorism, successive administrations expanded surveillance programs, increased secrecy within government, broadened presidential authority, and normalized [emergency]{khẩn cấp} powers that were originally justified as temporary measures. Over time, these practices became embedded within the American political system, making extraordinary powers appear ordinary and reducing public resistance to executive overreach. Brooks contends that the War on Terror reshaped the relationship between citizens and the state by encouraging a culture of fear, national-security exceptionalism, and [deference]{sự tôn trọng/sự tôn kính/sự phục tùng} to powerful institutions.",
      vi: "Rosa Brooks lập luận rằng những thay đổi chính trị và pháp lý được đưa ra sau cuộc tấn công ngày 11 tháng 9 đã dần làm suy yếu nhiều biện pháp bảo vệ dân chủ vốn trước đây đã hạn chế quyền lực hành pháp ở Hoa Kỳ. Để ứng phó với chủ nghĩa khủng bố, các chính quyền kế tiếp nhau đã mở rộng các chương trình giám sát, gia tăng tính bảo mật trong chính phủ, mở rộng quyền hạn của tổng thống và bình thường hóa các quyền lực khẩn cấp vốn ban đầu được biện minh là các biện pháp tạm thời. Theo thời gian, những thông lệ này đã bám rễ sâu vào hệ thống chính trị Hoa Kỳ, khiến các quyền lực phi thường có vẻ như bình thường và làm giảm sự phản kháng của công chúng đối với sự lạm quyền của hành pháp. Brooks cho rằng Cuộc chiến chống khủng bố đã định hình lại mối quan hệ giữa công dân và nhà nước bằng cách khuyến khích một nền văn hóa sợ hãi, chủ nghĩa ngoại lệ về an ninh quốc gia và sự phục tùng đối với các thể chế quyền lực."
    },
    {
      en: "According to the article, the effects of these policies extended far beyond counterterrorism. Legal justifications created to fight terrorism were later available for use in other contexts, while expanded surveillance capabilities and U.S. executive [discretion]{quyền tự quyết/quyền quyết định} established precedents that future leaders could exploit. Brooks argues that many Americans became accustomed to restrictions that would once have generated significant opposition because they were presented as necessary for public safety. The result was a gradual [erosion]{sự xói mòn/sự bào mòn} of norms designed to limit government power, even as formal democratic institutions remained intact.",
      vi: "Theo bài báo, tác động của những chính sách này đã vượt xa khỏi phạm vi chống khủng bố. Các cơ sở pháp lý được tạo ra để chống khủng bố sau đó đã có sẵn để sử dụng trong các bối cảnh khác, trong khi khả năng giám sát mở rộng và quyền tự quyết rộng rãi của hành pháp Hoa Kỳ đã thiết lập những tiền lệ mà các nhà lãnh đạo tương lai có thể khai thác. Brooks lập luận rằng nhiều người Mỹ đã quen với những hạn chế vốn từng gây ra sự phản đối đáng kể bởi vì chúng được trình bày là cần thiết cho an toàn công cộng. Kết quả là sự xói mòn dần các chuẩn mực được thiết kế để giới hạn quyền lực của chính phủ, ngay cả khi các thể chế dân chủ chính thức vẫn còn nguyên vẹn."
    },
    {
      en: "The essay draws a connection between the post-9/11 era and contemporary concerns about democratic backsliding in the United States. Brooks suggests that the road from the War on Terror to the political crises of recent years was not accidental but the consequence of decisions that concentrated authority in the executive branch and weakened traditional checks and balances. She argues that autocratic tendencies rarely emerge suddenly; instead, they often develop through a series of [incremental]{gia tăng dần/từng bước một} changes adopted during moments of crisis. By accepting expanded state powers in the name of security, Americans may have unintentionally created conditions that made authoritarian politics more feasible in the future.",
      vi: "Bài tiểu luận rút ra mối liên hệ giữa kỷ nguyên hậu 11/9 và những lo ngại đương đại về sự suy thoái dân chủ ở Hoa Kỳ. Brooks gợi ý rằng con đường dẫn từ Cuộc chiến chống khủng bố đến các cuộc khủng hoảng chính trị trong những năm gần đây không phải là ngẫu nhiên mà là hậu quả của những quyết định tập trung quyền lực vào nhánh hành pháp và làm suy yếu các cơ chế kiểm soát và số dư truyền thống. Bà lập luận rằng các khuynh hướng chuyên chế hiếm khi xuất hiện đột ngột; thay vào đó, chúng thường phát triển thông qua một loạt các thay đổi gia tăng dần được thông qua trong những thời điểm khủng hoảng. Bằng cách chấp nhận các quyền lực nhà nước mở rộng dưới danh nghĩa an ninh, người Mỹ có thể đã vô tình tạo ra các điều kiện làm cho nền chính trị độc tài trở nên khả thi hơn trong tương lai."
    },
    {
      en: "Ultimately, Brooks warns that preserving democracy requires more than holding elections. It also depends on maintaining institutional restraints, protecting civil liberties, and resisting the temptation to sacrifice constitutional principles during periods of fear and uncertainty. The article concludes that the lessons of the War on Terror should serve as a warning about how democracies can gradually undermine themselves when emergency powers become permanent features of governance.",
      vi: "Cuối cùng, Brooks cảnh báo rằng việc bảo tồn nền dân chủ đòi hỏi nhiều hơn là chỉ tổ chức bầu cử. Nó còn phụ thuộc vào việc duy trì các ràng buộc thể chế, bảo vệ quyền tự do dân sự và chống lại sự cám dỗ hy sinh các nguyên tắc hiến pháp trong các thời kỳ sợ hãi và bất định. Bài báo kết luận rằng các bài học từ Cuộc chiến chống khủng bố nên đóng vai trò như một lời cảnh báo về việc các nền dân chủ có thể dần tự hủy hoại bản thân như thế nào khi các quyền lực khẩn cấp trở thành những đặc điểm lâu dài của quản trị."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/by-invitation/2026/06/02/how-the-war-on-terror-primed-america-for-autocracy",
      source_label: "The Economist",
      title: "How the War on Terror Primed America for Autocracy",
      title_vi: "Cuộc chiến chống khủng bố đã dọn đường cho chế độ độc tài ở Mỹ như thế nào",
      category: "By Invitation",
      category_vi: "Lời mời diễn đàn",
      excerpt: "Rosa Brooks argues that the changes after 9/11 gradually weakened the democratic safeguards in the United States.",
      excerpt_vi: "Rosa Brooks lập luận rằng những thay đổi sau sự kiện 11/9 đã dần làm suy yếu các lá chắn bảo vệ nền dân chủ tại Hoa Kỳ.",
      author: "Rosa Brooks",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 14:", data);
}

main().catch(console.error);
