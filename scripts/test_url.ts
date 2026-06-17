

async function main() {
  const urls = [
    "https://kaoybbpezkkmufzbhxru.supabase.co/storage/v1/object/public/audio/tasks/section_1_aea10c968b.mp3",
    "https://kaoybbpezkkmufzbhxru.supabase.co/storage/v1/object/public/audio/tasks/section_2_b945e57e35.wav",
    "https://kaoybbpezkkmufzbhxru.supabase.co/storage/v1/object/public/audio/tasks/section_3_e4490fbb5e.wav",
    "https://kaoybbpezkkmufzbhxru.supabase.co/storage/v1/object/public/audio/tasks/section_4_14493b1299.wav"
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "GET" });
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.status} ${res.statusText}`);
      if (res.status !== 200) {
        const body = await res.text();
        console.log("Error Body:", body);
      }
      console.log("-----------------------------------------------");
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
    }
  }
}

main().catch(console.error);
