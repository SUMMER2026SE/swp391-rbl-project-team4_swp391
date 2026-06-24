import { NextRequest, NextResponse } from "next/server";

async function googleTranslateChunk(text: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Google Translate HTTP ${res.status}`);
  const data = await res.json() as [[string, string][]][];
  return data[0].map(item => item[0]).join("");
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json() as { text: string };
    if (!text?.trim()) return NextResponse.json({ error: "Empty text" }, { status: 400 });

    // Strip manual gloss annotations [word]{meaning} → keep only the word
    const cleaned = text.replace(/\[(.*?)\]\{.*?\}/g, "$1");

    // Split by double newlines into paragraphs, translate each independently
    const chunks = cleaned.split(/\n\s*\n/).map(c => c.replace(/\n/g, " ").trim()).filter(Boolean);
    const translated = await Promise.all(chunks.map(chunk => googleTranslateChunk(chunk)));

    return NextResponse.json({ translated: translated.join("\n\n") });
  } catch (err) {
    console.error("Translate route error:", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 502 });
  }
}
