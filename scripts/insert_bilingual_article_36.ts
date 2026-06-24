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
  console.log("Inserting bilingual article 36 (NYT Brain Grammar)...");

  const content = [
    {
      en: "The article reports on new neuroscience research that challenges traditional ideas about how the human brain processes grammar, suggesting that language comprehension relies far more on prediction and context than on fixed, rule-based grammatical structures. The study, conducted using brain-imaging techniques while participants listened to continuous speech, indicates that the brain continuously [anticipates]{dự đoán/tiên liệu} upcoming words and updates meaning in real time rather than assembling sentences through explicit syntactic “rules” or tree-like structures.",
      vi: "Bài báo đưa tin về một nghiên cứu mới thuộc ngành thần kinh học thách thức các quan điểm truyền thống về cách bộ não con người xử lý ngữ pháp, gợi ý rằng sự hiểu ngôn ngữ phụ thuộc nhiều vào khả năng dự đoán và ngữ cảnh hơn là các cấu trúc ngữ pháp cố định dựa trên quy tắc. Nghiên cứu được thực hiện bằng cách sử dụng các kỹ thuật chẩn đoán hình ảnh não trong khi người tham gia nghe các bài phát biểu liên tục, chỉ ra rằng não liên tục tiên liệu các từ sắp tới và cập nhật nghĩa trong thời gian thực thay vì lắp ghép các câu thông qua các \"quy tắc\" cú pháp rõ ràng hay cấu trúc cây."
    },
    {
      en: "Researchers found that brain activity during language comprehension closely tracks [probabilistic]{mang tính xác suất} expectations about what words are likely to come next. Instead of waiting for a full sentence to be completed and then parsing its grammatical structure, the brain appears to incrementally build meaning word by word. Each incoming word reduces uncertainty and narrows possible interpretations, allowing comprehension to emerge gradually rather than all at once. This predictive mechanism was observed consistently across different languages and linguistic contexts, suggesting it may be a universal feature of human [cognition]{nhận thức}.",
      vi: "Các nhà nghiên cứu nhận thấy hoạt động của não trong quá trình hiểu ngôn ngữ theo sát các kỳ vọng mang tính xác suất về việc những từ nào có khả năng xuất hiện tiếp theo. Thay vì chờ đợi một câu hoàn chỉnh kết thúc rồi mới phân tích cấu trúc ngữ pháp của nó, bộ não dường như xây dựng nghĩa dần dần theo từng từ. Mỗi từ tiếp theo làm giảm đi sự mơ hồ và thu hẹp các cách diễn giải có thể xảy ra, cho phép sự hiểu biết xuất hiện từ từ thay vì cùng một lúc. Cơ chế dự đoán này được quan sát một cách nhất quán trên các ngôn ngữ và bối cảnh ngôn ngữ khác nhau, gợi ý rằng đây có thể là một đặc tính phổ quát của nhận thức con người."
    },
    {
      en: "The article also highlights how these findings align with advances in artificial intelligence, particularly large language models, which also generate and interpret language by predicting the most likely next word based on context. Scientists involved in the research note that while AI systems and the human brain are fundamentally different, both seem to rely on similar statistical principles for handling language, reinforcing the idea that prediction is central to both machine and human language processing.",
      vi: "Bài báo cũng nhấn mạnh cách các phát hiện này tương thích với những tiến bộ trong trí tuệ nhân tạo, đặc biệt là các mô hình ngôn ngữ lớn, vốn cũng tạo ra và diễn giải ngôn ngữ bằng cách dự đoán từ tiếp theo có khả năng nhất dựa trên ngữ cảnh. Các nhà khoa học tham gia nghiên cứu lưu ý rằng mặc dù hệ thống AI và bộ não con người về cơ bản là khác nhau, cả hai dường như đều dựa trên các nguyên tắc thống kê tương tự để xử lý ngôn ngữ, củng cố ý tưởng rằng dự đoán là cốt lõi của cả xử lý ngôn ngữ của con người và máy móc."
    },
    {
      en: "At the same time, the study challenges long-standing theories in linguistics that emphasize rigid grammatical structures, such as hierarchical “syntax trees” or [innate]{bẩm sinh} universal grammar rules. Instead, the evidence suggests that grammar may emerge from usage patterns and repeated exposure to language rather than being fully pre-programmed in the brain. This supports a more flexible view of language acquisition, in which experience and context play a dominant role in shaping how people understand and produce sentences.",
      vi: "Đồng thời, nghiên cứu thách thức các lý thuyết lâu đời trong ngôn ngữ học vốn nhấn mạnh đến cấu trúc ngữ pháp cứng nhắc, chẳng hạn như \"cây cú pháp\" phân cấp hoặc các quy tắc ngữ pháp phổ quát bẩm sinh. Thay vào đó, bằng chứng cho thấy ngữ pháp có thể xuất hiện từ các mô hình sử dụng và việc tiếp xúc lặp đi lặp lại với ngôn ngữ thay vì được lập trình sẵn hoàn toàn trong não. Điều này ủng hộ một quan điểm linh hoạt hơn về việc tiếp thu ngôn ngữ, trong đó trải nghiệm và ngữ cảnh đóng vai trò chi phối trong việc định hình cách mọi người hiểu và tạo ra các câu."
    },
    {
      en: "Ultimately, the article frames the research as part of a broader shift in cognitive science: moving away from viewing language as a fixed symbolic system and toward understanding it as a dynamic, predictive process embedded in real-time brain activity.",
      vi: "Cuối cùng, bài viết định hình nghiên cứu như một phần của sự chuyển dịch rộng lớn hơn trong khoa học nhận thức: chuyển từ việc xem ngôn ngữ như một hệ thống biểu tượng cố định sang việc hiểu nó như một quá trình dự đoán, năng động được gắn trong hoạt động của não bộ theo thời gian thực."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "the-new-york-times",
      source_url: "https://www.nytimes.com/2026/06/15/science/how-the-brain-builds-grammar-language-predictive-nyt-study",
      source_label: "The New York Times",
      title: "How the brain builds grammar: new study suggests language is more predictive than rule-based",
      title_vi: "Cách bộ não xây dựng ngữ pháp: Nghiên cứu mới gợi mở ngôn ngữ có tính dự báo hơn là dựa trên quy tắc",
      category: "Science",
      category_vi: "Khoa học",
      excerpt: "New neuroscience research suggests language comprehension relies far more on prediction than fixed grammar rules.",
      excerpt_vi: "Nghiên cứu mới thuộc thần kinh học cho thấy hiểu ngôn ngữ dựa vào dự đoán hơn là quy tắc ngữ pháp cứng nhắc.",
      author: "Elisabeth Bumiller",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 36:", data);
}

main().catch(console.error);
