import { NextRequest, NextResponse } from "next/server";

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','of','for','is','are',
  'was','were','has','have','had','do','does','did','will','can','could',
  'should','would','from','by','with','as','into','that','this','it','its',
  'also','such','even','now','one','most','been','be','not','no','so','if',
  'when','than','more','some','many','they','their','we','our','you','he',
  'she','i','my','his','her','about','which','who','what','there','then',
  'just','very','up','out','only','after','before','these','those','over',
  'still','between','each','both','during','without','through','any','all',
]);

async function googleTranslateBatch(words: string[]): Promise<string[]> {
  if (words.length === 0) return [];
  const text = words.join("\n");
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as any;
  const full = data[0].map((item: any) => item[0]).join("");
  return full.split("\n");
}

export async function POST(request: NextRequest) {
  try {
    const { paragraphs } = await request.json() as { paragraphs: { en: string }[] };
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const words = (paragraphs[0].en.match(/\S+/g) || []);
    const glosses: (string | null)[] = new Array(words.length).fill(null);

    const targets: { idx: number; clean: string }[] = [];
    words.forEach((w, i) => {
      const clean = w.replace(/[.,!?;:'"()[\]{}]/g, "").toLowerCase();
      if (!STOP_WORDS.has(clean) && clean.length >= 3) {
        targets.push({ idx: i, clean });
      }
    });

    if (targets.length > 0) {
      const translations = await googleTranslateBatch(targets.map(t => t.clean));
      targets.forEach((t, i) => {
        glosses[t.idx] = translations[i]?.trim() || null;
      });
    }

    return NextResponse.json({ glosses });
  } catch (err) {
    console.error("Bilingual align error:", err);
    return NextResponse.json({ glosses: [] });
  }
}
