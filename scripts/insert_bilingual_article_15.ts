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
  console.log("Inserting bilingual article 15 (AI-Pilled Economists)...");

  const content = [
    {
      en: "Artificial intelligence has become one of the most important subjects in economics, yet much of the most influential thinking on the topic is no longer coming from traditional university departments. Instead, a growing group of economists often described as “AI-pilled” are emerging from think tanks, research institutes, technology companies, and independent networks dedicated to understanding how AI could [reshape]{tái định hình/định hình lại} productivity, labor markets, economic growth, and public policy. While mainstream economists have historically been cautious about technological predictions, these researchers argue that AI may represent a [transformative]{mang tính biến đổi/cải biến} economic force comparable to the Industrial Revolution. They believe that many [conventional]{truyền thống/thông thường} economic models underestimate the potential impact of systems capable of performing cognitive tasks once thought to be uniquely human.",
      vi: "Trí tuệ nhân tạo đã trở thành một trong những chủ đề quan trọng nhất trong kinh tế học, thế nhưng phần lớn tư duy có ảnh hưởng nhất về chủ đề này không còn xuất phát từ các khoa đại học truyền thống. Thay vào đó, một nhóm các nhà kinh tế học ngày càng phát triển, thường được mô tả là các nhà kinh tế học \"say mê AI\" (AI-pilled), đang xuất hiện từ các nhóm nghiên cứu (think tank), viện nghiên cứu, công ty công nghệ và các mạng lưới độc lập chuyên tìm hiểu cách AI có thể định hình lại năng suất, thị trường lao động, tăng trưởng kinh tế và chính sách công. Trong khi các nhà kinh tế học chính thống trước đây thường tỏ ra thận trọng đối với các dự báo công nghệ, những nhà nghiên cứu này lập luận rằng AI có thể đại diện cho một lực lượng kinh tế mang tính biến đổi sâu sắc tương đương với cuộc Cách mạng Công nghiệp. Họ tin rằng nhiều mô hình kinh tế thông thường đang đánh giá thấp tác động tiềm tàng của các hệ thống có khả năng thực hiện các nhiệm vụ nhận thức từng được coi là duy nhất chỉ con người mới có."
    },
    {
      en: "The debate is particularly visible in disagreements over productivity growth and employment. Economists such as Tyler Cowen argue that traditional models often fail to capture entirely new products and industries created by AI, leading to overly [conservative]{thận trọng/dè dặt/bảo thủ} estimates of economic gains. Others, including Daron Acemoglu and Erik Brynjolfsson, have produced influential research examining how AI could affect wages, productivity, and the structure of labor markets, though they differ on the scale and speed of the transformation. Some researchers believe AI will generate enormous economic growth while creating only limited job displacement, whereas others warn that the technology could significantly reduce demand for certain categories of workers and increase inequality if its benefits are not widely shared.",
      vi: "Cuộc tranh luận đặc biệt rõ nét trong các bất đồng về tăng trưởng năng suất và việc làm. Các nhà kinh tế học như Tyler Cowen lập luận rằng các mô hình truyền thống thường không ghi nhận được các sản phẩm và ngành công nghiệp hoàn toàn mới do AI tạo ra, dẫn đến các ước tính dè dặt quá mức về lợi ích kinh tế. Những người khác, bao gồm Daron Acemoglu và Erik Brynjolfsson, đã công bố những nghiên cứu có tầm ảnh hưởng lớn xem xét cách AI có thể tác động đến tiền lương, năng suất và cơ cấu thị trường lao động, mặc dù họ khác nhau về quy mô và tốc độ của sự chuyển đổi đó. Một số nhà nghiên cứu tin rằng AI sẽ tạo ra tăng trưởng kinh tế khổng lồ trong khi chỉ gây ra sự dịch chuyển việc làm hạn chế, trong khi những người khác cảnh báo rằng công nghệ này có thể làm giảm đáng kể nhu cầu đối với một số nhóm lao động nhất định và làm gia tăng bất bình đẳng nếu các lợi ích của nó không được chia sẻ rộng rãi."
    },
    {
      en: "A key feature of this new generation of AI-focused economists is their willingness to engage directly with technology companies, policymakers, and industry practitioners rather than remaining solely within academia. Their work increasingly focuses on practical questions such as how governments should regulate advanced AI systems, how wealth generated by AI should be distributed, and how societies can adapt to potential disruptions in employment. Conferences and policy forums are now bringing together economists, technologists, and political leaders to explore future scenarios ranging from rapid prosperity to widespread labor-market [upheaval]{sự biến động/sự biến động lớn}. Many participants agree that AI is likely to increase productivity substantially, but there is far less [consensus]{sự đồng thuận/sự nhất trí} about whether the gains will be broadly shared or concentrated among a small number of firms and individuals.",
      vi: "Một đặc điểm cốt lõi của thế hệ các nhà kinh tế học tập trung vào AI mới này là sự sẵn lòng hợp tác trực tiếp với các công ty công nghệ, các nhà hoạch định chính sách và các chuyên gia trong ngành hơn là chỉ bó hẹp trong môi trường học thuật. Công việc của họ ngày càng tập trung vào các câu hỏi thực tế như cách các chính phủ nên quản lý hệ thống AI tiên tiến, cách phân bổ của cải do AI tạo ra và cách các xã hội thích ứng với những gián đoạn tiềm ẩn về việc làm. Các hội nghị và diễn đàn chính sách hiện đang quy tụ các nhà kinh tế học, các nhà công nghệ và các nhà lãnh đạo chính trị để khám phá các kịch bản tương lai từ sự thịnh vượng nhanh chóng cho đến sự biến động lớn trên thị trường lao động. Nhiều người tham gia đồng ý rằng AI có khả năng làm tăng đáng kể năng suất, nhưng lại có rất ít sự đồng thuận về việc liệu những thành quả này sẽ được chia sẻ rộng rãi hay tập trung vào tay một số lượng nhỏ các doanh nghiệp và cá nhân."
    },
    {
      en: "The rise of AI economics reflects a broader recognition that artificial intelligence is no longer merely a technological issue but an economic and social one. As investment in AI continues to accelerate and businesses integrate the technology into more aspects of production and decision-making, economists are increasingly being asked to forecast outcomes that have few historical precedents. Whether AI ultimately produces a new era of prosperity or intensifies existing inequalities remains uncertain, but the economists studying these questions are becoming some of the most influential voices in shaping how governments, businesses, and societies prepare for an AI-driven future.",
      vi: "Sự trỗi dậy của kinh tế học AI phản ánh một nhận thức rộng lớn hơn rằng trí tuệ nhân tạo không còn đơn thuần là một vấn đề công nghệ mà là một vấn đề kinh tế và xã hội. Khi đầu tư vào AI tiếp tục tăng tốc và các doanh nghiệp tích hợp công nghệ này vào nhiều khía cạnh sản xuất và ra quyết định hơn, các nhà kinh tế học ngày càng được yêu cầu dự báo các kết quả vốn có rất ít tiền lệ lịch sử. Liệu AI cuối cùng sẽ tạo ra một kỷ nguyên thịnh vượng mới hay làm trầm trọng thêm các bất bình đẳng hiện tại vẫn còn là điều không chắc chắn, nhưng các nhà kinh tế học đang nghiên cứu các câu hỏi này đang trở thành một trong những tiếng nói có ảnh hưởng nhất trong việc định hình cách các chính phủ, doanh nghiệp và xã hội chuẩn bị cho một tương lai do AI dẫn dắt."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "economist",
      source_url: "https://www.economist.com/finance-and-economics/2026/06/15/meet-the-worlds-top-ai-pilled-economists",
      source_label: "The Economist",
      title: "Meet the World’s Top AI-Pilled Economists",
      title_vi: "Gặp gỡ các nhà kinh tế học say mê AI hàng đầu thế giới",
      category: "Finance & Economics",
      category_vi: "Tài chính & Kinh tế",
      excerpt: "A new generation of AI-focused economists is emerging outside traditional academic departments.",
      excerpt_vi: "Một thế hệ các nhà kinh tế học tập trung vào AI mới đang trỗi dậy bên ngoài các khoa học thuật truyền thống.",
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

  console.log("Success! Inserted article 15:", data);
}

main().catch(console.error);
