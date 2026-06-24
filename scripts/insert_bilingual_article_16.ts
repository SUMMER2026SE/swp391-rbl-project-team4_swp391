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
  console.log("Inserting bilingual article 16 (Liberalism Primer #6)...");

  const content = [
    {
      en: "The sixth installment of The Economist’s liberalism primer examines one of the central challenges facing liberal societies in the modern era: how to preserve individual freedom and democratic institutions while responding to rising populism, [polarization]{sự phân cực}, and distrust of elites. The article argues that liberalism is often misunderstood as merely a commitment to free markets or limited government. In reality, liberalism is a broader philosophy built on individual rights, equality before the law, tolerance of differing opinions, constitutional [constraints]{ràng buộc/hạn chế} on power, and the belief that open debate is the best way to [resolve]{giải quyết} political disagreements. These principles have helped create some of the most prosperous and stable societies in history, but they are increasingly being challenged from both the political left and right.",
      vi: "Phần thứ sáu trong loạt bài nhập môn về chủ nghĩa tự do của The Economist xem xét một trong những thách thức trung tâm mà các xã hội tự do phải đối mặt trong kỷ nguyên hiện đại: làm thế nào để bảo vệ tự do cá nhân và các thể chế dân chủ trong khi đối phó với sự trỗi dậy của chủ nghĩa dân túy, sự phân cực và sự mất lòng tin vào giới tinh hoa. Bài viết lập luận rằng chủ nghĩa tự do thường bị hiểu lầm là chỉ đơn thuần là cam kết đối với thị trường tự do hoặc chính phủ hạn chế. Trên thực tế, chủ nghĩa tự do là một triết lý rộng lớn hơn được xây dựng trên các quyền cá nhân, sự bình đẳng trước pháp luật, sự bao dung đối với các ý kiến khác biệt, các ràng buộc hiến pháp đối với quyền lực và niềm tin rằng tranh luận cởi mở là cách tốt nhất để giải quyết các bất đồng chính trị. Những nguyên tắc này đã giúp tạo ra một số xã hội thịnh vượng và ổn định nhất trong lịch sử, nhưng chúng ngày càng bị thách thức từ cả hai phía tả và hữu của nền chính trị."
    },
    {
      en: "According to the primer, many critics blame liberalism for problems such as inequality, cultural [fragmentation]{sự phân mảnh/sự vỡ vụn}, declining trust in institutions, and economic insecurity. However, the article contends that these difficulties are often the result of policy failures, technological change, or insufficiently competitive markets rather than the core principles of liberalism itself. Populist movements frequently promise simple solutions by concentrating power in strong leaders or by weakening institutional checks and balances, but history suggests that such approaches often undermine freedom and economic [dynamism]{sự năng động/sức năng động} over time. Liberal institutions, although imperfect and sometimes frustratingly slow, are designed to prevent abuses of power and protect minority rights even during periods of political turmoil.",
      vi: "Theo bài viết nhập môn này, nhiều người chỉ trích đổ lỗi cho chủ nghĩa tự do về các vấn đề như bất bình đẳng, sự phân mảnh văn hóa, lòng tin vào các thể chế suy giảm và tình trạng mất an ninh kinh tế. Tuy nhiên, bài báo cho rằng những khó khăn này thường là kết quả của sự thất bại trong chính sách, sự thay đổi công nghệ hoặc các thị trường thiếu tính cạnh tranh lành mạnh hơn là do các nguyên tắc cốt lõi của chính chủ nghĩa tự do. Các phong trào dân túy thường hứa hẹn những giải pháp đơn giản bằng cách tập trung quyền lực vào các nhà lãnh đạo mạnh mẽ hoặc làm suy yếu các cơ chế kiểm soát và đối trọng thể chế, nhưng lịch sử cho thấy những cách tiếp cận như vậy thường làm suy giảm tự do và sức năng động kinh tế theo thời gian. Các thể chế tự do, dù còn khiếm khuyết và đôi khi chậm chạp đến mức gây nản lòng, được thiết kế để ngăn chặn sự lạm dụng quyền lực và bảo vệ quyền lợi của thiểu số ngay cả trong những thời kỳ bất ổn chính trị."
    },
    {
      en: "The article further argues that liberalism must adapt if it is to remain politically successful. Supporters of liberal democracy cannot rely solely on defending past achievements; they must also address contemporary concerns about housing affordability, social [mobility]{sự dịch chuyển/tính di động}, technological disruption, and public trust. A failure to respond effectively to these issues risks strengthening movements that reject liberal values altogether. Rather than abandoning liberalism, the primer suggests reforming and modernizing it so that it can continue to deliver economic opportunity, political stability, and personal freedom in the twenty-first century.",
      vi: "Bài báo lập luận thêm rằng chủ nghĩa tự do phải thích ứng để tiếp tục thành công về mặt chính trị. Những người ủng hộ nền dân chủ tự do không thể chỉ dựa vào việc bảo vệ các thành tựu trong quá khứ; họ cũng phải giải quyết các mối quan tâm đương đại về khả năng chi trả nhà ở, tính di động xã hội, sự gián đoạn công nghệ và lòng tin của công chúng. Thất bại trong việc phản hồi hiệu quả đối với các vấn đề này có nguy cơ làm mạnh thêm các phong trào bác bỏ hoàn toàn các giá trị tự do. Thay vì từ bỏ chủ nghĩa tự do, tài liệu gợi ý cải cách và hiện đại hóa nó để nó có thể tiếp tục mang lại cơ hội kinh tế, sự ổn định chính trị và tự do cá nhân trong thế kỷ hai mươi mốt."
    },
    {
      en: "Ultimately, the essay concludes that liberalism remains one of the most successful political ideas ever developed, but its future depends on its ability to renew itself and demonstrate that open societies can still solve real-world problems. In an age of increasing polarization and ideological conflict, the defense of liberal institutions requires not only principled arguments but also practical results that improve people's lives and restore confidence in democratic governance.",
      vi: "Cuối cùng, bài tiểu luận kết luận rằng chủ nghĩa tự do vẫn là một trong những ý tưởng chính trị thành công nhất từng được phát triển, nhưng tương lai của nó phụ thuộc vào khả năng tự đổi mới và chứng minh rằng các xã hội cởi mở vẫn có thể giải quyết các vấn đề thực tế. Trong thời đại phân cực và xung đột ý thức hệ ngày càng tăng, việc bảo vệ các thể chế tự do đòi hỏi không chỉ các lập luận có nguyên tắc mà còn cả những kết quả thực tế giúp cải thiện cuộc sống của người dân và khôi phục niềm tin vào quản trị dân chủ."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/interactive/2026/06/16/liberalism-primer-6",
      source_label: "The Economist",
      title: "Liberalism Primer #6",
      title_vi: "Nhập môn chủ nghĩa tự do số 6",
      category: "Interactive",
      category_vi: "Tương tác",
      excerpt: "The sixth installment of The Economist’s liberalism primer examines the challenges facing liberal societies.",
      excerpt_vi: "Phần thứ sáu trong loạt bài nhập môn chủ nghĩa tự do của The Economist nghiên cứu các thách thức đối với xã hội tự do.",
      author: "The Economist Editorial Team",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 16:", data);
}

main().catch(console.error);
