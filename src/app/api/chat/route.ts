import { NextResponse } from "next/server";

export const runtime = "edge";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, mỗi edge isolate một map)
// ---------------------------------------------------------------------------
let rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Chặn phình bộ nhớ trong edge isolate
  if (rateLimitMap.size > 1000) {
    rateLimitMap = new Map();
  }

  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;

  record.count += 1;
  return true;
}

// ---------------------------------------------------------------------------
// Whitelist CTA — bot chỉ được dẫn link tới đúng các route dưới đây
// ---------------------------------------------------------------------------
interface CTA {
  label: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
}

const CTA_CATALOG: Record<string, CTA> = {
  "/reading": { label: "Đề Reading Cambridge", description: "Hub luyện đọc — danh sách đề Cambridge IELTS gốc", href: "/reading", icon: "BookOpen" },
  "/reading/bilingual": { label: "Đọc báo song ngữ", description: "Bài thật từ Reuters, NYT... có bản dịch đối chiếu", href: "/reading/bilingual", icon: "Library" },
  "/reading/song-ngu": { label: "Thư viện song ngữ", description: "Kho bài đọc song ngữ Anh–Việt", href: "/reading/song-ngu", icon: "Library" },
  "/listening": { label: "Luyện Listening", description: "Đề nghe Cambridge + luyện chép chính tả", href: "/listening", icon: "Headphones" },
  "/listening/dictation": { label: "Dictation", description: "Nghe chép chính tả từng câu, chấm sai đến từng từ", href: "/listening/dictation", icon: "PenTool" },
  "/writing": { label: "Luyện Writing", description: "Task 1 & Task 2, AI chấm theo 4 tiêu chí", href: "/writing", icon: "FileText" },
  "/writing/tests": { label: "Đề Writing", description: "Bộ đề Writing kèm bài mẫu", href: "/writing/tests", icon: "FileText" },
  "/writing/translation": { label: "Luyện dịch câu", description: "Dịch Việt–Anh theo cấu trúc, sửa lỗi ngữ pháp", href: "/writing/translation", icon: "BrainCircuit" },
  "/speaking": { label: "Luyện Speaking", description: "Nói với AI, chấm phát âm & fluency", href: "/speaking", icon: "Mic" },
  "/speaking/shadowing": { label: "Shadowing", description: "Nhại theo người bản xứ, so sánh sóng âm", href: "/speaking/shadowing", icon: "Mic" },
  "/speaking/ted": { label: "TED Speaking", description: "Luyện nói theo video TED", href: "/speaking/ted", icon: "Mic" },
  "/speaking/roulette": { label: "Speaking Roulette", description: "Random đề Part 1/2/3, luyện phản xạ", href: "/speaking/roulette", icon: "Mic" },
  "/vocabulary": { label: "Từ vựng", description: "3000+ từ vựng IELTS theo chủ đề", href: "/vocabulary", icon: "BookOpen" },
  "/practice/flashcard": { label: "Flashcard", description: "Học từ bằng flashcard, lặp lại ngắt quãng", href: "/practice/flashcard", icon: "LayoutList" },
  "/practice/vocabulary/notebook": { label: "Sổ tay từ vựng", description: "Từ bạn lưu khi đọc bài, ôn lại mọi lúc", href: "/practice/vocabulary/notebook", icon: "BookOpen" },
  "/grammar": { label: "Ngữ pháp", description: "Bài học ngữ pháp IELTS có ví dụ + bài tập", href: "/grammar", icon: "Target" },
  "/roadmap": { label: "Lộ trình cá nhân", description: "Lộ trình học theo band mục tiêu", href: "/roadmap", icon: "Compass" },
  "/orientation": { label: "Test đầu vào", description: "Làm bài test xếp band, nhận lộ trình", href: "/orientation", icon: "Target" },
  "/learning/daily": { label: "Nhiệm vụ hằng ngày", description: "Task mỗi ngày giữ streak học", href: "/learning/daily", icon: "Target" },
  "/pricing": { label: "Bảng giá", description: "So sánh gói Free/Premium", href: "/pricing", icon: "CreditCard" },
};

/** Cho router: có href để LLM chọn. */
const FEATURE_LIST_WITH_HREF = Object.values(CTA_CATALOG)
  .map((c) => `${c.href} — ${c.label}: ${c.description}`)
  .join("\n");

/** Cho prompt trả lời: KHÔNG có href, nếu không model sẽ đọc "/reading" ra giữa câu. */
const FEATURE_LIST_PLAIN = Object.values(CTA_CATALOG)
  .map((c) => `- ${c.label}: ${c.description}`)
  .join("\n");

// ---------------------------------------------------------------------------
// Lớp dự phòng: khớp từ khoá, dùng khi router LLM lỗi hoặc trả rỗng
// ---------------------------------------------------------------------------
const INTENT_RULES = [
  { keywords: ["đáp án reading", "chữa đề reading", "reading cam", "đề cam"], routes: ["/reading", "/reading/bilingual"] },
  { keywords: ["đọc báo", "reuters", "bbc", "tin tức tiếng anh", "song ngữ", "dịch bài", "bản dịch"], routes: ["/reading/bilingual", "/reading/song-ngu"] },
  { keywords: ["nghe kém", "listening", "chép chính tả"], routes: ["/listening/dictation", "/listening"] },
  { keywords: ["viết task 2", "chấm bài viết", "writing"], routes: ["/writing", "/writing/tests"] },
  { keywords: ["phát âm", "speaking", "sợ nói", "luyện nói", "kỹ năng nói"], routes: ["/speaking/shadowing", "/speaking"] },
  { keywords: ["từ vựng", "học từ", "quên từ"], routes: ["/vocabulary", "/practice/flashcard", "/practice/vocabulary/notebook"] },
  { keywords: ["ngữ pháp", "mệnh đề", "chia thì", "thì hiện tại", "thì quá khứ"], routes: ["/grammar"] },
  { keywords: ["mất gốc", "bắt đầu từ đâu", "lộ trình", "target 6.5"], routes: ["/orientation", "/roadmap"] },
  { keywords: ["bảng giá", "giá tiền", "học phí", "bao nhiêu tiền", "gói học", "premium", "trả phí"], routes: ["/pricing"] },
];

function matchRoutesByKeyword(text: string): string[] {
  const normalized = text.toLowerCase();
  const matched = new Set<string>();
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      rule.routes.forEach((r) => matched.add(r));
    }
  }
  return Array.from(matched);
}

// ---------------------------------------------------------------------------
// Router: để LLM chọn route, sau đó lọc lại bằng whitelist
// ---------------------------------------------------------------------------
interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

async function pickRoutesWithLLM(
  message: string,
  history: ChatTurn[],
  apiKey: string
): Promise<string[]> {
  const systemPrompt = `Bạn là bộ định tuyến của nền tảng học IELTS. Nhiệm vụ duy nhất: đọc câu hỏi của người dùng và chọn tối đa 3 tính năng phù hợp nhất để gợi ý.

DANH SÁCH TÍNH NĂNG:
${FEATURE_LIST_WITH_HREF}

QUY TẮC:
- Chỉ được chọn href có trong danh sách trên, copy chính xác từng ký tự.
- Ưu tiên tính năng cụ thể hơn tính năng tổng quát.
- Nếu câu hỏi không liên quan tới học IELTS, trả về mảng rỗng.
- Chỉ trả JSON, không giải thích: {"routes": ["/href1", "/href2"]}`;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "Quali Guide Router",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-4),
        { role: "user", content: message },
      ],
      temperature: 0,
      max_tokens: 100,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`Router HTTP ${res.status}`);

  const data = await res.json();
  const parsed = JSON.parse(data?.choices?.[0]?.message?.content ?? "{}");
  return Array.isArray(parsed.routes) ? parsed.routes : [];
}

/** Hàng rào chống LLM bịa link: chỉ giữ href có thật trong catalog. */
function toValidCTAs(routes: string[], currentPath: string): CTA[] {
  const seen = new Set<string>();
  const ctas: CTA[] = [];
  for (const href of routes) {
    if (typeof href !== "string") continue;
    if (href === currentPath) continue; // đang đứng ở đó rồi thì gợi làm gì
    if (seen.has(href)) continue;
    const cta = CTA_CATALOG[href];
    if (!cta) continue;
    seen.add(href);
    ctas.push(cta);
    if (ctas.length === 3) break;
  }
  return ctas;
}

// ---------------------------------------------------------------------------
// Prompt trả lời chính
// ---------------------------------------------------------------------------
function buildSystemPrompt(pathname: string, locale: string): string {
  return `Bạn là "Quali Guide" — trợ lý học tập của nền tảng Quali IELTS.
Vai trò: vừa giải đáp kiến thức IELTS, vừa giới thiệu tính năng phù hợp của nền tảng.

CÁC TÍNH NĂNG CÓ THẬT CỦA NỀN TẢNG:
${FEATURE_LIST_PLAIN}

QUY TẮC:
1. Trả lời tiếng Việt (trừ khi người dùng hỏi bằng tiếng Anh). Ngắn gọn 3-6 câu, thân thiện, có cấu trúc.
2. TUYỆT ĐỐI KHÔNG bịa tên tính năng, tên khoá học, giá tiền, con số học viên, cam kết điểm số hay đường link. Chỉ nhắc tính năng có trong danh sách trên.
3. KHÔNG viết đường dẫn (kiểu /reading), link hay markdown link trong câu trả lời. Gọi tính năng bằng ĐÚNG TÊN của nó — hệ thống sẽ tự render nút bấm bên dưới.
4. Khi người dùng hỏi về đáp án đề thi, tài liệu, hoặc muốn luyện một kỹ năng: giải thích ngắn rồi giới thiệu tính năng tương ứng một cách tự nhiên.
5. Giọng điệu: như một anh/chị mentor đi trước — nhiệt tình, không sale sượng, không hứa hẹn "cam kết 7.0".
6. Không trả lời chủ đề ngoài IELTS / học tiếng Anh / nền tảng. Từ chối lịch sự rồi kéo về chủ đề học.
7. Người dùng đang ở trang: ${pathname || "/"}. Đừng khuyên họ đi tới trang họ đang đứng.
8. Ngôn ngữ giao diện hiện tại: ${locale}.
9. Bạn KHÔNG biết tính năng nào miễn phí, tính năng nào thuộc gói trả phí, và cũng không biết giá. Nếu người dùng hỏi về chuyện đó, đừng đoán — nói thẳng là bạn không nắm chi tiết gói và mời họ xem Bảng giá.`;
}

const GREETING_PATTERN = /^(h+e+l+o+|h+i+|hey|xin ch[àa]o|ch[àa]o|alo|greetings)[!.,\s]*$/i;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Thiếu cấu hình thì báo to, không im lặng trả lời sai
      console.error("OPENROUTER_API_KEY is missing");
      return NextResponse.json(
        { error: "Máy chủ chưa được cấu hình khoá API. Liên hệ quản trị viên nhé." },
        { status: 500 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Bạn hỏi hơi nhanh, chờ mình chút nhé 😅" }, { status: 429 });
    }

    const { message, history = [], pathname = "", locale = "vi" } = await req.json();

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 1000) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }
    if (!Array.isArray(history) || history.length > 16) {
      return NextResponse.json({ error: "Invalid history array or too large" }, { status: 400 });
    }
    if (history.some((m: Record<string, unknown>) => typeof m.content !== "string" || m.content.length > 2000)) {
      return NextResponse.json({ error: "History message is too long or invalid" }, { status: 400 });
    }

    const cleanHistory: ChatTurn[] = history.map((m: ChatTurn) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const isGreeting = GREETING_PATTERN.test(trimmedMessage);

    // Chạy song song với câu trả lời để không cộng thêm độ trễ.
    // Chào hỏi thì bỏ qua hẳn, tiết kiệm một lượt gọi.
    const ctaPromise: Promise<CTA[]> = isGreeting
      ? Promise.resolve([])
      : pickRoutesWithLLM(trimmedMessage, cleanHistory, apiKey)
          .then((routes) => {
            const ctas = toValidCTAs(routes, pathname);
            return ctas.length > 0
              ? ctas
              : toValidCTAs(matchRoutesByKeyword(trimmedMessage), pathname);
          })
          .catch((err) => {
            console.error("Route picker failed, falling back to keywords:", err);
            return toValidCTAs(matchRoutesByKeyword(trimmedMessage), pathname);
          });

    const systemPrompt = isGreeting
      ? `Bạn là "Quali Guide" — trợ lý IELTS của nền tảng Quali IELTS. Hãy chào lại thật thân thiện, giới thiệu ngắn gọn bạn giúp được gì (ngữ pháp, từ vựng, luyện 4 kỹ năng, lộ trình học) và gợi mở một câu hỏi. Tối đa 3 câu. Trả lời bằng ${locale === "en" ? "tiếng Anh" : "tiếng Việt"}.`
      : buildSystemPrompt(pathname, locale);

    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Quali Guide",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...cleanHistory,
          { role: "user", content: trimmedMessage },
        ],
        temperature: 0.6,
        max_tokens: 700,
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "");
      console.error("OpenRouter error:", upstream.status, errText);
      return NextResponse.json(
        { error: "Không kết nối được tới máy chủ AI. Thử lại sau chút nhé." },
        { status: 502 }
      );
    }

    const upstreamBody = upstream.body;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (payload: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

        const reader = upstreamBody.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const rawLine of lines) {
              const line = rawLine.trim();
              // OpenRouter chèn dòng comment ": OPENROUTER PROCESSING" để giữ kết nối
              if (!line || line.startsWith(":")) continue;
              if (!line.startsWith("data:")) continue;

              const payload = line.slice(5).trim();
              if (payload === "[DONE]") continue;

              try {
                const json = JSON.parse(payload);
                const delta = json?.choices?.[0]?.delta?.content;
                if (delta) send({ type: "token", value: delta });
              } catch {
                // chunk lẻ chưa ghép đủ thì bỏ qua
              }
            }
          }

          const ctas = await ctaPromise;
          if (ctas.length > 0) send({ type: "cta", value: ctas });
          send({ type: "done" });
        } catch (streamErr) {
          console.error("Error during streaming response:", streamErr);
          send({ type: "error", value: "Đã xảy ra lỗi khi tạo phản hồi." });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
