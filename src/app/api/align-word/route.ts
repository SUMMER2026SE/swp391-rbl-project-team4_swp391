import { NextRequest, NextResponse } from "next/server";

async function googleTranslateWord(word: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(word)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as any;
  return data[0].map((item: any) => item[0]).join("").trim();
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json() as { word: string };
    if (!word?.trim()) return NextResponse.json({ phrase: "" });
    const phrase = await googleTranslateWord(word.trim());
    return NextResponse.json({ phrase });
  } catch (err) {
    console.error("Align-word error:", err);
    return NextResponse.json({ phrase: "" });
  }
}
