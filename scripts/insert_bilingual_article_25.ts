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
  console.log("Inserting bilingual article 25 (Did AI Write This)...");

  const content = [
    {
      en: "The article examines whether artificial intelligence may have played a role in producing written journalism, using The Economist itself as a case study for how difficult it is to reliably detect machine-generated text. It explores the growing challenge facing readers, editors, and researchers as AI systems become capable of producing [fluent]{trôi chảy/lưu loát}, structured, and stylistically consistent articles that closely resemble human-written content. The central idea is that as generative AI improves, the boundary between human and machine writing becomes increasingly blurred, making traditional assumptions about [authorship]{quyền tác giả} harder to sustain.",
      vi: "Bài viết xem xét liệu trí tuệ nhân tạo có thể đã đóng một vai trò nào đó trong việc sản xuất báo chí viết hay không, sử dụng chính tờ The Economist làm nghiên cứu điển hình cho thấy mức độ khó khăn để phát hiện văn bản do máy tạo ra một cách đáng tin cậy. Bài viết khám phá thách thức ngày càng tăng mà độc giả, biên tập viên và các nhà nghiên cứu phải đối mặt khi các hệ thống AI trở nên có khả năng tạo ra các bài báo trôi chảy, có cấu trúc và nhất quán về mặt phong cách giống hệt nội dung do con người viết. Ý tưởng cốt lõi là khi AI tạo sinh cải thiện, ranh giới giữa bài viết của con người và máy móc ngày càng trở nên mờ nhạt, khiến các giả định truyền thống về quyền tác giả trở nên khó duy trì hơn."
    },
    {
      en: "The piece highlights that modern AI models can already generate long-form articles that are grammatically correct, logically structured, and stylistically similar to professional journalism. Because of this, [superficial]{hời hợt/nông cạn/bề ngoài} indicators such as tone, coherence, or vocabulary are no longer reliable signals of whether a human or a machine produced a text. Even expert readers can struggle to distinguish between the two, especially when AI-generated content is lightly edited or combined with human writing. This raises broader questions about transparency in media and the need for clearer [disclosure]{sự công bố/sự tiết lộ} standards in journalism.",
      vi: "Bài viết nhấn mạnh rằng các mô hình AI hiện đại đã có thể tạo ra các bài báo dạng dài đúng ngữ pháp, có cấu trúc logic và phong cách tương tự như báo chí chuyên nghiệp. Vì lý do này, các chỉ số bề ngoài như giọng điệu, tính mạch lạc hoặc từ vựng không còn là dấu hiệu đáng tin cậy để xác định con người hay máy móc đã tạo ra văn bản. Ngay cả những độc giả chuyên gia cũng có thể gặp khó khăn trong việc phân biệt giữa hai bên, đặc biệt là khi nội dung do AI tạo ra được biên tập nhẹ hoặc kết hợp với bài viết của con người. Điều này đặt ra những câu hỏi rộng lớn hơn về tính minh bạch trên truyền thông và nhu cầu về các tiêu chuẩn công bố rõ ràng hơn trong báo chí."
    },
    {
      en: "The article also discusses the limitations of current AI detection tools, which attempt to identify machine-generated text using statistical patterns. These tools are often unreliable, producing both false positives and false negatives, particularly as AI models become more advanced and their outputs more diverse. As a result, there is growing [skepticism]{sự hoài nghi} about whether it is even possible to build a dependable system for identifying AI-written content purely from linguistic features.",
      vi: "Bài báo cũng thảo luận về những hạn chế của các công cụ phát hiện AI hiện tại, vốn cố gắng xác định văn bản do máy tạo ra bằng cách sử dụng các mô hình thống kê. Các công cụ này thường không đáng tin cậy, tạo ra cả kết quả dương tính giả và âm tính giả, đặc biệt khi các mô hình AI ngày càng trở nên tiên tiến hơn và đầu ra của chúng đa dạng hơn. Do đó, ngày càng có nhiều sự hoài nghi về việc liệu có khả năng xây dựng một hệ thống đáng tin cậy để xác định nội dung do AI viết chỉ từ các đặc điểm ngôn ngữ hay không."
    },
    {
      en: "Beyond detection, the article reflects on the implications for trust in information. If readers cannot reliably determine whether a text was written by a human or an AI, it could affect how news is consumed and how credibility is assigned to different sources. This concern extends beyond journalism to academic writing, online content, and professional communication more broadly. The potential for AI-generated text to be used at scale also raises questions about misinformation, automation in media production, and the future role of human writers.",
      vi: "Bên cạnh việc phát hiện, bài viết phản ánh về những tác động đối với lòng tin vào thông tin. Nếu độc giả không thể xác định một cách đáng tin cậy liệu một văn bản được viết bởi con người hay AI, điều đó có thể ảnh hưởng đến cách tiêu dùng tin tức và cách phân bổ uy tín cho các nguồn khác nhau. Mối lo ngại này vượt ra ngoài phạm vi báo chí để chuyển sang các bài viết học thuật, nội dung trực tuyến và truyền thông chuyên nghiệp rộng rãi hơn. Tiềm năng của văn bản do AI tạo ra được sử dụng trên quy mô lớn cũng đặt ra các câu hỏi về thông tin sai lệch, tự động hóa trong sản xuất truyền thông và vai trò tương lai của các cây viết là con người."
    },
    {
      en: "Ultimately, the article suggests that the question “did AI write this?” may become increasingly difficult to answer with certainty. Rather than relying on detection alone, the focus may need to shift toward transparency, disclosure practices, and clear editorial standards to maintain trust in written content in an era where human and machine authorship are deeply intertwined.",
      vi: "Cuối cùng, bài báo gợi ý rằng câu hỏi \"AI có viết bài này không?\" có thể ngày càng khó trả lời một cách chắc chắn. Thay vì chỉ phụ thuộc vào việc phát hiện, trọng tâm có thể cần chuyển dịch sang tính minh bạch, các thông lệ công bố và tiêu chuẩn biên tập rõ ràng để duy trì lòng tin vào nội dung viết trong kỷ nguyên mà quyền tác giả của con người và máy móc gắn kết sâu sắc với nhau."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/graphic-detail/2026/06/16/did-ai-write-this-article",
      source_label: "Substack",
      title: "Did AI write this article?",
      title_vi: "Liệu AI có viết bài báo này không?",
      category: "Graphic Detail",
      category_vi: "Chi tiết đồ họa",
      excerpt: "The article examines whether artificial intelligence may have played a role in producing written journalism.",
      excerpt_vi: "Bài viết xem xét liệu trí tuệ nhân tạo có thể đã đóng một vai trò nào đó trong việc sản xuất báo chí viết hay không.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 25:", data);
}

main().catch(console.error);
