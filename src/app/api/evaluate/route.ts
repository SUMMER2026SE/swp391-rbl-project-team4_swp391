import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { category, payload } = await req.json();

    if (!category || !payload) {
      return NextResponse.json({ error: "Missing category or payload" }, { status: 400 });
    }

    let prompt = "";

    if (category === "vocab_sentence") {
      const { word, definition, pos, sentence } = payload;
      prompt = `You are a STRICT IELTS examiner grading a single student sentence for vocabulary practice. Be rigorous and honest — do NOT inflate scores. Most learner sentences are band 5–6; band 7+ must be earned.

Target word: "${word}" (${pos})
Word definition: ${definition}
Student's sentence: "${sentence}"

Grade the sentence on a 0–9 IELTS band scale using these calibrated descriptors:
- Band 9: Flawless, fully natural, sophisticated. Precise word choice with strong collocations and complex, well-controlled structure.
- Band 7–8: Grammatically correct AND shows range — a complex/compound structure, a less common but accurate collocation, or precise nuance. Natural and idiomatic.
- Band 6: Correct and clear but SIMPLE — basic structure (e.g. "X is so beautiful"), common/generic vocabulary, no complexity or notable range.
- Band 5: Communicates meaning but with a noticeable error, awkward phrasing, or very basic/childish construction.
- Band 4 or below: Frequent errors, the word is misused, or meaning is unclear.

STRICT RULES:
- A short, simple, grammatically-correct sentence (e.g. "The jungle is so beautiful") is BAND 5–6, NOT 7. Reserve 7+ for genuine grammatical range or natural collocation.
- Set "is_correct": true ONLY if the sentence is grammatically correct AND uses the target word with its given meaning. Otherwise false.
- Set "uses_word": false if the target word (or a valid inflection) is missing or used with a wrong meaning — then band must be ≤ 4.
- "correction" must be a genuinely IMPROVED, higher-band rewrite (richer structure/collocation), NOT a copy of the student's sentence.
- List concrete issues in "errors" (grammar, collocation, word_form, register). Empty array only if the sentence is truly band 8+.
- "feedback_vi" in Vietnamese: state the band, WHY (cite the actual structure/word choice), and one specific tip to reach a higher band.

Return ONLY valid JSON: { "is_correct": true, "uses_word": true, "band": 6.0, "feedback_vi": "...", "correction": "...", "errors": [{ "type": "...", "issue": "...", "fix": "..." }] }`;

    } else if (category === "vocab_generate_sentence") {
      const { word, definition, pos } = payload;
      prompt = `You are an expert English teacher creating an IELTS-appropriate example sentence for a student.
Target word: "${word}" (${pos})
Meaning: ${definition}

Create exactly ONE short, natural, and idiomatic sentence that clearly demonstrates the meaning of the target word.
The sentence should be band 6.0-7.0 level—natural but not overly complex. Keep it under 15 words if possible.

Return ONLY valid JSON: { "sentence": "The example sentence containing the target word." }`;
    } else {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter error:", errText);
      return NextResponse.json(
        { error: `OpenRouter error ${res.status}: ${errText}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "";

    let evaluation = null;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      evaluation = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse evaluation JSON", content);
      return NextResponse.json({ error: "Failed to parse response" }, { status: 500 });
    }

    return NextResponse.json({ evaluation });
  } catch (error: any) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate" },
      { status: 500 }
    );
  }
}
