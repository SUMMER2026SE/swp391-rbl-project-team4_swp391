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
  console.log("Inserting bilingual article 17 (Intelligence Explosion)...");

  const content = [
    {
      en: "Leopold Aschenbrenner argues that humanity is approaching an unprecedented period of technological change driven by artificial intelligence and that governments, institutions, and societies remain dangerously unprepared for its consequences. According to his analysis, advances in AI are progressing much faster than most policymakers and members of the public realize. He suggests that the world may soon experience an “intelligence explosion,” a process in which AI systems become capable of performing an increasingly wide range of [cognitive]{nhận thức} tasks at levels comparable to or exceeding those of highly skilled humans. Unlike previous technological revolutions, which primarily automated physical labor, advanced AI has the potential to transform intellectual work itself, affecting fields such as science, engineering, medicine, finance, education, and national security.",
      vi: "Leopold Aschenbrenner lập luận rằng nhân loại đang tiếp cận một thời kỳ thay đổi công nghệ chưa từng có do trí tuệ nhân tạo thúc đẩy và các chính phủ, thể chế cũng như xã hội vẫn chưa có sự chuẩn bị một cách nguy hại trước những hậu quả của nó. Theo phân tích của ông, những tiến bộ trong AI đang tiến triển nhanh hơn nhiều so với những gì hầu hết các nhà hoạch định chính sách và công chúng nhận ra. Ông gợi ý rằng thế giới có thể sớm trải qua một \"sự bùng nổ trí tuệ\", một quá trình mà các hệ thống AI trở nên có khả năng thực hiện một loạt các nhiệm vụ nhận thức ngày càng rộng ở các mức độ tương đương hoặc vượt trội hơn cả những con người có kỹ năng cao. Không giống như các cuộc cách mạng công nghệ trước đây vốn chủ yếu tự động hóa lao động chân tay, AI tiên tiến có tiềm năng biến đổi chính công việc trí óc, ảnh hưởng đến các lĩnh vực như khoa học, kỹ thuật, y học, tài chính, giáo dục và an ninh quốc gia."
    },
    {
      en: "The article argues that many current discussions about artificial intelligence underestimate the speed at which progress could occur. Aschenbrenner points to rapid improvements in computing power, algorithm design, and the availability of training data as factors that could accelerate the development of increasingly capable systems. If these trends continue, AI may become a major driver of economic growth and scientific discovery, potentially generating [breakthroughs]{các bước đột phá} that would otherwise take decades to achieve. At the same time, such developments could create enormous [disruptions]{sự gián đoạn/sự hỗn loạn} in labor markets as machines begin performing tasks traditionally reserved for highly educated professionals. Entire industries may need to adapt to a world in which intelligence itself becomes [abundant]{dồi dào/phong phú} and inexpensive.",
      vi: "Bài báo lập luận rằng nhiều cuộc thảo luận hiện nay về trí tuệ nhân tạo đang đánh giá thấp tốc độ phát triển có thể xảy ra. Aschenbrenner chỉ ra những cải tiến nhanh chóng về sức mạnh tính toán, thiết kế thuật toán và tính khả dụng của dữ liệu đào tạo là các yếu tố có thể đẩy nhanh sự phát triển của các hệ thống ngày càng có năng lực cao. Nếu những xu hướng này tiếp tục, AI có thể trở thành động lực chính cho tăng trưởng kinh tế và khám phá khoa học, có khả năng tạo ra các bước đột phá mà nếu không có nó sẽ phải mất hàng thập kỷ mới đạt được. Đồng thời, những phát triển như vậy có thể tạo ra những gián đoạn to lớn trong thị trường lao động khi máy móc bắt đầu thực hiện các nhiệm vụ vốn được dành riêng cho các chuyên gia có trình độ học vấn cao. Toàn bộ các ngành công nghiệp có thể cần phải thích ứng với một thế giới mà bản thân trí tuệ trở nên dồi dào và rẻ tiền."
    },
    {
      en: "A major focus of the essay is the geopolitical competition surrounding advanced AI. Aschenbrenner warns that countries increasingly view artificial intelligence as a strategic technology with implications for military power, economic dominance, and national security. He argues that rivalry between major powers, particularly the United States and China, could encourage rapid deployment of powerful AI systems before adequate safety measures are in place. This creates a difficult balance between maintaining technological leadership and ensuring that increasingly capable systems remain controllable and aligned with human interests. The author contends that governments have not yet developed institutions capable of managing these risks effectively.",
      vi: "Trọng tâm lớn của bài tiểu luận là sự cạnh tranh địa chính trị xung quanh AI tiên tiến. Aschenbrenner cảnh báo rằng các nước ngày càng xem trí tuệ nhân tạo là một công nghệ chiến lược có ảnh hưởng lớn đến sức mạnh quân sự, sự thống trị kinh tế và an ninh quốc gia. Ông lập luận rằng sự đối đầu giữa các cường quốc, đặc biệt là Hoa Kỳ và Trung Quốc, có thể khuyến khích việc triển khai nhanh chóng các hệ thống AI mạnh mẽ trước khi các biện pháp an toàn đầy đủ được thiết lập. Điều này tạo ra một thế cân bằng khó khăn giữa việc duy trì vị thế dẫn đầu về công nghệ và đảm bảo rằng các hệ thống ngày càng có năng lực cao vẫn có thể kiểm soát được và phù hợp với lợi ích của con người. Tác giả cho rằng các chính phủ vẫn chưa phát triển được các thể chế có khả năng quản lý những rủi ro này một cách hiệu quả."
    },
    {
      en: "The article also highlights concerns about governance and preparedness. Existing political systems, regulatory frameworks, and international organizations were largely designed for a slower pace of technological change and may struggle to respond to developments that occur over months rather than decades. Aschenbrenner suggests that societies need to invest more heavily in AI safety research, strategic planning, and international cooperation before transformative systems become reality. Waiting until such technologies have already arrived could leave governments with little time to respond to their economic, social, and security implications.",
      vi: "Bài báo cũng nhấn mạnh các mối lo ngại về quản trị và mức độ chuẩn bị sẵn sàng. Các hệ thống chính trị, khung pháp lý và tổ chức quốc tế hiện tại phần lớn được thiết kế cho tốc độ thay đổi công nghệ chậm hơn và có thể gặp khó khăn trong việc ứng phó với các phát triển diễn ra trong vòng vài tháng thay vì hàng thập kỷ. Aschenbrenner gợi ý rằng các xã hội cần đầu tư mạnh mẽ hơn vào nghiên cứu an toàn AI, quy hoạch chiến lược và hợp tác quốc tế trước khi các hệ thống mang tính biến đổi này trở thành hiện thực. Việc chờ đợi cho đến khi các công nghệ đó đã xuất hiện có thể để lại cho các chính phủ rất ít thời gian để ứng phó với các tác động kinh tế, xã hội và an ninh của chúng."
    },
    {
      en: "Ultimately, the essay presents the coming age of advanced artificial intelligence as both an extraordinary opportunity and a profound challenge. The intelligence explosion could unlock immense prosperity, accelerate scientific progress, and solve problems that have long resisted human efforts. However, it could also create instability, concentration of power, geopolitical conflict, and governance failures if societies remain unprepared. Aschenbrenner concludes that the greatest risk may not be the technology itself but humanity’s failure to anticipate and manage a transformation that could arrive much sooner than many people expect.",
      vi: "Cuối cùng, bài tiểu luận trình bày kỷ nguyên sắp tới của trí tuệ nhân tạo tiên tiến vừa là một cơ hội phi thường vừa là một thách thức sâu sắc. Sự bùng nổ trí tuệ có thể mở khóa sự thịnh vượng to lớn, đẩy nhanh tiến trình khoa học và giải quyết những vấn đề từ lâu đã thách thức các nỗ lực của con người. Tuy nhiên, nó cũng có thể tạo ra sự bất ổn, tập trung quyền lực, xung đột địa chính trị và thất bại trong quản trị nếu các xã hội vẫn chưa sẵn sàng. Aschenbrenner kết luận rằng rủi ro lớn nhất có thể không phải là bản thân công nghệ mà là sự thất bại của nhân loại trong việc dự báo và quản lý một sự chuyển đổi có thể đến sớm hơn nhiều so với mong đợi của nhiều người."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/by-invitation/2026/06/15/humanity-isnt-ready-for-the-coming-intelligence-explosion",
      source_label: "The Economist",
      title: "Humanity Isn’t Ready for the Coming Intelligence Explosion",
      title_vi: "Nhân loại chưa sẵn sàng cho sự bùng nổ trí tuệ sắp tới",
      category: "By Invitation",
      category_vi: "Lời mời diễn đàn",
      excerpt: "Leopold Aschenbrenner warns that humanity is approaching an intelligence explosion and is unprepared.",
      excerpt_vi: "Leopold Aschenbrenner cảnh báo nhân loại đang tiến gần đến sự bùng nổ trí tuệ mà không có sự chuẩn bị.",
      author: "Leopold Aschenbrenner",
      read_time: "5 mins",
      image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 17:", data);
}

main().catch(console.error);
