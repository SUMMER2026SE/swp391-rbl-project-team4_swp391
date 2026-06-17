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

const articlesToInsert = [
  {
    source_id: "the-atlantic",
    source_url: "https://www.theatlantic.com/magazine/archive/2026/07/young-washington-movie/2026-07",
    source_label: "The Atlantic",
    title: "Young Washington",
    title_vi: "Washington thời trẻ",
    category: "Magazine / History",
    category_vi: "Tạp chí / Lịch sử",
    excerpt: "The article examines the upcoming historical biopic Young Washington, directed by Jon Erwin, dramatizing his early life.",
    excerpt_vi: "Bài viết xem xét bộ phim tiểu sử lịch sử sắp ra mắt Young Washington do Jon Erwin đạo diễn, kịch tính hóa cuộc đời thời trẻ của ông.",
    author: "Michael O’Donnell",
    read_time: "5 mins",
    image_url: "https://images.unsplash.com/photo-1599731800919-4d29764786b8?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        en: "The article examines the upcoming historical [biopic]{phim tiểu sử} Young Washington, directed by Jon Erwin, which [dramatizes]{kịch tính hóa/tái hiện} the early life of George Washington before he became the first president of the United States. It focuses on how the film portrays Washington as a young colonial officer whose early mistakes and experiences during the French and Indian War shape his development into a military and political leader. The production [features]{có sự góp mặt của/trình chiếu} William Franklyn-Miller in the lead role, alongside actors including Ben Kingsley, Andy Serkis, Kelsey Grammer, and Mary-Louise Parker.",
        vi: "Bài viết xem xét bộ phim tiểu sử lịch sử sắp ra mắt mang tên Young Washington, do Jon Erwin đạo diễn, kịch tính hóa cuộc đời thời trẻ của George Washington trước khi ông trở thành tổng thống đầu tiên của Hoa Kỳ. Bộ phim tập trung vào cách nó khắc họa Washington như một sĩ quan thuộc địa trẻ tuổi, người mà những sai lầm và trải nghiệm ban đầu trong Chiến tranh Pháp và Da đỏ đã định hình sự phát triển của ông thành một nhà lãnh đạo quân sự và chính trị. Tác phẩm có sự góp mặt của William Franklyn-Miller trong vai nam chính, bên cạnh các diễn viên bao gồm Ben Kingsley, Andy Serkis, Kelsey Grammer và Mary-Louise Parker."
      },
      {
        en: "A major theme of the piece is how the film blends historical fact with cinematic storytelling to construct a “[foundational]{nền tảng} myth” of American leadership. Rather than presenting Washington strictly as a [distant]{xa cách} historical figure, the movie emphasizes his youth, insecurity, and moral struggles, framing him as an imperfect individual who gradually learns responsibility and leadership through failure and conflict. The article notes that this narrative approach is part of a broader trend in modern historical cinema that seeks to [humanize]{nhân văn hóa/làm cho gần gũi} iconic figures while still reinforcing national identity narratives.",
        vi: "Một chủ đề lớn của tác phẩm là cách bộ phim kết hợp sự thật lịch sử với cách kể chuyện điện ảnh để xây dựng một \"huyền thoại nền tảng\" về sự lãnh đạo của nước Mỹ. Thay vì thể hiện Washington một cách cứng nhắc như một nhân vật lịch sử xa cách, bộ phim nhấn mạnh tuổi trẻ, sự bất an và những đấu tranh đạo đức của ông, định khung ông như một cá nhân không hoàn hảo, người dần học hỏi trách nhiệm và khả năng lãnh đạo thông qua thất bại và xung đột. Bài báo lưu ý rằng cách tiếp cận tự sự này là một phần của xu hướng rộng lớn hơn trong điện ảnh lịch sử hiện đại nhằm nhân văn hóa các nhân vật mang tính biểu tượng trong khi vẫn củng cố các câu chuyện về bản sắc quốc gia."
      },
      {
        en: "The piece also discusses the cultural and political context surrounding the film’s production. Backed by Angel Studios and Wonder Project, Young Washington is [positioned]{được định vị} not only as entertainment but also as a statement about [civic]{(thuộc) công dân} values, leadership, and American identity. Supporters of the project describe it as an effort to inspire younger audiences by presenting a [relatable]{dễ đồng cảm/gần gũi} version of a founding father, while critics raise questions about whether such portrayals risk simplifying or selectively interpreting complex historical realities.",
        vi: "Tác phẩm cũng thảo luận về bối cảnh văn hóa và chính trị xung quanh việc sản xuất bộ phim. Được hậu thuẫn bởi Angel Studios và Wonder Project, Young Washington được định vị không chỉ là một chương trình giải trí mà còn là một tuyên ngôn về các giá trị công dân, kỹ năng lãnh đạo và bản sắc Mỹ. Những người ủng hộ dự án mô tả nó như một nỗ lực truyền cảm hứng cho khán giả trẻ bằng cách giới thiệu một phiên bản gần gũi về một người cha sáng lập đất nước, trong khi những người chỉ trích đặt ra câu hỏi liệu những chân dung như vậy có nguy cơ đơn giản hóa hoặc diễn giải một cách có chọn lọc những thực tế lịch sử phức tạp hay không."
      },
      {
        en: "In addition, the article highlights the timing of the film’s release around the 250th anniversary of American independence, suggesting that it is designed to [tap into]{khai thác/tận dụng} renewed public interest in national history and founding narratives. The film’s marketing emphasizes themes of [resilience]{sự kiên cường}, sacrifice, and the idea that ordinary individuals can become nation-shaping leaders, aligning Washington’s personal journey with broader American [ideals]{lý tưởng}.",
        vi: "Ngoài ra, bài viết nêu bật thời điểm phát hành bộ phim xung quanh kỷ niệm 250 năm ngày độc lập của nước Mỹ, gợi ý rằng nó được thiết kế để khai thác sự quan tâm mới mẻ của công chúng đối với lịch sử quốc gia và những câu chuyện lập quốc. Chiến dịch tiếp thị của bộ phim nhấn mạnh các chủ đề về sự kiên cường, sự hy sinh và ý tưởng rằng những cá nhân bình thường có thể trở thành những nhà lãnh đạo định hình quốc gia, gắn kết hành trình cá nhân của Washington với các lý tưởng Mỹ rộng lớn hơn."
      },
      {
        en: "Ultimately, the article frames Young Washington as more than just a [biographical]{(thuộc) tiểu sử} film—it is presented as part of a larger cultural conversation about how history is remembered, [retold]{kể lại}, and used to shape [contemporary]{đương đại} understandings of leadership and national identity.",
        vi: "Cuối cùng, bài viết định khung bộ phim Young Washington không chỉ là một bộ phim tiểu sử — nó được trình bày như một phần của cuộc trò chuyện văn hóa rộng lớn hơn về cách lịch sử được ghi nhớ, được kể lại và được sử dụng để định hình những hiểu biết đương đại về khả năng lãnh đạo và bản sắc quốc gia."
      }
    ]
  },
  {
    source_id: "the-atlantic",
    source_url: "https://www.theatlantic.com/family/archive/2026/06/hasslers-drain-energy-relationships/2026-06",
    source_label: "The Atlantic",
    title: "There’s a Name for the People Who Drain You",
    title_vi: "Đã có tên gọi cho những người vắt kiệt năng lượng của bạn",
    category: "Family",
    category_vi: "Gia đình",
    excerpt: "The article explores new social science research on the concept of 'hasslers,' who consistently make life difficult through criticism.",
    excerpt_vi: "Bài viết khám phá nghiên cứu khoa học xã hội mới về khái niệm 'kẻ gây phiền toái', những người liên tục làm khó cuộc sống của bạn.",
    author: "Olga Khazan",
    read_time: "4 mins",
    image_url: "https://images.unsplash.com/photo-1542382257-201b7f9ec0b7?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        en: "The article explores new social science research on the concept of “hasslers,” a term used to describe people in one’s social network who consistently make life more difficult through criticism, conflict, or emotional [drain]{sự rút cạn/hao tổn}. While much of previous research has focused on the benefits of positive relationships for health and [longevity]{sự trường thọ}, the article highlights growing evidence that negative or stressful social [ties]{mối quan hệ/liên kết} can also have measurable effects on well-being.",
        vi: "Bài báo khám phá nghiên cứu khoa học xã hội mới về khái niệm \"hasslers\" (kẻ gây phiền toái), một thuật ngữ được sử dụng để mô tả những người trong mạng lưới xã hội của một người liên tục làm cho cuộc sống trở nên khó khăn hơn thông qua sự chỉ trích, xung đột hoặc sự hao tổn cảm xúc. Trong khi phần lớn nghiên cứu trước đây tập trung vào lợi ích của các mối quan hệ tích cực đối với sức khỏe và sự trường thọ, bài viết làm nổi bật bằng chứng ngày càng tăng cho thấy các mối liên kết xã hội tiêu cực hoặc căng thẳng cũng có thể có những tác động rõ rệt đối với thể trạng và hạnh phúc của con người."
      },
      {
        en: "The research cited in the piece comes from sociologists studying thousands of individuals who reported on people in their lives who regularly “caused problems” or “made life difficult.” These hasslers were often not strangers, but individuals [embedded]{được gắn liền/lồng ghép} in daily life, such as co-workers, roommates, and family members. Because these relationships are often unavoidable or socially necessary, participants frequently reported feeling [stuck]{bị mắc kẹt} with them even when they were [emotionally]{về mặt cảm xúc} draining.",
        vi: "Nghiên cứu được trích dẫn trong bài báo đến từ các nhà xã hội học nghiên cứu hàng ngàn cá nhân đã báo cáo về những người trong cuộc sống của họ thường xuyên \"gây ra rắc rối\" hoặc \"làm cho cuộc sống khó khăn\". Những kẻ gây phiền toái này thường không phải là người lạ, mà là các cá nhân gắn liền với cuộc sống hàng ngày, chẳng hạn như đồng nghiệp, bạn cùng phòng và các thành viên gia đình. Bởi vì các mối quan hệ này thường không thể tránh khỏi hoặc cần thiết về mặt xã hội, những người tham gia thường xuyên báo cáo cảm thấy bị mắc kẹt với họ ngay cả khi họ bị vắt kiệt về mặt cảm xúc."
      },
      {
        en: "A key finding discussed is that [exposure]{sự tiếp xúc} to hasslers is associated with higher levels of chronic stress, which in turn may [contribute]{góp phần} to negative health outcomes. The article references research suggesting links between [persistent]{dai dẳng/liên tục} social stress and outcomes such as anxiety, depression, [inflammation]{sự viêm nhiễm}, and even accelerated biological aging. However, it also emphasizes that not all relationships are purely harmful or beneficial—many contain a mix of support and frustration.",
        vi: "Một phát hiện chính được thảo luận là việc tiếp xúc với những kẻ gây phiền toái có liên quan đến mức độ căng thẳng mãn tính cao hơn, từ đó có thể góp phần dẫn đến các kết quả tiêu cực về sức khỏe. Bài viết tham khảo nghiên cứu cho thấy các mối liên kết giữa căng thẳng xã hội dai dẳng và các kết quả như lo âu, trầm cảm, sự viêm nhiễm, và thậm chí cả sự lão hóa sinh học nhanh chóng. Tuy nhiên, nó cũng nhấn mạnh rằng không phải tất cả các mối quan hệ đều hoàn toàn có hại hoặc có lợi — nhiều mối quan hệ chứa đựng sự pha trộn giữa hỗ trợ và thất vọng."
      },
      {
        en: "The article further discusses the complexity of family and close relationships, noting that some of the most emotionally [intense]{mãnh liệt/dữ dội} ties can also be the most difficult to manage. While hasslers can increase stress, completely [removing]{loại bỏ} them from one’s life is often unrealistic, especially when they are family members or work colleagues. Instead, the piece highlights strategies such as setting [boundaries]{ranh giới}, managing expectations, and balancing difficult relationships with more supportive ones.",
        vi: "Bài viết thảo luận thêm về sự phức tạp của gia đình và các mối quan hệ thân thiết, lưu ý rằng một số mối liên kết căng thẳng nhất về mặt cảm xúc cũng có thể là khó kiểm soát nhất. Trong khi những kẻ gây phiền toái có thể làm tăng căng thẳng, việc loại bỏ hoàn toàn họ khỏi cuộc sống của một người thường là không thực tế, đặc biệt là khi họ là thành viên gia đình hoặc đồng nghiệp tại nơi làm việc. Thay vào đó, bài viết nêu bật các chiến lược như thiết lập ranh giới, quản lý kỳ vọng và cân bằng các mối quan hệ khó khăn với các mối quan hệ hỗ trợ nhiều hơn."
      },
      {
        en: "Ultimately, the article argues that well-being is not simply about [maximizing]{tối đa hóa} positive relationships but about understanding the full emotional “ecosystem” of one’s social network. It suggests that while hasslers can be harmful, social connection itself remains [essential]{thiết yếu}, and the goal is not [isolation]{sự cô lập} but a healthier balance of supportive and stressful ties.",
        vi: "Cuối cùng, bài báo lập luận rằng sự hạnh phúc/thể trạng tốt không chỉ đơn thuần là tối đa hóa các mối quan hệ tích cực mà là hiểu toàn bộ \"hệ sinh thái\" cảm xúc trong mạng lưới xã hội của một người. Nó gợi ý rằng mặc dù những kẻ gây phiền toái có thể gây hại, nhưng bản thân sự kết nối xã hội vẫn là thiết yếu, và mục tiêu không phải là sự cô lập mà là một sự cân bằng lành mạnh hơn giữa các mối quan hệ hỗ trợ và các mối quan hệ căng thẳng."
      }
    ]
  },
  {
    source_id: "the-atlantic",
    source_url: "https://www.theatlantic.com/newsletters/archive/2026/06/trumps-g7-comments-middle-east-war/2026-06",
    source_label: "The Atlantic",
    title: "Trump’s G7 Comments Reveal Deep Misunderstanding of the Middle East War",
    title_vi: "Các bình luận G7 của Trump hé lộ sự hiểu lầm sâu sắc về cuộc chiến tranh Trung Đông",
    category: "Politics / Newsletters",
    category_vi: "Chính trị / Bản tin",
    excerpt: "The newsletter criticizes former U.S. President Donald Trump’s remarks at the 2026 G7 summit regarding the Middle East.",
    excerpt_vi: "Bản tin chỉ trích nhận xét của cựu Tổng thống Donald Trump tại hội nghị G7 năm 2026 về Trung Đông.",
    author: "Tom Nichols",
    read_time: "5 mins",
    image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        en: "The newsletter criticizes former U.S. President Donald Trump’s remarks at the 2026 G7 summit, arguing that his statements on the Iran war and broader Middle East dynamics reflect a fundamental misunderstanding of the conflict and its strategic [stakes]{lợi ích/rủi ro}. According to the piece, Trump [downplayed]{đã giảm nhẹ/nói giảm} earlier U.S. positions that framed Iran as a nuclear threat and instead described new Iranian leadership in unusually [conciliatory]{hòa giải/mang tính nhượng bộ} terms, a shift the author portrays as inconsistent with prior policy and detached from intelligence assessments.",
        vi: "Bản tin chỉ trích những nhận xét của cựu Tổng thống Mỹ Donald Trump tại hội nghị thượng đỉnh G7 năm 2026, lập luận rằng những tuyên bố của ông về cuộc chiến tranh Iran và động lực Trung Đông rộng lớn hơn phản ánh sự hiểu lầm cơ bản về cuộc xung đột và các rủi ro chiến lược của nó. Theo bài viết, Trump đã giảm nhẹ các lập trường trước đó của Hoa Kỳ coi Iran là một mối đe dọa hạt nhân, thay vào đó mô tả ban lãnh đạo mới của Iran bằng các thuật ngữ mang tính hòa giải bất thường, một sự thay đổi mà tác giả mô tả là không nhất quán với chính sách trước đây và tách rời khỏi các đánh giá tình báo."
      },
      {
        en: "The article highlights Trump’s apparent [contradictions]{những mâu thuẫn} regarding Iran’s nuclear program and regional behavior, noting that he minimized concerns about Iran’s highly enriched uranium stockpile while [simultaneously]{đồng thời} suggesting that diplomatic [engagement]{sự can dự/tương tác} had already effectively resolved core security issues. The author argues that this framing ignores the continued uncertainty surrounding Iran’s compliance and the unresolved nature of verification mechanisms.",
        vi: "Bài viết làm nổi bật những mâu thuẫn rõ ràng của Trump liên quan đến chương trình hạt nhân và hành vi trong khu vực của Iran, lưu ý rằng ông đã giảm thiểu những lo ngại về kho dự trữ uranium giàu mức độ cao của Iran đồng thời gợi ý rằng sự can dự ngoại giao đã giải quyết hiệu quả các vấn đề an ninh cốt lõi. Tác giả lập luận rằng cách định khung này phớt lờ sự không chắc chắn tiếp tục xung quanh sự tuân thủ của Iran và tính chất chưa được giải quyết của các cơ chế xác minh."
      },
      {
        en: "A significant portion of the commentary focuses on Trump’s remarks about regional actors, particularly Israel and Hezbollah. The piece suggests that Trump’s characterization of Hezbollah as a limited threat and his suggestion that Syria could manage the group reflect a misunderstanding of existing military and political realities in the region. The author argues that these statements risk [undermining]{làm suy yếu} long-standing U.S. alliances and complicating ongoing military and diplomatic [calculations]{những tính toán} among [regional]{(thuộc) khu vực} partners.",
        vi: "Một phần đáng kể của bài bình luận tập trung vào các nhận xét của Trump về các bên tham gia trong khu vực, đặc biệt là Israel và Hezbollah. Bài viết gợi ý rằng việc Trump mô tả Hezbollah như một mối đe dọa hạn chế và gợi ý của ông rằng Syria có thể quản lý nhóm này phản ánh sự hiểu lầm về các thực tế quân sự và chính trị hiện có trong khu vực. Tác giả lập luận rằng những tuyên bố này có nguy cơ làm suy yếu các liên minh lâu đời của Mỹ và làm phức tạp thêm các tính toán ngoại giao và quân sự đang diễn ra giữa các đối tác khu vực."
      },
      {
        en: "The newsletter further contends that Trump’s broader approach at the G7 reflects a [tendency]{xu hướng} to recast complex geopolitical conflicts in overly simplified terms, prioritizing narrative consistency over factual [coherence]{sự mạch lạc/nhất quán}. It argues that this approach leads to policy contradictions, particularly in how the U.S. [positions]{định vị/đặt vị trí} itself between Israel, Iran, and other regional actors during an active conflict.",
        vi: "Bản tin tranh luận thêm rằng cách tiếp cận rộng hơn của Trump tại G7 phản ánh xu hướng định hình lại các cuộc xung đột địa chính trị phức tạp bằng các thuật ngữ quá đơn giản, ưu tiên tính nhất quán của câu chuyện tự sự hơn là sự mạch lạc thực tế. Nó lập luận rằng cách tiếp cận này dẫn đến các mâu thuẫn chính sách, đặc biệt là trong việc Mỹ định vị chính mình như thế nào giữa Israel, Iran và các bên tham gia khu vực khác trong suốt một cuộc xung đột đang diễn ra."
      },
      {
        en: "Ultimately, the piece frames Trump’s comments as part of a pattern of foreign policy [rhetoric]{luận điệu/thuật hùng biện} that struggles to align with on-the-ground realities, suggesting that this gap between messaging and geopolitical [complexity]{sự phức tạp} could weaken U.S. [credibility]{uy tín/sự tin cậy} among allies and complicate diplomatic efforts to stabilize the Middle East.",
        vi: "Cuối cùng, tác phẩm định khung các bình luận của Trump như một phần của mô hình luận điệu chính sách đối ngoại vốn chật vật để phù hợp với thực tế trên thực địa, gợi ý rằng khoảng cách này giữa thông điệp và sự phức tạp địa chính trị có thể làm yếu đi uy tín của Mỹ đối với các đồng minh và làm phức tạp thêm các nỗ lực ngoại giao nhằm ổn định Trung Đông."
      }
    ]
  },
  {
    source_id: "the-atlantic",
    source_url: "https://www.theatlantic.com/science/archive/2026/06/heliconius-butterfly-longevity-diet-pollen/2026-06",
    source_label: "The Atlantic",
    title: "The Butterfly Longevity Diet",
    title_vi: "Chế độ ăn trường thọ của loài bướm",
    category: "Science",
    category_vi: "Khoa học",
    excerpt: "The article explores a surprising discovery about Heliconius butterflies, which defy typical insect lifespans.",
    excerpt_vi: "Bài viết khám phá khám phá đáng kinh ngạc về loài bướm Heliconius vượt qua tuổi thọ côn trùng thông thường.",
    author: "Ferris Jabr",
    read_time: "4 mins",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        en: "The article explores a surprising discovery about Heliconius butterflies, a genus of tropical butterflies that [defies]{thách thức} the typical pattern of extremely short insect lifespans. While most butterflies live only a few weeks in their adult stage, Heliconius species can survive for several months and, in some cases, close to a year. Even more unusually, they remain active and reproductively capable throughout much of their [extended]{được kéo dài} lives, showing little of the physical [decline]{sự suy giảm} normally associated with aging in insects.",
        vi: "Bài viết khám phá một khám phá đáng ngạc nhiên về bướm Heliconius, một chi bướm nhiệt đới thách thức mô hình điển hình về vòng đời cực ngắn của côn trùng. Trong khi hầu hết các loài bướm chỉ sống được vài tuần trong giai đoạn trưởng thành của chúng, các loài Heliconius có thể sống sót trong vài tháng và trong một số trường hợp là gần một năm. Thậm chí bất thường hơn, chúng vẫn hoạt động và có khả năng sinh sản trong suốt phần lớn cuộc đời kéo dài của mình, ít biểu hiện sự suy giảm thể chất thường liên quan đến sự lão hóa ở côn trùng."
      },
      {
        en: "A central focus of the article is the role of diet in this unusual longevity. Unlike most butterflies, which feed [primarily]{chủ yếu} on nectar, Heliconius butterflies also consume pollen. This behavior is rare among butterflies because pollen is nutritionally complex and difficult to process. The butterflies spend significant time collecting and [manipulating]{thao tác/xử lý} pollen using their [proboscis]{vòi (của côn trùng)}, effectively extracting amino acids and other nutrients that are not available in nectar alone.",
        vi: "Trọng tâm của bài viết là vai trò của chế độ ăn uống đối với tuổi thọ bất thường này. Không giống như hầu hết các loài bướm, vốn chủ yếu ăn mật hoa, bướm Heliconius cũng tiêu thụ phấn hoa. Hành vi này rất hiếm gặp ở bướm vì phấn hoa phức tạp về mặt dinh dưỡng và khó tiêu hóa. Những con bướm dành nhiều thời gian để thu thập và xử lý phấn hoa bằng vòi của chúng, chiết xuất hiệu quả các axit amin và các chất dinh dưỡng khác vốn không có sẵn trong riêng mật hoa."
      },
      {
        en: "Researchers suggest that this pollen-rich diet may be a key factor in extending lifespan and maintaining physical condition. Experimental studies referenced in the article show that butterflies with access to pollen live longer and maintain better body condition than those [restricted]{bị giới hạn} to nectar alone. However, the ability to consume pollen alone does not fully explain their longevity, as closely [related]{có họ hàng/liên quan} species do not gain the same lifespan benefits even when given similar diets, indicating that [evolutionary]{(thuộc) tiến hóa} adaptations beyond diet are also involved.",
        vi: "Các nhà nghiên cứu gợi ý rằng chế độ ăn giàu phấn hoa này có thể là một yếu tố quan trọng trong việc kéo dài tuổi thọ và duy trì tình trạng thể chất. Các nghiên cứu thực nghiệm được đề cập trong bài viết chỉ ra rằng những con bướm tiếp cận được với phấn hoa sống lâu hơn và duy trì thể trạng tốt hơn so với những con bị giới hạn ở riêng mật hoa. Tuy nhiên, khả năng tiêu thụ phấn hoa không hoàn toàn giải thích được tuổi thọ của chúng, vì các loài có họ hàng gần không đạt được những lợi ích về tuổi thọ tương tự ngay cả khi được cung cấp chế độ ăn tương tự, chỉ ra rằng các thích nghi tiến hóa vượt ra ngoài chế độ ăn uống cũng có liên quan."
      },
      {
        en: "The article also highlights that Heliconius butterflies appear to age more slowly than related species. Unlike typical butterflies, which show rapid decline in wing condition, strength, and reproductive ability, Heliconius individuals often remain active and capable until late in life. Scientists describe this as a form of “slowed [senescence]{sự già yếu/lão hóa},” where biological aging processes are [delayed]{bị trì hoãn} or reduced.",
        vi: "Bài báo cũng nhấn mạnh rằng bướm Heliconius dường như lão hóa chậm hơn so với các loài có liên quan. Không giống như loài bướm thông thường, vốn có sự suy giảm nhanh chóng về tình trạng cánh, sức mạnh và khả năng sinh sản, các cá thể Heliconius thường vẫn hoạt động và có năng lực cho đến cuối đời. Các nhà khoa học mô tả đây là một dạng \"lão hóa chậm lại\" (slowed senescence), nơi các quá trình lão hóa sinh học bị trì hoãn hoặc giảm bớt."
      },
      {
        en: "Ultimately, the piece frames Heliconius butterflies as an important [model]{mô hình} for understanding how diet and evolution can influence aging. Their unusual combination of long life, sustained reproductive ability, and unique feeding behavior challenges [assumptions]{các giả định} about insect lifespan and offers potential [insights]{sự hiểu biết sâu sắc} into the biological mechanisms of aging more broadly.",
        vi: "Cuối cùng, tác phẩm định khung bướm Heliconius như một mô hình quan trọng để hiểu cách chế độ ăn uống và sự tiến hóa có thể ảnh hưởng đến lão hóa. Sự kết hợp bất thường giữa đời sống dài, khả năng sinh sản bền vững và hành vi ăn uống độc đáo thách thức các giả định về tuổi thọ của côn trùng và đưa ra các hiểu biết sâu sắc tiềm năng về các cơ chế sinh học của sự lão hóa một cách rộng lớn hơn."
      }
    ]
  },
  {
    source_id: "the-atlantic",
    source_url: "https://www.theatlantic.com/ideas/archive/2026/06/voters-trump-defends-values/2026-06",
    source_label: "The Atlantic",
    title: "The Voters Who Believe That Trump Defends Their Values",
    title_vi: "Những cử tri tin rằng Trump đang bảo vệ các giá trị của họ",
    category: "Ideas",
    category_vi: "Ý kiến",
    excerpt: "The article examines why a significant portion of Donald Trump’s political base continues to support him.",
    excerpt_vi: "Bài viết tìm hiểu lý do vì sao một bộ phận cử tri trung thành của Donald Trump vẫn tiếp tục ủng hộ ông.",
    author: "Tim Alberta",
    read_time: "5 mins",
    image_url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        en: "The article examines why a significant portion of Donald Trump’s political base continues to support him despite widespread concerns among critics that his governing style challenges traditional [democratic]{(thuộc) dân chủ} norms. Based on [field]{thực địa} reporting and interviews conducted in states such as Wyoming, Michigan, and South Carolina, the piece argues that Trump’s support cannot be explained simply by misinformation or blind [loyalty]{lòng trung thành}, but instead reflects a deeper disconnect between many voters and national political institutions.",
        vi: "Bài viết xem xét lý do tại sao một bộ phận đáng kể trong cử tri cơ sở của Donald Trump tiếp tục ủng hộ ông bất chấp những lo ngại rộng rãi của giới chỉ trích rằng phong cách điều hành của ông thách thức các chuẩn mực dân chủ truyền thống. Dựa trên các báo cáo thực địa và phỏng vấn được thực hiện tại các tiểu bang như Wyoming, Michigan và South Carolina, tác phẩm lập luận rằng sự ủng hộ dành cho Trump không thể được giải thích đơn giản bằng thông tin sai lệch hay lòng trung thành mù quáng, mà thay vào đó phản ánh sự mất kết nối sâu sắc hơn giữa nhiều cử tri và các tổ chức chính trị quốc gia."
      },
      {
        en: "A central argument is that many Trump supporters view the federal government as having drifted away from what they consider core American values—such as faith, family, freedom, and local community. For these voters, trust in institutions like Congress, the courts, and federal agencies has [eroded]{bị xói mòn} over time, often replaced by [reliance]{sự tin cậy/dựa dẫm} on local networks such as churches, community groups, and informal social ties. In this context, Trump is perceived less as a traditional [ideological]{(thuộc) hệ tư tưởng} leader and more as a political actor willing to challenge institutions they already see as unresponsive or disconnected from their lives.",
        vi: "Một lập luận trung tâm là nhiều người ủng hộ Trump coi chính phủ liên bang đã trôi xa khỏi những gì họ coi là giá trị cốt lõi của Mỹ — chẳng hạn như đức tin, gia đình, tự do và cộng đồng địa phương. Đối với những cử tri này, niềm tin vào các tổ chức như Quốc hội, tòa án và các cơ quan liên bang đã bị xói mòn theo thời gian, thường được thay thế bằng sự phụ thuộc vào các mạng lưới địa phương như nhà thờ, các nhóm cộng đồng và các mối liên kết xã hội không chính thức. Trong bối cảnh này, Trump ít được coi là một nhà lãnh đạo hệ tư tưởng truyền thống mà giống như một tác nhân chính trị sẵn sàng thách thức các tổ chức mà cử tri vốn đã thấy là không phản hồi hoặc tách rời khỏi cuộc sống của họ."
      },
      {
        en: "The article highlights that this worldview does not necessarily reflect an anti-democratic ideology. Instead, many respondents still express support for democratic principles in the abstract, but prioritize what they see as moral or cultural [restoration]{sự phục hồi/khôi phục} over institutional stability. As a result, concerns about democratic [erosion]{sự xói mòn} raised by political [elites]{giới tinh hoa} often carry less weight than perceived failures of governance, cultural change, or economic displacement experienced at the local level.",
        vi: "Bài viết nhấn mạnh rằng thế giới quan này không nhất thiết phản ánh một hệ tư tưởng chống dân chủ. Thay vào đó, nhiều người được hỏi vẫn bày tỏ sự ủng hộ đối với các nguyên tắc dân chủ một cách trừu tượng, nhưng ưu tiên những gì họ coi là sự phục hồi đạo đức hoặc văn hóa hơn là sự ổn định của thể chế. Kết quả là, những lo ngại về sự suy yếu dân chủ do giới tinh hoa chính trị đưa ra thường ít có trọng lượng hơn so với các thất bại trong quản trị, sự thay đổi văn hóa hoặc sự dịch chuyển kinh tế mà họ trải qua ở cấp độ địa phương."
      },
      {
        en: "The piece also explores the diversity within the Trump [coalition]{liên minh}, noting that it includes groups with different motivations—from strong ideological conservatives to voters primarily driven by cultural [resentment]{sự oán giận/bất bình} or distrust of elites. Despite these differences, they are unified by a shared belief that mainstream institutions no longer represent their interests or values, making Trump a [vehicle]{phương tiện/công cụ} for expressing broader dissatisfaction with the political system.",
        vi: "Tác phẩm cũng khám phá sự đa dạng bên trong liên minh của Trump, lưu ý rằng nó bao gồm các nhóm có động lực khác nhau — từ những người bảo thủ có tư tưởng mạnh mẽ đến những cử tri chủ yếu bị thúc đẩy bởi sự bất bình văn hóa hoặc sự không tin tưởng vào giới tinh hoa. Bất chấp những khác biệt này, họ thống nhất bởi một niềm tin chung rằng các thể chế chính thống không còn đại diện cho lợi ích hoặc giá trị của họ nữa, biến Trump thành một công cụ để bày tỏ sự bất mãn rộng lớn hơn đối với hệ thống chính trị."
      },
      {
        en: "Ultimately, the article argues that efforts to defend democracy that focus solely on institutional rules or abstract principles may fail to [resonate]{tạo sự đồng cảm/vang vọng} with these voters. Instead, the durability of Trump’s support reflects a deeper crisis of trust in governance itself, suggesting that political conflict in the United States is increasingly [rooted]{bắt nguồn} in competing value systems rather than [conventional]{thông thường/truyền thống} policy disagreements.",
        vi: "Cuối cùng, bài viết lập luận rằng những nỗ lực bảo vệ nền dân chủ chỉ tập trung vào các quy tắc thể chế hoặc các nguyên tắc trừu tượng có thể không tạo được sự đồng cảm với các cử tri này. Thay vào đó, sự bền vững trong sự ủng hộ dành cho Trump phản ánh một cuộc khủng hoảng niềm tin sâu sắc hơn vào chính việc quản trị, gợi ý rằng xung đột chính trị ở Hoa Kỳ ngày càng bắt nguồn từ các hệ thống giá trị cạnh tranh lẫn nhau hơn là những bất đồng chính sách thông thường."
      }
    ]
  },
  {
    source_id: "the-atlantic",
    source_url: "https://www.theatlantic.com/magazine/archive/1921/06/relativity-and-the-absurdities-of-alice/1921-06",
    source_label: "The Atlantic",
    title: "Relativity and the Absurdities of Alice",
    title_vi: "Thuyết tương đối và những điều phi lý của Alice",
    category: "Archive / Science",
    category_vi: "Lưu trữ / Khoa học",
    excerpt: "The article explores the counterintuitive nature of Albert Einstein’s theory of relativity comparing it to Alice in Wonderland.",
    excerpt_vi: "Bài viết khám phá bản chất ngược trực giác của thuyết tương đối bằng cách so sánh nó với Alice ở xứ sở thần tiên.",
    author: "Editorial Staff",
    read_time: "4 mins",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        en: "The article explores the [counterintuitive]{ngược với trực giác} nature of Albert Einstein’s theory of relativity by comparing its strange implications to the [surreal]{kỳ dị/siêu thực} logic found in Lewis Carroll’s Alice in Wonderland. It argues that many of the conclusions drawn from relativity—particularly the distortion of time, space, and simultaneity at high speeds—feel as bizarre and illogical to everyday [intuition]{trực giác} as the shifting rules and impossible events in Alice’s fictional world.",
        vi: "Bài báo khám phá bản chất ngược với trực giác của thuyết tương đối của Albert Einstein bằng cách so sánh những hàm ý kỳ lạ của nó với logic siêu thực được tìm thấy trong tác phẩm Alice ở xứ sở thần tiên của Lewis Carroll. Nó lập luận rằng nhiều kết luận rút ra từ thuyết tương đối — đặc biệt là sự bóp méo thời gian, không gian và tính đồng thời ở tốc độ cao — có cảm giác kỳ dị và phi lý đối với trực giác hàng ngày giống như các quy tắc thay đổi và các sự kiện bất khả thi trong thế giới hư cấu của Alice."
      },
      {
        en: "A central theme is the way relativity challenges common-sense ideas about absolute time and space. The article explains that, under Einstein’s theory, measurements of time and distance are not fixed but depend on the observer’s [frame of reference]{hệ quy chiếu}. This leads to [paradoxical-seeming]{có vẻ nghịch lý} outcomes, such as moving clocks running slower than stationary ones, or two observers disagreeing on whether events occur [simultaneously]{một cách đồng thời}. The author uses the Alice metaphor to suggest that physics at this level behaves like a world with its own internal logic, even if it contradicts everyday experience.",
        vi: "Một chủ đề trung tâm là cách thuyết tương đối thách thức các ý tưởng thông thường về thời gian và không gian tuyệt đối. Bài viết giải thích rằng, theo thuyết của Einstein, các phép đo thời gian và khoảng cách không cố định mà phụ thuộc vào hệ quy chiếu của người quan sát. Điều này dẫn đến các kết quả có vẻ nghịch lý, chẳng hạn như đồng hồ chuyển động chạy chậm hơn đồng hồ đứng yên, hoặc hai người quan sát không thống nhất về việc các sự kiện có diễn ra đồng thời hay không. Tác giả sử dụng phép ẩn dụ Alice để gợi ý rằng vật lý ở cấp độ này hoạt động giống như một thế giới có logic nội bộ riêng của nó, ngay cả khi nó mâu thuẫn với trải nghiệm hàng ngày."
      },
      {
        en: "The piece also reflects the early 20th-century cultural reaction to relativity, when Einstein’s ideas were still relatively new and widely misunderstood outside scientific circles. It notes that many readers and commentators initially [interpreted]{đã giải thích/hiểu} relativity not just as a scientific theory but as a philosophical statement about the nature of reality—sometimes even extending the idea of “relativity” into [moral]{(thuộc) đạo đức}, artistic, or cultural [domains]{các lĩnh vực}, often in ways that Einstein himself rejected.",
        vi: "Tác phẩm cũng phản ánh phản ứng văn hóa đầu thế kỷ 20 đối với thuyết tương đối, khi các ý tưởng của Einstein vẫn còn tương đối mới mẻ và bị hiểu lầm rộng rãi bên ngoài giới khoa học. Nó lưu ý rằng nhiều độc giả và nhà bình luận ban đầu đã diễn giải thuyết tương đối không chỉ như một lý thuyết khoa học mà còn là một tuyên bố triết học về bản chất của thực tại — đôi khi thậm chí còn mở rộng ý tưởng về \"tính tương đối\" vào các lĩnh vực đạo đức, nghệ thuật hoặc văn hóa, thường theo những cách mà chính Einstein đã bác bỏ."
      },
      {
        en: "Ultimately, the article frames relativity as a revolutionary break from Newtonian physics, emphasizing both its scientific [rigor]{sự nghiêm ngặt/chặt chẽ} and its psychological difficulty for the human mind to fully [grasp]{nắm bắt/hiểu thấu}. By linking it to the absurd logic of Alice in Wonderland, it highlights the [tension]{sự căng thẳng/xung đột} between scientific truth and intuitive understanding, suggesting that modern physics requires accepting a reality that can feel fundamentally alien to everyday perception.",
        vi: "Cuối cùng, bài viết định khung thuyết tương đối như một sự đột phá mang tính cách mạng khỏi vật lý học Newton, nhấn mạnh cả tính nghiêm ngặt khoa học và khó khăn tâm lý để tâm trí con người có thể nắm bắt đầy đủ. Bằng cách liên kết nó với logic phi lý của Alice ở xứ sở thần tiên, bài viết nêu bật sự căng thẳng giữa sự thật khoa học và hiểu biết trực giác, gợi ý rằng vật lý hiện đại đòi hỏi phải chấp nhận một thực tại có thể đem lại cảm giác hoàn toàn xa lạ đối với nhận thức hàng ngày."
      }
    ]
  }
];

async function main() {
  console.log("Inserting 6 new bilingual articles into the-atlantic...");
  for (const article of articlesToInsert) {
    console.log(`Inserting: "${article.title}"...`);
    const { data, error } = await supabaseAdmin
      .from("bilingual_articles")
      .insert(article)
      .select();

    if (error) {
      console.error(`Error inserting "${article.title}":`, error);
    } else {
      console.log(`Successfully inserted: "${article.title}"`, data?.[0]?.id);
    }
  }
}

main().catch(console.error);
