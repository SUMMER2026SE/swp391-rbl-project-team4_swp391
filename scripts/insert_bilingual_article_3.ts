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
  console.log("Inserting bilingual article...");

  const content = [
    {
      en: "Brazil’s Supreme Court convicted Eduardo Bolsonaro, the son of former Brazilian president Jair Bolsonaro, for attempting to [enlist]{tranh thủ} support from the United States in order to influence legal [proceedings]{quá trình tố tụng} involving his father. The court found that Eduardo had sought assistance from political figures in Washington and encouraged measures such as sanctions and economic pressure against Brazilian authorities overseeing Jair Bolsonaro’s [coup-related]{liên quan đến đảo chính} case. The judges ruled [unanimously]{nhất trí} that his actions amounted to an improper attempt to interfere with Brazil’s judicial system and sentenced him to more than four years in prison while also imposing a lengthy ban on holding public office.",
      vi: "Tòa án Tối cao Brazil đã kết án Eduardo Bolsonaro, con trai của cựu tổng thống Brazil Jair Bolsonaro, vì cố gắng tranh thủ sự ủng hộ từ Hoa Kỳ nhằm gây ảnh hưởng đến các quá trình tố tụng pháp lý liên quan đến cha mình. Tòa án phán quyết rằng Eduardo đã tìm kiếm sự hỗ trợ từ các nhân vật chính trị ở Washington và khuyến khích các biện pháp như lệnh trừng phạt và áp lực kinh tế đối với các nhà chức trách Brazil đang giám sát vụ án liên quan đến đảo chính của Jair Bolsonaro. Các thẩm phán đã nhất trí rằng hành động của anh ta tương đương với một nỗ lực không thích hợp nhằm can thiệp vào hệ thống tư pháp của Brazil và tuyên án anh ta hơn bốn năm tù, đồng thời ban hành lệnh cấm đảm nhiệm chức vụ công trong thời gian dài."
    },
    {
      en: "Eduardo, who has been living in the United States since 2025, argued that he was defending democratic principles and exposing what he described as political [persecution]{sự đàn áp} against his family. Prosecutors, however, maintained that he had [subordinated]{xem nhẹ hơn} Brazil’s national interests to a personal campaign aimed at helping his father avoid legal consequences. The conviction represents another major [setback]{trở ngại} for the Bolsonaro family, whose political influence has been weakened by a series of investigations and court rulings. Jair Bolsonaro is already serving a lengthy sentence after being convicted over his role in efforts to [overturn]{lật đổ} Brazil’s democratic institutions following the 2022 election.",
      vi: "Eduardo, người sống ở Hoa Kỳ từ năm 2025, lập luận rằng anh ta đang bảo vệ các nguyên tắc dân chủ và vạch trần những gì anh ta mô tả là sự đàn áp chính trị đối với gia đình mình. Tuy nhiên, các công tố viên khẳng định rằng anh ta đã xem nhẹ hơn lợi ích quốc gia của Brazil đối với một chiến dịch cá nhân nhằm giúp cha mình tránh các hậu quả pháp lý. Bản án này đại diện cho một trở ngại lớn khác đối với gia đình Bolsonaro, những người mà ảnh hưởng chính trị đã bị suy yếu bởi một loạt cuộc điều tra và phán quyết của tòa án. Jair Bolsonaro đang phải chấp hành một bản án dài sau khi bị kết tội về vai trò của mình trong các nỗ lực nhằm lật đổ các thể chế dân chủ của Brazil sau cuộc bầu cử năm 2022."
    },
    {
      en: "The ruling also comes at a sensitive moment in Brazilian politics, as allies of the former president attempt to maintain their influence ahead of future elections. Supporters of the decision argued that it demonstrated the independence of Brazil’s judiciary and [reinforced]{củng cố} the principle that no individual is above the law, while critics claimed the proceedings reflected an increasingly [politicized]{bị chính trị hóa} legal environment. The case has attracted international attention because of its connections to American political figures and broader debates about foreign influence in [domestic]{trong nước} judicial [affairs]{sự vụ}.",
      vi: "Phán quyết này cũng được đưa ra vào một thời điểm nhạy cảm trong nền chính trị Brazil, khi các đồng minh của cựu tổng thống cố gắng duy trì ảnh hưởng của họ trước các cuộc bầu cử trong tương lai. Những người ủng hộ quyết định này lập luận rằng nó đã chứng minh tính độc lập của cơ quan tư pháp Brazil và củng cố nguyên tắc không một cá nhân nào đứng trên luật pháp, trong khi các nhà phê bình cho rằng các quá trình tố tụng phản ánh một môi trường pháp lý ngày càng bị chính trị hóa. Vụ án đã thu hút sự chú ý của quốc tế vì những mối liên hệ của nó với các nhân vật chính trị Mỹ và các cuộc tranh luận rộng rãi hơn về ảnh hưởng của nước ngoài đối với các sự vụ tư pháp trong nước."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/world/2026/jun/16/brazilian-court-convicts-eduardo-bolsonaro-over-us-help-for-father-jair-bolsonaro",
      source_label: "The Guardian",
      title: "Brazilian court convicts Eduardo Bolsonaro over US help for father Jair Bolsonaro",
      title_vi: "Tòa án Brazil kết án Eduardo Bolsonaro vì nhờ Mỹ giúp đỡ cha mình Jair Bolsonaro",
      category: "Politics",
      category_vi: "Chính trị",
      excerpt: "Brazil’s Supreme Court convicted Eduardo Bolsonaro for attempting to enlist US support to influence legal proceedings.",
      excerpt_vi: "Tòa án Tối cao Brazil đã kết án Eduardo Bolsonaro vì cố gắng tranh thủ sự ủng hộ của Mỹ để tác động đến các quá trình tố tụng pháp lý.",
      author: "Tom Phillips",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article:", data);
}

// Execute main
main().catch(console.error);
