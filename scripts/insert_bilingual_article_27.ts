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
  console.log("Inserting bilingual article 27 (Iran $300B fund)...");

  const content = [
    {
      en: "The article reports that a draft U.S.–Iran framework agreement includes the creation of a large $300 billion private investment fund aimed at supporting Iran’s reconstruction and economic development after months of conflict. According to a source with direct knowledge of the negotiations, more than half of the fund has already been [committed]{cam kết} by participating investors, suggesting significant early interest in the proposed initiative even before the deal is finalized. The fund is designed as a [market-based]{dựa trên thị trường/theo cơ chế thị trường} vehicle rather than a government-led aid package or reparations scheme.",
      vi: "Bài viết báo cáo rằng một dự thảo hiệp định khung giữa Hoa Kỳ và Iran bao gồm việc thành lập một quỹ đầu tư tư nhân lớn trị giá 300 tỷ USD nhằm hỗ trợ công cuộc tái thiết và phát triển kinh tế của Iran sau nhiều tháng xung đột. Theo một nguồn tin có kiến thức trực tiếp về các cuộc đàm phán, hơn một nửa số vốn của quỹ đã được cam kết bởi các nhà đầu tư tham gia, cho thấy mối quan tâm sớm đáng kể đối với sáng kiến được đề xuất ngay cả trước khi thỏa thuận được hoàn tất. Quỹ này được thiết kế như một công cụ dựa trên thị trường hơn là một gói viện trợ do chính phủ dẫn dắt hoặc chương trình bồi thường chiến tranh."
    },
    {
      en: "The proposed structure involves contributions from companies and investors across multiple regions, including the United States, Gulf Arab states, Asia, South America, and Africa. The investment focus would likely include sectors such as energy, logistics, manufacturing, and infrastructure, all of which are seen as critical to rebuilding Iran’s economy and integrating it more deeply into global markets. The [initiative]{sáng kiến} is intended to create economic incentives that support the broader political agreement between Washington and Tehran.",
      vi: "Cấu trúc được đề xuất liên quan đến sự đóng góp từ các công ty và nhà đầu tư ở nhiều khu vực, bao gồm Hoa Kỳ, các quốc gia vùng Vịnh, Châu Á, Nam Mỹ và Châu Phi. Trọng tâm đầu tư có thể bao gồm các lĩnh vực như năng lượng, hậu cần, sản xuất và cơ sở hạ tầng, tất cả đều được xem là rất quan trọng để xây dựng lại nền kinh tế Iran và tích hợp sâu rộng hơn vào thị trường toàn cầu. Sáng kiến này nhằm tạo ra các động lực kinh tế để hỗ trợ thỏa thuận chính trị rộng lớn hơn giữa Washington và Tehran."
    },
    {
      en: "Iran had reportedly initially sought much larger compensation following the war, but the U.S. rejected direct reparations. Instead, the idea of a reconstruction and development fund emerged as a [compromise]{sự thỏa hiệp} mechanism to attract private capital while avoiding direct government payouts. The fund is expected to become operational only if a final agreement is signed, and it remains contingent on further negotiations over key issues such as sanctions relief, nuclear limitations, and regional security arrangements.",
      vi: "Iran được cho là ban đầu đã tìm kiếm mức bồi thường lớn hơn nhiều sau chiến tranh, nhưng Mỹ đã bác bỏ việc bồi thường trực tiếp. Thay vào đó, ý tưởng về một quỹ tái thiết và phát triển đã xuất hiện như một cơ chế thỏa hiệp để thu hút vốn tư nhân trong khi tránh các khoản chi trả trực tiếp từ chính phủ. Quỹ dự kiến sẽ chỉ đi vào hoạt động nếu một thỏa thuận cuối cùng được ký kết, và nó vẫn phụ thuộc vào các cuộc đàm phán tiếp theo về các vấn đề then chốt như nới lỏng lệnh trừng phạt, giới hạn hạt nhân và các thỏa thuận an ninh khu vực."
    },
    {
      en: "The article also emphasizes that the $300 billion figure reflects potential committed capital rather than guaranteed public funding, and its implementation will depend heavily on political stability and investor confidence in the region. As such, while the announcement signals strong economic interest in Iran’s post-conflict recovery, significant [uncertainties]{sự bất định/mơ hồ} remain regarding execution, governance, and the broader geopolitical environment surrounding the deal.",
      vi: "Bài viết cũng nhấn mạnh rằng con số 300 tỷ USD phản ánh nguồn vốn cam kết tiềm năng hơn là nguồn tài trợ công được đảm bảo, và việc thực hiện nó sẽ phụ thuộc lớn vào sự ổn định chính trị và niềm tin của nhà đầu tư trong khu vực. Do đó, mặc dù thông báo báo hiệu sự quan tâm kinh tế mạnh mẽ đối với sự phục hồi sau xung đột của Iran, những sự bất định đáng kể vẫn tồn tại liên quan đến việc thực thi, quản trị và môi trường địa chính trị rộng lớn hơn xung quanh thỏa thuận."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/world/middle-east/iran-deal-includes-300-billion-fund-more-than-half-of-which-already-committed-2026-06-16",
      source_label: "Reuters",
      title: "Iran deal includes $300 billion fund, more than half of which already committed",
      title_vi: "Thỏa thuận Iran bao gồm quỹ 300 tỷ USD, hơn một nửa trong số đó đã được cam kết",
      category: "World News",
      category_vi: "Tin thế giới",
      excerpt: "A draft U.S.–Iran framework agreement includes the creation of a large $300 billion private investment fund.",
      excerpt_vi: "Dự thảo hiệp định khung Mỹ-Iran bao gồm việc thành lập một quỹ đầu tư tư nhân lớn trị giá 300 tỷ USD.",
      author: "Reuters Staff",
      read_time: "4 mins",
      image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 27:", data);
}

main().catch(console.error);
