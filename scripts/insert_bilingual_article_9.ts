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
  console.log("Inserting bilingual article 9 (Toy Story 5 Review)...");

  const content = [
    {
      en: "Pixar’s Toy Story 5 has been met with a mixed critical response, with reviewers questioning whether the long-running franchise still has enough creative energy to [justify]{bào chữa cho/chứng minh cho} another installment. The film reunites many of the beloved characters that helped make the series one of the most successful animated franchises in cinema history, while introducing new challenges and contemporary themes designed to appeal to younger audiences. The story explores the growing influence of technology and changing patterns of childhood play, placing traditional toys in competition with modern digital entertainment. Although the film retains the emotional warmth, humor, and visual quality that audiences have come to expect from Pixar, critics argue that it struggles to [recapture]{tìm lại/tái hiện lại} the originality and emotional impact that made earlier entries so memorable.",
      vi: "Phần 5 của loạt phim Toy Story (Câu chuyện đồ chơi) do hãng Pixar sản xuất đã vấp phải những phản hồi trái chiều từ giới phê bình, khi các nhà đánh giá đặt câu hỏi liệu thương hiệu phim lâu đời này có còn đủ năng lượng sáng tạo để chứng minh cho sự cần thiết của một phần tiếp theo hay không. Bộ phim quy tụ lại nhiều nhân vật được yêu mến, những người đã góp phần đưa loạt phim này trở thành một trong những thương hiệu hoạt hình thành công nhất lịch sử điện ảnh, đồng thời giới thiệu những thử thách mới và các chủ đề đương đại được thiết kế để thu hút đối tượng khán giả nhỏ tuổi hơn. Câu chuyện khám phá tầm ảnh hưởng ngày càng tăng của công nghệ và sự thay đổi trong cách vui chơi của trẻ thơ, đặt những món đồ chơi truyền thống vào thế cạnh tranh với thế giới giải trí kỹ thuật số hiện đại. Mặc dù bộ phim vẫn giữ được sự ấm áp đầy cảm xúc, tính hài hước và chất lượng hình ảnh vốn được mong đợi từ Pixar, giới phê bình cho rằng phim đang gặp khó khăn trong việc tái hiện lại tính nguyên bản và tác động cảm xúc vốn đã làm nên sự đáng nhớ của các phần phim trước."
    },
    {
      en: "Familiar characters such as Woody, Buzz Lightyear, and their companions continue to provide moments of charm and [nostalgia]{sự hoài niệm/lòng hoài cổ}, but some reviewers believe the narrative relies too heavily on past successes rather than presenting a truly fresh direction. The film’s themes of friendship, loyalty, and adapting to change remain effective, yet the overall story has been described as less [compelling]{hấp dẫn/thuyết phục} than those of its predecessors. Despite these criticisms, the animation, voice performances, and family-friendly appeal have received praise, making the movie an enjoyable experience for many viewers, particularly younger audiences and longtime fans of the franchise.",
      vi: "Những nhân vật quen thuộc như Woody, Buzz Lightyear và những người bạn đồng hành của họ tiếp tục mang lại những khoảnh khắc duyên dáng và đầy hoài niệm, nhưng một số nhà phê bình cho rằng mạch kể chuyện đang phụ thuộc quá nhiều vào những thành công trong quá khứ hơn là đưa ra một hướng đi thực sự mới mẻ. Các chủ đề của bộ phim về tình bạn, lòng trung thành và sự thích nghi với đổi thay vẫn hiệu quả, song câu chuyện tổng thể bị nhận xét là kém hấp dẫn hơn so với các phần tiền nhiệm. Bất chấp những chỉ trích này, phần đồ họa hoạt hình, diễn xuất lồng tiếng và sức hút thân thiện với gia đình vẫn nhận được nhiều lời khen ngợi, mang lại trải nghiệm thú vị cho nhiều người xem, đặc biệt là khán giả nhỏ tuổi và những người hâm mộ lâu năm của loạt phim."
    },
    {
      en: "The review ultimately suggests that while Toy Story 5 remains entertaining and professionally crafted, it also raises questions about whether Pixar should continue extending a series that many felt had already reached a [satisfying]{thỏa mãn/hài lòng} conclusion in earlier films. The movie therefore serves both as a celebration of a beloved franchise and as a reminder of the challenges involved in keeping long-running stories fresh for new [generations]{thế hệ}.",
      vi: "Bài đánh giá cuối cùng chỉ ra rằng mặc dù Toy Story 5 vẫn mang tính giải trí cao và được chế tác một cách chuyên nghiệp, nó cũng đặt ra câu hỏi về việc liệu Pixar có nên tiếp tục kéo dài một loạt phim mà nhiều người cảm thấy vốn đã có một cái kết thỏa mãn ở các phần trước. Do đó, bộ phim vừa đóng vai trò như một sự tôn vinh đối với một thương hiệu phim được yêu mến, vừa là lời nhắc nhở về những thách thức trong việc giữ cho những câu chuyện kéo dài nhiều năm luôn mới mẻ đối với các thế hệ mới."
    }
  ];

  const { data, error } = await supabaseAdmin
    .from("bilingual_articles")
    .insert({
      source_id: "guardian",
      source_url: "https://www.theguardian.com/film/2026/jun/16/toy-story-5-review-pixar-franchise-needs-new-batteries",
      source_label: "The Guardian",
      title: "Toy Story 5 review – Pixar franchise needs new batteries",
      title_vi: "Đánh giá Toy Story 5 – Thương hiệu của Pixar cần những viên pin mới",
      category: "Film",
      category_vi: "Điện ảnh",
      excerpt: "Pixar’s Toy Story 5 has been met with a mixed critical response, raising questions about its creative necessity.",
      excerpt_vi: "Toy Story 5 của Pixar vấp phải những phản hồi trái chiều từ giới phê bình, dấy lên câu hỏi về sự cần thiết sáng tạo của bộ phim.",
      author: "Peter Bradshaw",
      read_time: "3 mins",
      image_url: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=80",
      content: content
    })
    .select();

  if (error) {
    console.error("Error inserting article:", error);
    process.exit(1);
  }

  console.log("Success! Inserted article:", data);
}

main().catch(console.error);
