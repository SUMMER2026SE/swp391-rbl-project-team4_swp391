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
  console.log("Inserting bilingual article 28 (FBI UFC Washington)...");

  const content = [
    {
      en: "The FBI said it has disrupted a potential coordinated attack targeting a high-profile UFC event held at the White House in Washington, D.C., taking multiple suspects into [custody]{sự giam giữ/sự tạm giam} in a multi-state operation. According to law enforcement statements and court documents, the plot involved individuals allegedly planning a complex, multi-stage assault designed to cause mass casualties during and after the event.",
      vi: "FBI cho biết họ đã đập tan một cuộc tấn công phối hợp tiềm ẩn nhằm vào một sự kiện UFC nổi tiếng được tổ chức tại Nhà Trắng ở Washington, D.C., bắt giữ nhiều nghi phạm trong một chiến dịch liên bang. Theo các tuyên bố của cơ quan thực thi pháp luật và tài liệu tòa án, âm mưu này liên quan đến các cá nhân bị cáo buộc là đang lên kế hoạch cho một cuộc tấn công phức tạp, nhiều giai đoạn nhằm gây ra thương vong hàng loạt trong và sau sự kiện."
    },
    {
      en: "Authorities said the suspected plan included the use of explosive-laden drones intended to strike areas near the venue, followed by secondary attacks aimed at people fleeing the scene. Investigators believe the objective was to create panic and [maximize]{tối đa hóa} casualties among attendees, who included political figures and other high-profile guests. The FBI emphasized that the threat was detected in advance and successfully [neutralized]{vô hiệu hóa} before it could be carried out.",
      vi: "Nhà chức trách cho biết kế hoạch bị nghi ngờ bao gồm việc sử dụng các máy bay không người lái mang thuốc nổ nhằm tấn công các khu vực gần địa điểm tổ chức, sau đó là các cuộc tấn công thứ cấp nhằm vào những người đang tháo chạy khỏi hiện trường. Các nhà điều tra tin rằng mục tiêu là tạo ra sự hỗn loạn và tối đa hóa thương vong trong số những người tham dự, bao gồm các chính trị gia và các khách mời cao cấp khác. FBI nhấn mạnh rằng mối đe dọa đã được phát hiện trước và được vô hiệu hóa thành công trước khi có thể được thực hiện."
    },
    {
      en: "Officials said the investigation began after intelligence was gathered earlier in June, leading to coordinated arrests across several U.S. states. At least five individuals have been detained, while investigators are examining whether additional people were involved in a wider network connected to the alleged plot. Authorities have described the case as part of a broader pattern of rising politically motivated [extremist]{cực đoan} activity and emphasized that the suspects were allegedly communicating and coordinating through encrypted channels.",
      vi: "Các quan chức cho biết cuộc điều tra bắt đầu sau khi thông tin tình báo được thu thập vào đầu tháng 6, dẫn đến các vụ bắt giữ phối hợp trên nhiều bang của Mỹ. Ít nhất 5 cá nhân đã bị giam giữ, trong khi các nhà điều tra đang xem xét liệu có thêm người nào khác tham gia vào một mạng lưới rộng lớn hơn liên quan đến âm mưu bị cáo buộc hay không. Nhà chức trách mô tả vụ việc là một phần của xu hướng gia tăng hoạt động cực đoan có động cơ chính trị và nhấn mạnh rằng các nghi phạm bị cáo buộc là đã liên lạc và phối hợp thông qua các kênh mã hóa."
    },
    {
      en: "The UFC event itself proceeded without incident, despite the scale of the alleged threat and heightened security measures surrounding the White House. Law enforcement agencies, including the FBI and Secret Service, have continued to review evidence, including digital communications and weapons-related materials recovered during the operation. Officials said further charges may be filed as the investigation expands.",
      vi: "Bản thân sự kiện UFC đã diễn ra mà không gặp sự cố nào, bất chấp quy mô của mối đe dọa bị cáo buộc và các biện pháp an ninh được tăng cường xung quanh Nhà Trắng. Các cơ quan thực thi pháp luật, bao gồm cả FBI và Mật vụ, đã tiếp tục xem xét bằng chứng, bao gồm thông tin liên lạc kỹ thuật số và các tài liệu liên quan đến vũ khí được thu hồi trong chiến dịch. Các quan chức cho biết các cáo buộc bổ sung có thể được đưa ra khi cuộc điều tra được mở rộng."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "reuters",
      source_url: "https://www.reuters.com/world/us/fbi-says-thwarted-possible-threat-to-ufc-event-in-washington-2026-06-16",
      source_label: "Reuters",
      title: "FBI says it thwarted possible threat to UFC event in Washington",
      title_vi: "FBI cho biết họ đã ngăn chặn mối đe dọa tiềm tàng đối với sự kiện UFC ở Washington",
      category: "US News",
      category_vi: "Tin tức Mỹ",
      excerpt: "The FBI has disrupted a potential coordinated attack targeting a UFC event at the White House.",
      excerpt_vi: "FBI đã triệt phá một cuộc tấn công phối hợp tiềm ẩn nhằm vào một sự kiện UFC tại Nhà Trắng.",
      author: "Reuters Staff",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article 28:", data);
}

main().catch(console.error);
