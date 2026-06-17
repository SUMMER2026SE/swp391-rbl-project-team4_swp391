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
  console.log("Inserting bilingual article 20 (AI Economists Substack)...");

  const content = [
    {
      en: "The article describes a shift in the centre of gravity of economic thinking about artificial intelligence away from traditional university departments and toward a new group of economists who are deeply engaged with AI labs, tech firms, and policy institutions. These “AI-pilled economists” are portrayed as researchers who treat artificial intelligence not as a [marginal]{bên lề/không đáng kể} topic, but as a potentially transformative force for productivity, labor markets, and economic growth. While academic economists have historically been slow to focus on AI, this group is more directly involved in studying real-world systems, often working inside companies such as OpenAI, Anthropic, and Google DeepMind, or in policy and research institutes closely connected to them.",
      vi: "Bài viết mô tả một sự dịch chuyển trọng tâm của tư duy kinh tế về trí tuệ nhân tạo ra khỏi các khoa đại học truyền thống và hướng tới một nhóm các nhà kinh tế học mới đang gắn kết sâu sắc với các phòng thí nghiệm AI, các công ty công nghệ và các tổ chức chính sách. Các \"nhà kinh tế học say mê AI\" này được khắc họa là những nhà nghiên cứu coi trí tuệ nhân tạo không phải là một chủ đề bên lề, mà là một lực lượng có tiềm năng biến đổi năng suất, thị trường lao động và tăng trưởng kinh tế. Trong khi các nhà kinh tế học hàn lâm trước đây thường chậm tập trung vào AI, nhóm này lại tham gia trực tiếp hơn vào việc nghiên cứu các hệ thống thực tế, thường làm việc bên trong các công ty như OpenAI, Anthropic và Google DeepMind, hoặc trong các viện nghiên cứu và chính sách có mối liên hệ chặt chẽ với các doanh nghiệp này."
    },
    {
      en: "The article argues that mainstream economics has not fully kept pace with the rapid development of AI technologies. Compared with previous shocks like the global financial crisis or the COVID-19 pandemic, AI has produced fewer immediately [observable]{có thể quan sát được} macroeconomic effects in official data, making it harder for academic economists to study using traditional tools. As a result, much of the most influential work on AI economics is now being produced outside universities, where researchers have access to better data, stronger industry connections, and more immediate policy relevance.",
      vi: "Bài viết lập luận rằng kinh tế học chính thống đã không bắt kịp hoàn toàn với sự phát triển nhanh chóng của các công nghệ AI. So với các cú sốc trước đây như cuộc khủng hoảng tài chính toàn cầu hay đại dịch COVID-19, AI tạo ra ít tác động kinh tế vĩ mô có thể quan sát được ngay lập tức trong dữ liệu chính thức, khiến các nhà kinh tế học hàn lâm khó nghiên cứu hơn bằng cách sử dụng các công cụ truyền thống. Kết quả là, nhiều công trình có ảnh hưởng nhất về kinh tế học AI hiện nay đang được tạo ra bên ngoài các trường đại học, nơi các nhà nghiên cứu có quyền tiếp cận dữ liệu tốt hơn, các mối quan hệ chặt chẽ hơn với ngành và tính liên quan chính sách tức thời hơn."
    },
    {
      en: "A central theme of the piece is the growing divide between “AI-curious” economists in academia and those working directly with frontier AI systems. Scholars such as Daron Acemoglu represent a more cautious tradition, often modeling AI as producing modest productivity gains, while others like Tyler Cowen argue that such models underestimate AI’s potential to generate entirely new economic activity. This disagreement reflects deeper uncertainty about whether AI will primarily [substitute]{thay thế} for human labor or create new categories of work and economic value.",
      vi: "Chủ đề trung tâm của bài viết là sự chia rẽ ngày càng tăng giữa các nhà kinh tế học \"tò mò về AI\" trong giới hàn lâm và những người làm việc trực tiếp với các hệ thống AI tiên phong. Các học giả như Daron Acemoglu đại diện cho một truyền thống thận trọng hơn, thường lập mô hình AI tạo ra mức tăng năng suất khiêm tốn, trong khi những người khác như Tyler Cowen lập luận rằng các mô hình như vậy đánh giá thấp tiềm năng của AI trong việc tạo ra hoạt động kinh tế hoàn toàn mới. Sự bất đồng này phản ánh sự bất định sâu sắc hơn về việc liệu AI sẽ chủ yếu thay thế cho lao động của con người hay tạo ra các nhóm công việc và giá trị kinh tế mới."
    },
    {
      en: "The article also highlights how leading economists are increasingly joining AI companies or closely collaborating with them. Examples include Anton Korinek working with Anthropic, Ronnie Chatterji at OpenAI, and Alex Imas at Google DeepMind. These roles give researchers access to [proprietary]{độc quyền} data and direct influence over how AI systems are developed and evaluated. However, this shift raises concerns about potential conflicts of interest and whether economic research inside private firms can remain independent and critical.",
      vi: "Bài viết cũng nêu bật cách các nhà kinh tế học hàng đầu ngày càng tham gia vào các công ty AI hoặc hợp tác chặt chẽ với họ. Các ví dụ bao gồm Anton Korinek làm việc với Anthropic, Ronnie Chatterji tại OpenAI và Alex Imas tại Google DeepMind. Các vai trò này mang lại cho các nhà nghiên cứu quyền tiếp cận dữ liệu độc quyền và ảnh hưởng trực tiếp đến cách các hệ thống AI được phát triển và đánh giá. Tuy nhiên, sự dịch chuyển này dấy lên mối lo ngại về các xung đột lợi ích tiềm ẩn và liệu nghiên cứu kinh tế bên trong các công ty tư nhân có thể duy trì tính độc lập và phản biện hay không."
    },
    {
      en: "Finally, the piece suggests that this migration of talent may reshape the field of economics itself. Research may become more applied, more data-driven, and more tightly integrated with industry priorities, while traditional academic output could decline in relative importance. At the same time, economists inside AI labs may focus more on narrow, practical problems—such as productivity measurement or system evaluation—rather than broad questions about inequality, labor markets, or social welfare. The article concludes that while this new ecosystem may produce faster and more relevant insights about AI, it also risks narrowing the [scope]{phạm vi/quy mô} of independent economic inquiry.",
      vi: "Cuối cùng, bài viết gợi ý rằng sự dịch chuyển tài năng này có thể định hình lại chính lĩnh vực kinh tế học. Nghiên cứu có thể trở nên ứng dụng nhiều hơn, dựa trên dữ liệu nhiều hơn và tích hợp chặt chẽ hơn với các ưu tiên của ngành, trong khi đầu ra học thuật truyền thống có thể giảm đi tầm quan trọng tương đối. Đồng thời, các nhà kinh tế học bên trong các phòng thí nghiệm AI có thể tập trung nhiều hơn vào các vấn đề thực tế, hạn hẹp — chẳng hạn như đo lường năng suất hoặc đánh giá hệ thống — thay vì các câu hỏi rộng lớn về bất bình đẳng, thị trường lao động hay phúc lợi xã hội. Bài viết kết luận rằng mặc dù hệ sinh thái mới này có thể tạo ra các hiểu biết nhanh hơn và phù hợp hơn về AI, nó cũng có nguy cơ thu hẹp phạm vi của cuộc khảo sát kinh tế độc lập."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/finance-and-economics/2026/06/15/meet-the-worlds-top-ai-pilled-economists-substack",
      source_label: "Substack",
      title: "Meet the World’s Top AI-Pilled Economists",
      title_vi: "Gặp gỡ các nhà kinh tế học say mê AI hàng đầu thế giới",
      category: "Finance & Economics",
      category_vi: "Tài chính & Kinh tế",
      excerpt: "The article describes a shift in the centre of gravity of economic thinking about artificial intelligence.",
      excerpt_vi: "Bài viết mô tả một sự dịch chuyển trọng tâm của tư duy kinh tế về trí tuệ nhân tạo.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 20:", data);
}

main().catch(console.error);
