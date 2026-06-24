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
  console.log("Inserting bilingual article 24 (Stears Africa)...");

  const content = [
    {
      en: "The article examines Stears, a Nigeria-based financial intelligence platform, and its ambition to become a “Bloomberg terminal for Africa” by providing high-quality, data-driven market analysis across a continent where reliable financial information has historically been [fragmented]{bị phân mảnh} and uneven. As African economies grow and capital markets mature, investors—ranging from private equity firms to multinational corporations—are increasingly demanding faster, more accurate, and more structured insights into companies, macroeconomic trends, regulatory environments, and deal activity. Stears positions itself as a solution to this gap by building a digital platform that [aggregates]{tổng hợp} economic data, company information, and market research tailored specifically to African markets.",
      vi: "Bài viết xem xét Stears, một nền tảng thông tin tài chính có trụ sở tại Nigeria, và tham vọng của doanh nghiệp này trong việc trở thành một \"thiết bị đầu cuối Bloomberg cho châu Phi\" bằng cách cung cấp các phân tích thị trường chất lượng cao, dựa trên dữ liệu trên khắp một châu lục nơi thông tin tài chính đáng tin cậy trong lịch sử đã bị phân mảnh và không đồng đều. Khi các nền kinh tế châu Phi tăng trưởng và thị trường vốn trưởng thành, các nhà đầu tư — từ các quỹ đầu tư tư nhân đến các tập đoàn đa quốc gia — đang ngày càng yêu cầu những hiểu biết nhanh hơn, chính xác hơn và có cấu trúc hơn về các công ty, xu hướng kinh tế vĩ mô, môi trường pháp lý và hoạt động giao dịch. Stears tự định vị mình là giải pháp cho khoảng trống này bằng cách xây dựng một nền tảng kỹ thuật số tổng hợp dữ liệu kinh tế, thông tin công ty và nghiên cứu thị trường được điều chỉnh riêng cho các thị trường châu Phi."
    },
    {
      en: "Unlike traditional news outlets, Stears focuses heavily on structured financial intelligence rather than narrative reporting. Its platform is designed to help investors screen companies, track transactions, analyze sectors, and assess risks across multiple African countries, where official data can often be inconsistent or difficult to access. The company relies on a combination of quantitative datasets and locally sourced qualitative research, aiming to bridge the information gap that has long made African markets harder to [navigate]{định hướng/điều hướng} compared with more developed financial ecosystems.",
      vi: "Không giống như các hãng thông tấn truyền thống, Stears tập trung mạnh vào thông tin tài chính có cấu trúc hơn là các báo cáo dạng tự sự. Nền tảng của nó được thiết kế để giúp các nhà đầu tư sàng lọc các công ty, theo dõi các giao dịch, phân tích các lĩnh vực và đánh giá rủi ro trên nhiều quốc gia châu Phi, nơi dữ liệu chính thức thường không nhất quán hoặc khó tiếp cận. Công ty dựa trên sự kết hợp của các tập dữ liệu định lượng và nghiên cứu định tính có nguồn gốc địa phương, nhằm thu hẹp khoảng cách thông tin vốn từ lâu đã khiến các thị trường châu Phi khó định hướng hơn so với các hệ sinh thái tài chính phát triển hơn."
    },
    {
      en: "The article notes that the rise of platforms like Stears reflects broader changes in African finance, including increasing foreign investment interest, the growth of local capital markets, and the expansion of venture capital and private equity activity. As more global investors look to Africa for opportunities in areas such as fintech, energy, infrastructure, and consumer markets, the demand for reliable, comparable, and timely data has grown significantly. In this context, information infrastructure is becoming as important as physical or financial infrastructure for economic development.",
      vi: "Bài báo lưu ý rằng sự trỗi dậy của các nền tảng như Stears phản ánh những thay đổi rộng lớn hơn trong tài chính châu Phi, bao gồm sự gia tăng mối quan tâm đầu tư nước ngoài, sự phát triển của thị trường vốn địa phương và việc mở rộng hoạt động đầu tư mạo hiểm và đầu tư tư nhân. Khi nhiều nhà đầu tư toàn cầu tìm đến châu Phi để tìm kiếm cơ hội trong các lĩnh vực như công nghệ tài chính (fintech), năng lượng, cơ sở hạ tầng và thị trường tiêu dùng, nhu cầu về dữ liệu đáng tin cậy, có tính so sánh và kịp thời đã tăng lên đáng kể. In this bối cảnh này, cơ sở hạ tầng thông tin đang trở nên quan trọng như cơ sở hạ tầng vật chất hoặc tài chính đối với sự phát triển kinh tế."
    },
    {
      en: "However, the piece also implies that Stears faces significant challenges in achieving its ambition. Building a “Bloomberg-like” system requires not only high-quality data collection but also deep market coverage, institutional trust, and the ability to [scale]{mở rộng quy mô} across very diverse regulatory and economic environments. Africa’s 50+ markets differ widely in terms of transparency, reporting standards, and data availability, making standardization difficult. Competing with established global data providers and convincing investors to rely on a relatively young platform are additional hurdles.",
      vi: "Tuy nhiên, bài viết cũng ngụ ý rằng Stears phải đối mặt với những thách thức lớn trong việc đạt được tham vọng của mình. Việc xây dựng một hệ thống \"giống như Bloomberg\" đòi hỏi không chỉ thu thập dữ liệu chất lượng cao mà còn cả độ phủ thị trường sâu rộng, sự tin cậy của các tổ chức và khả năng mở rộng quy mô trên các môi trường pháp lý và kinh tế rất đa dạng. Hơn 50 thị trường của châu Phi khác nhau rất nhiều về tính minh bạch, tiêu chuẩn báo cáo và mức độ sẵn có của dữ liệu, khiến việc tiêu chuẩn hóa trở nên khó khăn. Cạnh tranh với các nhà cung cấp dữ liệu toàn cầu đã có tên tuổi và thuyết phục các nhà đầu tư tin tưởng vào một nền tảng tương đối non trẻ là những rào cản bổ sung."
    },
    {
      en: "Ultimately, the article presents Stears as part of a new generation of African fintech and data companies attempting to reshape how the continent is understood by global capital markets. If successful, it could help reduce information asymmetries that have historically limited investment and improve market efficiency. At the same time, its growth highlights a broader trend: as African economies become more integrated into global finance, the infrastructure of information itself is becoming a critical battleground for influence, investment, and economic development.",
      vi: "Cuối cùng, bài báo giới thiệu Stears như một phần của thế hệ các công ty công nghệ tài chính và dữ liệu mới của châu Phi đang cố gắng định hình lại cách châu lục này được hiểu bởi thị trường vốn toàn cầu. Nếu thành công, nó có thể giúp giảm thiểu tình trạng bất đối xứng thông tin vốn từ lâu đã hạn chế đầu tư và cải thiện hiệu quả thị trường. Đồng thời, sự phát triển của nó làm nổi bật một xu hướng rộng lớn hơn: khi các nền kinh tế châu Phi ngày càng tích hợp sâu rộng vào tài chính toàn cầu, cơ sở hạ tầng thông tin tự nó đang trở thành một chiến trường quan trọng cho tầm ảnh hưởng, đầu tư và phát triển kinh tế."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "substack",
      source_url: "https://www.economist.com/finance-and-economics/2026/06/11/stears-wants-to-be-africas-bloomberg-terminal",
      source_label: "Substack",
      title: "Stears Wants to Be Africa’s Bloomberg Terminal",
      title_vi: "Stears muốn trở thành thiết bị đầu cuối Bloomberg của Châu Phi",
      category: "Finance & Economics",
      category_vi: "Tài chính & Kinh tế",
      excerpt: "Stears, a Nigeria-based financial intelligence platform, aims to become a Bloomberg terminal for Africa.",
      excerpt_vi: "Stears, một nền tảng thông tin tài chính có trụ sở tại Nigeria, đặt mục tiêu trở thành thiết bị đầu cuối Bloomberg cho Châu Phi.",
      author: "The Economist",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 24:", data);
}

main().catch(console.error);
