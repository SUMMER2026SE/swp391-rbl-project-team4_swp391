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
  console.log("Updating listening_tasks audio_src paths to match the actual files uploaded to storage...");

  const updates = [
    { id: 1, path: "/audio/Tasks/section_1_aea10c968b.mp3" },
    { id: 2, path: "/audio/Tasks/section_2_b945e57e35.wav" },
    { id: 3, path: "/audio/Tasks/section_3_e4490fbb5e.wav" },
    { id: 4, path: "/audio/Tasks/section_4_14493b1299.wav" },
  ];

  for (const update of updates) {
    const { data, error } = await supabaseAdmin
      .from("listening_tasks")
      .update({ audio_src: update.path })
      .eq("lesson_id", update.id)
      .select("lesson_id, audio_src");

    if (error) {
      console.error(`Error updating lesson ${update.id}:`, error);
    } else {
      console.log(`Updated lesson ${update.id} successfully:`, data);
    }
  }

  // Print final result
  const { data: finalRows } = await supabaseAdmin
    .from("listening_tasks")
    .select("lesson_id, lesson_name, audio_src")
    .order("lesson_id");

  console.log("Final Database Rows:", finalRows);
}

main().catch(console.error);
