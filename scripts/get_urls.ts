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
  console.log("Listing files in 'audio' root folder...");
  const { data: rootFiles } = await supabaseAdmin.storage.from('audio').list();
  console.log("Root files:", rootFiles);

  console.log("\nListing files in 'audio' tasks/ folder...");
  const { data: taskFiles } = await supabaseAdmin.storage.from('audio').list('tasks');
  console.log("Task files:", taskFiles);

  if (taskFiles && taskFiles.length > 0) {
    const fileName = taskFiles[0].name;
    const path = `tasks/${fileName}`;
    const { data: { publicUrl } } = supabaseAdmin.storage.from('audio').getPublicUrl(path);
    console.log(`\nGenerated Public URL for '${path}':`, publicUrl);
    
    // Test fetching it
    const res = await fetch(publicUrl, { method: "GET" });
    console.log(`Fetch Status: ${res.status} ${res.statusText}`);
    if (res.status !== 200) {
      const text = await res.text();
      console.log("Error response body:", text);
    }
  }
}

main().catch(console.error);
