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

// Map of article titles to verified working image URLs
const imageUpdates = [
  {
    title: "Argentina 3-0 Algeria: World Cup Group J match report",
    newUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "How World Cup 2026 debutants earned their place in the finals",
    newUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Do You Wake Up at the Same Time Every Day? Your Chronotype May Explain Why",
    newUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "What Adults Lost When Kids Stopped Playing in the Street",
    newUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80"
  }
];

async function main() {
  console.log("Updating remaining broken image URLs in Supabase with verified IDs...");
  for (const update of imageUpdates) {
    console.log(`Updating image for: "${update.title}"...`);
    const { data, error } = await supabaseAdmin
      .from("bilingual_articles")
      .update({ image_url: update.newUrl })
      .eq("title", update.title)
      .select();

    if (error) {
      console.error(`❌ Error updating "${update.title}":`, error);
    } else {
      console.log(`✅ Successfully updated: "${update.title}" (Matches: ${data?.length})`);
    }
  }
}

main().catch(console.error);
