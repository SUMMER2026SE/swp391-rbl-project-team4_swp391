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
  console.log("Updating active Writing Task 1 in database...");

  // Update wt_t1_001 (066be55c-f20b-40b3-8faf-4f31bafd1213)
  const { data, error } = await supabaseAdmin
    .from("writing_tasks")
    .update({
      title: "Line Graph — Tourists to Scotland Attractions",
      description: "The line graph below shows the percentage of tourists to Scotland who visited different attractions between 1980 and 2010. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      thumbnail_url: "/assets/writing/scotland-tourists.png",
      cloudinary_url: "/assets/writing/scotland-tourists.png",
      tags: ["line graph", "tourism", "scotland", "comparison", "task1"]
    })
    .eq("id", "066be55c-f20b-40b3-8faf-4f31bafd1213")
    .select();

  if (error) {
    console.error("Error updating Task 1 wt_t1_001:", error);
  } else {
    console.log("Successfully updated wt_t1_001:", data);
  }

  // Update wt_t1_002 (df3f699e-3166-44c5-b507-17625c869533) as well just in case
  const { data: data2, error: error2 } = await supabaseAdmin
    .from("writing_tasks")
    .update({
      title: "Line Graph — Tourists to Scotland Attractions",
      description: "The line graph below shows the percentage of tourists to Scotland who visited different attractions between 1980 and 2010. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      thumbnail_url: "/assets/writing/scotland-tourists.png",
      cloudinary_url: "/assets/writing/scotland-tourists.png",
      tags: ["line graph", "tourism", "scotland", "comparison", "task1"]
    })
    .eq("id", "df3f699e-3166-44c5-b507-17625c869533")
    .select();

  if (error2) {
    console.error("Error updating Task 1 wt_t1_002:", error2);
  } else {
    console.log("Successfully updated wt_t1_002:", data2);
  }
}

main().catch(console.error);
