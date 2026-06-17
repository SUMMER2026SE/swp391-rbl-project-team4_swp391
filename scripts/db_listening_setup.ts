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
  console.log("=== BƯỚC 1: XÓA DATA CŨ IN listening_tasks ===");
  const { data: deleteData, error: deleteErr } = await supabaseAdmin
    .from("listening_tasks")
    .delete()
    .neq("lesson_id", -999); // deletes all since none has lesson_id -999

  if (deleteErr) {
    console.error("Lỗi khi xóa data:", deleteErr);
    process.exit(1);
  }
  console.log("Đã chạy lệnh xóa toàn bộ data cũ.");

  // Verify
  const { count, error: countErr } = await supabaseAdmin
    .from("listening_tasks")
    .select("*", { count: "exact", head: true });

  if (countErr) {
    console.error("Lỗi khi đếm số record:", countErr);
    process.exit(1);
  }
  console.log(`Verify: Số lượng bản ghi hiện tại trong listening_tasks = ${count}`);

  console.log("\n=== BƯỚC 2: INSERT ĐỀ MỚI ===");
  const tasksToInsert = [
    {
      lesson_id: 1,
      lesson_name: 'IELTS Listening Practice Test — Section 1: Library Registration',
      audio_src: '/audio/tasks/section1.mp3',
      challenges: [
        {"id":"lt1c1","text":"Address: 15 _______ Street, Westville.","answer":"Oak"},
        {"id":"lt1c2","text":"Postcode:","answer":"SW6 4BT"},
        {"id":"lt1c3","text":"Occupation:","answer":"teacher"},
        {"id":"lt1c4","text":"Date of Birth: 12th _______, 1994.","answer":"March"},
        {"id":"lt1c5","text":"Type of membership: (Gold / Silver / Basic)","answer":"Gold"},
        {"id":"lt1c6","text":"Card number:","answer":"GL2049"},
        {"id":"lt1c7","text":"Preference for notifications: by","answer":"email"},
        {"id":"lt1c8","text":"Number of books allowed:","answer":"6"},
        {"id":"lt1c9","text":"Fine for late return: _______ pence per day.","answer":"10"},
        {"id":"lt1c10","text":"Need to provide a _______ for ID (e.g., Passport).","answer":"photograph"}
      ],
      metadata: {
        topic: "daily_life",
        difficulty: "beginner",
        question_type: "form_completion",
        total_questions: 10
      }
    },
    {
      lesson_id: 2,
      lesson_name: 'IELTS Listening Practice Test — Section 2: Town Historical Museum Tour',
      audio_src: '/audio/tasks/section2.mp3',
      challenges: [
        {"id":"lt2c1","text":"Information Desk:","answer":"B","type":"map"},
        {"id":"lt2c2","text":"Gift Shop:","answer":"A","type":"map"},
        {"id":"lt2c3","text":"Ancient Pottery Room:","answer":"F","type":"map"},
        {"id":"lt2c4","text":"Cafe:","answer":"G","type":"map"},
        {"id":"lt2c5","text":"Cloakroom:","answer":"H","type":"map"},
        {"id":"lt2c6","text":"The museum was originally built as a:","answer":"A","options":["Private residence","Town Hall","Hospital"],"type":"mcq"},
        {"id":"lt2c7","text":"What is new in the museum this year?","answer":"C","options":["The interactive screens","The audio guides","The rooftop garden"],"type":"mcq"},
        {"id":"lt2c8","text":"Photography is allowed ONLY in:","answer":"A","options":["The main hall","The temporary exhibition","The permanent galleries"],"type":"mcq"},
        {"id":"lt2c9","text":"The most famous exhibit is:","answer":"C","options":["The Viking sword","The Victorian clock","The Roman mosaic"],"type":"mcq"},
        {"id":"lt2c10","text":"At the end of the tour, visitors will receive:","answer":"C","options":["A discount voucher","A free map","A souvenir postcard"],"type":"mcq"}
      ],
      metadata: {
        topic: "culture",
        difficulty: "intermediate",
        question_type: "map_labelling+mcq",
        total_questions: 10
      }
    },
    {
      lesson_id: 3,
      lesson_name: 'IELTS Listening Practice Test — Section 3: Marketing Module Discussion',
      audio_src: '/audio/tasks/section3.mp3',
      challenges: [
        {"id":"lt3c1","text":"Consumer Behavior:","answer":"D","options":["Too much theory","Very practical","Poorly organized","Inspiring lecturers","Difficult assessment","Useful for future jobs","Boring reading material"],"type":"matching"},
        {"id":"lt3c2","text":"Digital Marketing:","answer":"F","options":["Too much theory","Very practical","Poorly organized","Inspiring lecturers","Difficult assessment","Useful for future jobs","Boring reading material"],"type":"matching"},
        {"id":"lt3c3","text":"Market Research:","answer":"E","options":["Too much theory","Very practical","Poorly organized","Inspiring lecturers","Difficult assessment","Useful for future jobs","Boring reading material"],"type":"matching"},
        {"id":"lt3c4","text":"Business Ethics:","answer":"A","options":["Too much theory","Very practical","Poorly organized","Inspiring lecturers","Difficult assessment","Useful for future jobs","Boring reading material"],"type":"matching"},
        {"id":"lt3c5","text":"Public Relations:","answer":"B","options":["Too much theory","Very practical","Poorly organized","Inspiring lecturers","Difficult assessment","Useful for future jobs","Boring reading material"],"type":"matching"},
        {"id":"lt3c6","text":"The students decided to choose a _______ company for their case study.","answer":"local"},
        {"id":"lt3c7","text":"Liam will be responsible for the _______ part of the presentation.","answer":"financial"},
        {"id":"lt3c8","text":"They need to submit the first draft by next _______.","answer":"Friday"},
        {"id":"lt3c9","text":"Professor Thompson suggested they use _______ to gather data.","answer":"surveys"},
        {"id":"lt3c10","text":"The final project is worth _______ percent of the total grade.","answer":"40"}
      ],
      metadata: {
        topic: "education",
        difficulty: "intermediate",
        question_type: "matching+sentence_completion",
        total_questions: 10
      }
    },
    {
      lesson_id: 4,
      lesson_name: 'IELTS Listening Practice Test — Section 4: The History and Impact of Coffee',
      audio_src: '/audio/tasks/section4.mp3',
      challenges: [
        {"id":"lt4c1","text":"Coffee was first discovered in Ethiopia after a goat herder noticed his goats became more _______ after eating certain berries.","answer":"energetic"},
        {"id":"lt4c2","text":"The first coffee houses were places for _______ and political discussion.","answer":"socialising"},
        {"id":"lt4c3","text":"In the 17th century, the Dutch smuggled coffee seeds out of Yemen to plant in their _______.","answer":"colonies"},
        {"id":"lt4c4","text":"Coffee became a major global commodity, leading to the rise of the Coffee _______ in London.","answer":"House"},
        {"id":"lt4c5","text":"Today, Brazil is the world largest _______ of coffee.","answer":"producer"},
        {"id":"lt4c6","text":"There are two main types of coffee beans: Arabica and _______.","answer":"Robusta"},
        {"id":"lt4c7","text":"Arabica beans are generally considered to have a better _______.","answer":"flavour"},
        {"id":"lt4c8","text":"Fair Trade certification ensures that _______ receive a decent price for their products.","answer":"farmers"},
        {"id":"lt4c9","text":"Traditional coffee farming was shade-grown which supported _______.","answer":"biodiversity"},
        {"id":"lt4c10","text":"Modern methods often involve clearing forests which can lead to soil _______.","answer":"erosion"}
      ],
      metadata: {
        topic: "environment",
        difficulty: "advanced",
        question_type: "summary_completion",
        total_questions: 10
      }
    }
  ];

  const { data: insertData, error: insertErr } = await supabaseAdmin
    .from("listening_tasks")
    .insert(tasksToInsert)
    .select("lesson_id, lesson_name, audio_src");

  if (insertErr) {
    console.error("Lỗi khi insert:", insertErr);
    process.exit(1);
  }

  console.log("Đã insert đề thi mới thành công!");
  console.log("Verify data sau khi insert:", insertData);
}

main().catch(console.error);
