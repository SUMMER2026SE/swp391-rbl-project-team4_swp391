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
  console.log("Inserting bilingual article 13 (Trump's Blocking of Anthropic)...");

  const content = [
    {
      en: "The Trump administration’s decision to restrict access to Anthropic’s most advanced artificial intelligence models has triggered widespread concern across the technology industry, financial markets, and among U.S. allies. The government ordered Anthropic to prevent foreign nationals from accessing its latest frontier AI systems, known as Fable 5 and Mythos 5, citing national security concerns and the possibility that the models could be used to identify software [vulnerabilities]{lỗ hổng bảo mật/điểm yếu} or bypass cybersecurity protections. Because the restrictions applied broadly to foreign users, including some employees and customers, Anthropic responded by suspending access to the models entirely rather than attempting to implement a complex system of selective exclusions. The move shocked many governments and businesses that had expected continued access to technology widely considered among the most advanced AI systems available today.",
      vi: "Quyết định hạn chế quyền truy cập vào các mô hình trí tuệ nhân tạo tiên tiến nhất của Anthropic của chính quyền Trump đã dấy lên mối lo ngại rộng rãi trong toàn ngành công nghệ, thị trường tài chính và giữa các đồng minh của Mỹ. Chính phủ đã yêu cầu Anthropic ngăn cản các công dân nước ngoài truy cập vào các hệ thống AI tiên tiến nhất của mình, được gọi là Fable 5 và Mythos 5, với lý do lo ngại về an ninh quốc gia và khả năng các mô hình này có thể được sử dụng để xác định các lỗ hổng bảo mật phần mềm hoặc vượt qua các biện pháp bảo vệ an ninh mạng. Vì các lệnh hạn chế này áp dụng rộng rãi cho người dùng nước ngoài, bao gồm cả một số nhân viên và khách hàng, Anthropic đã phản ứng bằng cách tạm dừng hoàn toàn quyền truy cập vào các mô hình này thay vì cố gắng triển khai một hệ thống phức tạp để loại trừ có chọn lọc. Động thái này đã gây sốc cho nhiều chính phủ và doanh nghiệp vốn mong đợi tiếp tục được tiếp cận công nghệ được coi là một trong những hệ thống AI tiên tiến nhất hiện nay."
    },
    {
      en: "Critics argue that the administration’s actions appeared [abrupt]{đột ngột/bất ngờ}, poorly explained, and inconsistent with its previous promises to reduce regulatory barriers for AI innovation. Industry observers noted that the restrictions were introduced with little warning and without a transparent regulatory framework, creating uncertainty for companies investing heavily in artificial intelligence. Some analysts also questioned whether the stated security concerns justified such [sweeping]{sâu rộng/bao quát/triệt để} measures, arguing that similar technical vulnerabilities can often be found in competing AI systems. The controversy has intensified because Anthropic has previously clashed with the administration over issues related to military applications of AI and government oversight, leading some observers to suspect that political tensions may have influenced the decision.",
      vi: "Những người chỉ trích lập luận rằng các hành động của chính quyền tỏ ra đột ngột, thiếu giải thích rõ ràng và không nhất quán với những lời hứa trước đó về việc giảm thiểu các rào cản pháp lý cho sự đổi mới AI. Các nhà quan sát trong ngành lưu ý rằng các lệnh hạn chế được đưa ra mà không có nhiều cảnh báo trước và thiếu một khung pháp lý minh bạch, tạo ra sự không chắc chắn cho các công ty đang đầu tư mạnh vào trí tuệ nhân tạo. Một số nhà phân tích cũng đặt câu hỏi liệu các mối lo ngại về an ninh được nêu ra có đủ để biện minh cho các biện pháp sâu rộng như vậy hay không, khi cho rằng các lỗ hổng kỹ thuật tương tự thường có thể được tìm thấy trong các hệ thống AI của đối thủ cạnh tranh. Cuộc tranh luận ngày càng gay gắt vì Anthropic trước đây đã từng đụng độ với chính quyền về các vấn đề liên quan đến ứng dụng quân sự của AI và sự giám sát của chính phủ, khiến một số nhà quan sát nghi ngờ rằng những căng thẳng chính trị có thể đã ảnh hưởng đến quyết định này."
    },
    {
      en: "The consequences extend beyond the United States. European governments, technology companies, and policy experts have expressed alarm that Washington is increasingly treating advanced AI models as strategic assets comparable to sensitive military technologies. Many fear that sudden export restrictions could encourage countries to accelerate efforts to develop independent AI ecosystems rather than relying on American firms. The episode has also revived debates about how powerful AI systems should be regulated and whether decisions of this [magnitude]{tầm quan trọng/quy mô/cường độ} should be made through established legislation and independent oversight rather than executive action. Supporters of the restrictions argue that frontier AI models pose genuine national-security risks and require stronger safeguards, while opponents warn that unpredictable government intervention could undermine trust in American technology leadership and damage international partnerships.",
      vi: "Các hậu quả lan rộng ra ngoài biên giới Hoa Kỳ. Các chính phủ châu Âu, các công ty công nghệ và các chuyên gia chính sách đã bày tỏ sự báo động rằng Washington đang ngày càng coi các mô hình AI tiên tiến là tài sản chiến lược tương đương với các công nghệ quân sự nhạy cảm. Nhiều người lo ngại rằng các lệnh hạn chế xuất khẩu đột ngột có thể thúc đẩy các nước đẩy nhanh nỗ lực phát triển các hệ sinh thái AI độc lập thay vì phụ thuộc vào các công ty Mỹ. Sự kiện này cũng làm sống lại các cuộc tranh luận về cách thức quản lý các hệ thống AI mạnh mẽ và liệu các quyết định có tầm quan trọng lớn như vậy có nên được thực hiện thông qua luật pháp đã được ban hành và sự giám sát độc lập thay vì hành động hành pháp hay không. Những người ủng hộ các lệnh hạn chế lập luận rằng các mô hình AI tiên tiến đặt ra các rủi ro an ninh quốc gia thực sự và đòi hỏi các biện pháp bảo vệ mạnh mẽ hơn, trong khi những người phản đối cảnh báo rằng sự can thiệp không thể lường trước của chính phủ có thể làm giảm lòng tin vào vị thế dẫn đầu công nghệ của Mỹ và gây tổn hại đến các mối quan hệ đối tác quốc tế."
    },
    {
      en: "Ultimately, the dispute illustrates the growing challenge of balancing innovation, security, and global competitiveness in the age of artificial intelligence. While governments increasingly recognize that advanced AI systems may have strategic importance, the Anthropic case demonstrates how difficult it can be to regulate rapidly evolving technologies without creating uncertainty and unintended economic consequences. The controversy is likely to influence future debates about AI governance, export controls, and the role governments should play in determining who can access the most powerful digital tools.",
      vi: "Cuối cùng, cuộc tranh chấp minh họa cho thách thức ngày càng tăng trong việc cân bằng giữa đổi mới, an ninh và năng lực cạnh tranh toàn cầu trong kỷ nguyên trí tuệ nhân tạo. Trong khi các chính phủ ngày càng nhận thức được rằng các hệ thống AI tiên tiến có thể có tầm quan trọng chiến lược, trường hợp của Anthropic cho thấy việc quản lý các công nghệ phát triển nhanh chóng khó khăn như thế nào nếu không muốn tạo ra sự không chắc chắn và các hậu quả kinh tế ngoài ý muốn. Cuộc tranh cãi này có thể sẽ ảnh hưởng đến các cuộc thảo luận trong tương lai về quản lý AI, kiểm soát xuất khẩu và vai trò mà các chính phủ nên đảm nhận trong việc xác định ai có thể tiếp cận các công cụ kỹ thuật số mạnh mẽ nhất."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/business/2026/06/14/donald-trumps-blocking-of-anthropic-is-capricious-and-chaotic",
      source_label: "The Economist",
      title: "Donald Trump’s Blocking of Anthropic Is Capricious and Chaotic",
      title_vi: "Việc Donald Trump chặn Anthropic là thất thường và hỗn loạn",
      category: "Business",
      category_vi: "Kinh doanh",
      excerpt: "The Trump administration’s decision to restrict access to Anthropic's advanced AI models has triggered widespread concern.",
      excerpt_vi: "Quyết định hạn chế quyền truy cập vào các mô hình AI tiên tiến của Anthropic của chính quyền Trump đã dấy lên mối lo ngại rộng rãi.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 13:", data);
}

main().catch(console.error);
