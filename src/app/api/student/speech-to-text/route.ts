import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getGroqKeys } from "@/lib/groq";

const GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.5-flash";
const MAX_FILE_BYTES = 25 * 1024 * 1024;

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const mockUserId = request.headers.get("x-mock-user-id") || new URL(request.url).searchParams.get("mockUserId");
  if (mockUserId) {
    return { id: mockUserId, email: `${mockUserId}@example.com`, name: "Mock Student" };
  }

  if (!token) return null;

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

function extensionFromMime(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("mp4") || mime.includes("m4a")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  return "webm";
}

/**
 * Kiểm tra chữ ký đầu file để chắc chắn đây là audio thật.
 * Cần thiết vì nhánh fallback dùng LLM: đưa dữ liệu rác vào thì nó BỊA ra
 * transcript thay vì báo lỗi (Whisper thì trả rỗng). Chặn ở đây vừa tránh
 * transcript ảo, vừa đỡ tốn một lượt gọi API.
 */
function looksLikeAudio(buf: Buffer): boolean {
  if (buf.length < 12) return false;

  const ascii = (start: number, len: number) => buf.subarray(start, start + len).toString("ascii");

  // WebM / Matroska (Chrome, Firefox)
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return true;
  // WAV
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WAVE") return true;
  // Ogg / Opus
  if (ascii(0, 4) === "OggS") return true;
  // MP4 / M4A (Safari)
  if (ascii(4, 4) === "ftyp") return true;
  // MP3
  if (ascii(0, 3) === "ID3") return true;
  if (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return true;

  return false;
}

/**
 * Thử Groq lần lượt qua từng key. Trả về transcript, hoặc null nếu hết đường.
 * 429 / 5xx thì đổi key thử tiếp; 4xx khác (file hỏng, quá dài...) thì dừng luôn
 * vì đổi key cũng không cứu được.
 */
async function transcribeWithGroq(
  buffer: Buffer,
  mimeType: string,
  language: string
): Promise<{ text: string } | { fatal: true; status: number } | null> {
  const keys = getGroqKeys();
  if (keys.length === 0) return null;

  const ext = extensionFromMime(mimeType);

  for (let i = 0; i < keys.length; i++) {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), `recording.${ext}`);
    form.append("model", "whisper-large-v3-turbo");
    form.append("language", language);
    form.append("response_format", "json");
    form.append("temperature", "0");

    let res: Response;
    try {
      res = await fetch(GROQ_TRANSCRIPTION_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${keys[i]}` },
        body: form,
      });
    } catch (err) {
      console.error(`[STT] Groq key #${i + 1} network error:`, err);
      continue;
    }

    if (res.ok) {
      const result = (await res.json()) as { text?: string };
      return { text: (result.text || "").trim() };
    }

    const errBody = await res.text().catch(() => "");
    console.error(`[STT] Groq key #${i + 1} failed: ${res.status} ${errBody.slice(0, 200)}`);

    // Hết quota / quá tải -> đổi key. Lỗi khác thì đổi key cũng vô ích.
    if (res.status !== 429 && res.status < 500) {
      return { fatal: true, status: res.status };
    }
  }

  return null;
}

/**
 * Fallback: Gemini qua OpenRouter nhận audio trực tiếp (input_modalities có "audio").
 * Không phải model chuyên transcribe nên chất lượng kém Whisper một chút,
 * nhưng cứu được lúc Groq 429.
 */
async function transcribeWithOpenRouter(
  buffer: Buffer,
  mimeType: string,
  language: string
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const langName = language === "vi" ? "Vietnamese" : "English";

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Quali STT Fallback",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Transcribe the following ${langName} audio verbatim. Output ONLY the transcript text, with no quotes, no preamble, no explanation. If the audio contains no speech, output nothing.`,
              },
              {
                type: "input_audio",
                input_audio: { data: buffer.toString("base64"), format: extensionFromMime(mimeType) },
              },
            ],
          },
        ],
        temperature: 0,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      console.error("[STT] OpenRouter fallback failed:", res.status, (await res.text().catch(() => "")).slice(0, 200));
      return null;
    }

    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    return text.trim();
  } catch (err) {
    console.error("[STT] OpenRouter fallback error:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const language = (formData.get("language") as string) || "en";

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Thiếu file âm thanh." }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File âm thanh quá lớn (tối đa 25MB)." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "audio/webm";

    if (!looksLikeAudio(buffer)) {
      console.error("[STT] Rejected non-audio payload, mime:", mimeType, "size:", buffer.length);
      return NextResponse.json(
        { error: "File ghi âm không hợp lệ. Bạn thử ghi âm lại nhé." },
        { status: 400 }
      );
    }

    // 1) Groq Whisper (chính) — thử lần lượt tất cả key
    const groqResult = await transcribeWithGroq(buffer, mimeType, language);

    if (groqResult && "text" in groqResult) {
      return NextResponse.json({ text: groqResult.text, transcript: groqResult.text, provider: "groq" });
    }

    if (groqResult && "fatal" in groqResult) {
      return NextResponse.json(
        { error: "File âm thanh không hợp lệ hoặc không nhận diện được. Thử ghi âm lại nhé." },
        { status: 400 }
      );
    }

    // 2) Groq hết quota -> fallback OpenRouter
    console.warn("[STT] Groq unavailable, falling back to OpenRouter");
    const fallbackText = await transcribeWithOpenRouter(buffer, mimeType, language);

    if (fallbackText !== null) {
      return NextResponse.json({ text: fallbackText, transcript: fallbackText, provider: "openrouter" });
    }

    return NextResponse.json(
      { error: "Hệ thống nhận diện giọng nói đang quá tải. Vui lòng thử lại sau ít phút." },
      { status: 503 }
    );
  } catch (error) {
    console.error("[STT] Unexpected error:", error);
    return NextResponse.json(
      { error: "Lỗi server khi xử lý âm thanh." },
      { status: 500 }
    );
  }
}
