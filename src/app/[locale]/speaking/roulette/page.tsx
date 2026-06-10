"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { IELTS_P1, IELTS_P2, IELTS_P3 } from "./data";

const TWEAK_DEFAULTS = {
  theme: "grid",
  palette: "poster",
  displayFont: "Playfair Display",
  fanSize: 1,
  spinSpeed: "medium",
  showVocab: true,
};

const THEMES: Record<string, any> = {
  grid: {
    "--bg": "#16352a",
    "--bg-2": "#0f261e",
    "--grid": "rgba(255,255,255,0.055)",
    "--grid-strong": "rgba(255,255,255,0.10)",
    "--ink": "#f4f1e6",
    "--ink-soft": "rgba(244,241,230,0.66)",
    "--ink-faint": "rgba(244,241,230,0.40)",
    "--line": "rgba(244,241,230,0.16)",
    "--panel": "rgba(15,38,30,0.82)",
  },
};

const PALETTES: Record<string, string[]> = {
  poster: [
    "#C75D4F", "#E0A93B", "#7F9461", "#D7C9A8", "#C68799",
    "#3E7C76", "#A8552E", "#4F6D8C", "#B6694A", "#5E8C6A",
  ],
};

function readableInk(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16),
    g = parseInt(c.slice(2, 4), 16),
    b = parseInt(c.slice(4, 6), 16);
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return L > 0.62 ? "#27201a" : "#fbf6ec";
}

function surface(accent: string) {
  const ink = readableInk(accent);
  const dark = ink === "#fbf6ec";
  return {
    accent,
    ink,
    soft: dark ? "rgba(251,246,236,0.76)" : "rgba(39,32,26,0.68)",
    faint: dark ? "rgba(251,246,236,0.54)" : "rgba(39,32,26,0.48)",
    line: dark ? "rgba(251,246,236,0.24)" : "rgba(39,32,26,0.20)",
    panel: dark ? "rgba(0,0,0,0.17)" : "rgba(255,255,255,0.36)",
    hi: dark ? "rgba(255,237,196,0.26)" : "rgba(255,255,255,0.62)",
    fill: ink,
    onFill: accent,
    patternOpacity: dark ? 0.13 : 0.18,
  };
}

const SPIN_PROFILE: Record<string, number> = { slow: 1.5, medium: 1.0, fast: 0.65 };

function CardPattern({ seed, opacity = 0.16 }: { seed: number; opacity?: number }) {
  const v = ((seed % 7) + 7) % 7;
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 7,
    strokeLinecap: "round" as any,
    vectorEffect: "non-scaling-stroke",
  };
  let g;
  if (v === 0) {
    g = (
      <g {...common}>
        <path d="M-20 70 Q 100 -25 220 70" />
        <path d="M-20 120 Q 100 25 220 120" />
        <circle cx="150" cy="215" r="42" />
        <circle cx="150" cy="215" r="22" />
        <path d="M18 175 L70 232 M42 175 L94 232 M66 175 L118 232" />
      </g>
    );
  } else if (v === 1) {
    g = (
      <g {...common}>
        <circle cx="45" cy="120" r="48" />
        <circle cx="45" cy="120" r="22" />
        <circle cx="120" cy="120" r="48" />
        <circle cx="120" cy="120" r="22" />
        <circle cx="195" cy="120" r="48" />
        <circle cx="195" cy="120" r="22" />
        <path d="M0 210 H210 M0 245 H210" />
      </g>
    );
  } else if (v === 2) {
    g = (
      <g {...common}>
        <path d="M-10 40 C 80 40 60 150 150 150 S 230 250 320 250" />
        <path d="M-10 90 C 80 90 60 200 150 200 S 230 300 320 300" />
        <path d="M-10 -10 C 80 -10 60 100 150 100" />
      </g>
    );
  } else if (v === 3) {
    g = (
      <g {...common}>
        <path d="M-20 90 L90 -20 M5 110 L115 0 M30 130 L140 20 M5 150 L165 40" />
        <path d="M40 270 L160 150 M65 290 L185 170 M90 300 L210 180" />
        <path d="M150 250 V120" />
      </g>
    );
  } else if (v === 4) {
    g = (
      <g {...common}>
        <path d="M30 50 L60 50 M150 40 L150 75 M40 150 L70 180 M180 130 L150 160 M60 230 L95 230 M30 110 L30 140" />
        <circle cx="120" cy="120" r="16" />
        <circle cx="175" cy="210" r="22" />
        <path d="M150 200 Q 110 230 130 270" />
      </g>
    );
  } else if (v === 5) {
    g = (
      <g {...common}>
        <path d="M40 30 C 200 30 200 120 100 120 S 0 220 160 220 S 220 280 120 290" />
        <path d="M10 70 C 120 70 120 160 40 160" />
      </g>
    );
  } else {
    g = (
      <g {...common}>
        <path d="M50 0 V280 M120 0 V280" />
        <path d="M0 80 H210 M0 170 H210" />
        <path d="M120 40 a70 70 0 1 1 -70 70" />
      </g>
    );
  }
  return (
    <svg
      viewBox="0 0 210 280"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
      }}
    >
      {g}
    </svg>
  );
}

const MODES = [
  { id: "p1", label: "Part 1", sub: "Interview", data: () => IELTS_P1 },
  { id: "p2", label: "Part 2", sub: "Cue Card", data: () => IELTS_P2 },
  { id: "p3", label: "Part 3", sub: "Discussion", data: () => IELTS_P3 },
];
const FAN_N = 18;

function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function highlightParts(sentence: string, target: string) {
  const i = sentence.toLowerCase().indexOf(target.toLowerCase());
  if (i === -1) return [{ text: sentence, hot: false }];
  return [
    { text: sentence.slice(0, i), hot: false },
    { text: sentence.slice(i, i + target.length), hot: true },
    { text: sentence.slice(i + target.length), hot: false },
  ].filter((p) => p.text.length);
}

function pickFan(pool: any[]) {
  const order = shuffle(pool.map((_, i) => i));
  const out = [];
  for (let i = 0; i < FAN_N; i++) {
    out.push(order[i % order.length]);
  }
  return shuffle(out);
}

function itemKey(modeId: string, item: any) {
  return modeId + "::" + (item.topic + "|" + (item.q || ""));
}

function fmt(s: number) {
  const m = Math.floor(s / 60),
    ss = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${ss}`;
}

function seedOf(item: any) {
  const str = (item.topic || "") + (item.q || "");
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

let audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  return audioCtx;
};

const playTick = (isStart = false) => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(isStart ? 300 : 150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + (isStart ? 0.1 : 0.05));

    gain.gain.setValueAtTime(isStart ? 0.2 : 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isStart ? 0.1 : 0.05));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (isStart ? 0.1 : 0.05));
  } catch (e) {
    // Ignore audio errors
  }
};

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

body {
  margin: 0;
  overflow: hidden;
  background: var(--bg);
  color: var(--ink);
  font-family: system-ui, -apple-system, sans-serif;
}
.grid-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-color: var(--bg);
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px),
    linear-gradient(var(--grid-strong) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-strong) 1px, transparent 1px);
  background-size: 28px 28px, 28px 28px, 140px 140px, 140px 140px;
  background-position: center center;
}
.grid-bg::after {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(120% 90% at 50% 8%, transparent 40%, var(--bg-2) 100%);
  pointer-events: none;
}
.app-container {
  --display: "Playfair Display", Georgia, serif;
}

@keyframes posterRise { 0%{opacity:0; transform:translateY(60px) scale(.86);} 100%{opacity:1; transform:translateY(0) scale(1);} }
@keyframes chipIn { from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:none;} }
@keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
.fancard { transition: transform .32s cubic-bezier(.2,.8,.25,1), filter .25s, box-shadow .25s; }
.fancard.hot { filter:saturate(1.08) brightness(1.06); z-index:60 !important; }
.modetab { transition: color .2s, background .2s, border-color .2s; }
.btn-spin { transition: transform .12s ease, box-shadow .2s, background .2s; cursor: pointer; border:none; }
.btn-spin:hover:not(:disabled) { transform: translateY(-2px); }
.btn-spin:active:not(:disabled) { transform: translateY(0) scale(.98); }
.icon-btn { transition: background .18s, color .18s, border-color .18s; cursor: pointer; border:none; }
.saved-row { transition: background .15s; }
.saved-row:hover { background: rgba(255,255,255,.05); }
.flip-fav.on svg { filter: drop-shadow(0 0 6px rgba(233,185,73,.6)); }
@keyframes recPulse { 0%,100%{ transform:scale(1); opacity:1; } 50%{ transform:scale(.78); opacity:.55; } }
.rec-dot { animation: recPulse 1s ease-in-out infinite; }
.vsent { animation: chipIn .4s both; }
.scroll::-webkit-scrollbar { width: 8px; }
.scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 8px; }
`;

const FAN_BOX_H = 430;
const CARD_W = 178,
  CARD_H = 252;

function Fan({
  pool,
  palette,
  fanCards,
  hotIndex,
  phase,
  onSpin,
}: any) {
  const mid = (FAN_N - 1) / 2;
  const step = 5.6;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: FAN_BOX_H,
        transform: "scale(calc(var(--fan-scale, 1) * var(--fan-fit, 1)))",
        transformOrigin: "50% 50%",
        pointerEvents: phase === "spinning" ? "none" : "auto",
        transition: "opacity .4s, filter .4s",
        opacity: phase === "result" ? 0.12 : 1,
        filter: phase === "result" ? "blur(3px)" : "none",
      }}
    >
      {fanCards.map((qi: number, i: number) => {
        const item = pool[qi];
        if (!item) return null;
        const angle = (i - mid) * step;
        const bg = palette[i % palette.length];
        const ink = readableInk(bg);
        const hot = hotIndex === i;
        return (
          <div
            key={i}
            className={"fancard" + (hot ? " hot" : "")}
            onClick={() => phase !== "spinning" && onSpin()}
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              width: CARD_W,
              height: CARD_H,
              marginLeft: -CARD_W / 2,
              transformOrigin: "50% calc(100% + 330px)",
              transform: `rotate(${angle}deg) translateY(${hot ? -34 : 0}px) scale(${hot ? 1.07 : 1})`,
              borderRadius: 16,
              background: bg,
              color: ink,
              zIndex: i,
              boxShadow: hot ? "0 26px 60px rgba(0,0,0,.5)" : "0 10px 26px rgba(0,0,0,.34)",
              padding: "19px 17px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(255,255,255,.14)",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <CardPattern seed={qi} opacity={ink === "#fbf6ec" ? 0.18 : 0.22} />
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: 0.85,
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              <span>{item.topic}</span>
            </div>
            <div
              style={{
                position: "relative",
                fontFamily: "var(--display)",
                fontSize: 42,
                lineHeight: 0.9,
                fontWeight: 700,
                opacity: 0.92,
              }}
            >
              ?
            </div>
            <div style={{ position: "relative", height: 1, background: "currentColor", opacity: 0.22 }}></div>
          </div>
        );
      })}
    </div>
  );
}

function CueTimer({ s }: { s: any }) {
  const [phase, setPhase] = useState("idle");
  const [left, setLeft] = useState(0);
  const ref = useRef<any>(null);
  const total = phase === "prep" ? 60 : phase === "talk" ? 120 : 1;

  useEffect(() => {
    if (phase === "prep" || phase === "talk") {
      ref.current = setInterval(() => {
        setLeft((l) => {
          if (l <= 1) {
            clearInterval(ref.current);
            if (phase === "prep") {
              setPhase("talk");
              setLeft(120);
            } else {
              setPhase("done");
            }
            return phase === "prep" ? 120 : 0;
          }
          return l - 1;
        });
      }, 1000);
      return () => clearInterval(ref.current);
    }
  }, [phase]);

  const start = () => {
    setPhase("prep");
    setLeft(60);
  };
  const skip = () => {
    clearInterval(ref.current);
    setPhase("talk");
    setLeft(120);
  };
  const reset = () => {
    clearInterval(ref.current);
    setPhase("idle");
    setLeft(0);
  };

  const r = 32,
    C = 2 * Math.PI * r;
  const frac = phase === "idle" || phase === "done" ? (phase === "done" ? 1 : 0) : 1 - left / total;
  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");
  const label =
    phase === "prep"
      ? "Đang chuẩn bị"
      : phase === "talk"
      ? "Đang nói"
      : phase === "done"
      ? "Hết giờ"
      : "Sẵn sàng · 1 phút chuẩn bị, 2 phút nói";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
        <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="40" cy="40" r={r} fill="none" stroke={s.line} strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={s.fill}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - frac)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 19,
              fontWeight: 700,
              color: s.ink,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {phase === "idle" ? "1:00" : phase === "done" ? "0:00" : `${mm}:${ss}`}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: s.faint, fontWeight: 700 }}>
          {label}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {phase === "idle" && (
            <TBtn s={s} onClick={start}>
              Bắt đầu chuẩn bị
            </TBtn>
          )}
          {phase === "prep" && (
            <TBtn s={s} onClick={skip}>
              Bỏ qua, bắt đầu nói
            </TBtn>
          )}
          {(phase === "talk" || phase === "done") && (
            <TBtn s={s} onClick={start}>
              Bắt đầu lại
            </TBtn>
          )}
          {phase !== "idle" && (
            <TBtn s={s} ghost onClick={reset}>
              Đặt lại
            </TBtn>
          )}
        </div>
      </div>
    </div>
  );
}

function TBtn({ children, onClick, s, ghost }: any) {
  return (
    <button
      onClick={onClick}
      className="icon-btn"
      style={{
        fontSize: 13,
        fontWeight: 600,
        padding: "8px 14px",
        borderRadius: 9,
        background: ghost ? "transparent" : s.fill,
        color: ghost ? s.soft : s.onFill,
        border: ghost ? "1px solid " + s.line : "none",
      }}
    >
      {children}
    </button>
  );
}

function Recorder({ s, resetKey, question }: any) {
  const [state, setState] = useState<"idle" | "rec" | "evaluating" | "ready" | "error">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const mr = useRef<MediaRecorder | null>(null);
  const chunks = useRef<any[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<any>(null);
  const recognition = useRef<any>(null);
  const liveText = useRef<string>("");

  const stopRecognition = useCallback(() => {
    if (recognition.current) {
      try { recognition.current.stop(); } catch {}
      recognition.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    clearInterval(timer.current);
    stopRecognition();
    if (stream.current) {
      stream.current.getTracks().forEach((t) => t.stop());
      stream.current = null;
    }
  }, [stopRecognition]);

  useEffect(() => {
    cleanup();
    setState("idle");
    setElapsed(0);
    setTranscript(null);
    setEvaluation(null);
    liveText.current = "";
    setUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return null;
    });
    chunks.current = [];
    return cleanup;
  }, [resetKey, cleanup]);

  const start = async () => {
    try {
      liveText.current = "";
      const st = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = st;
      chunks.current = [];

      // Web Speech API for real-time transcription
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const recog = new SR();
        recog.continuous = true;
        recog.interimResults = false;
        recog.lang = "en-US";
        recog.onresult = (e: any) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
              const part = e.results[i][0].transcript.trim();
              liveText.current = liveText.current ? liveText.current + " " + part : part;
            }
          }
        };
        recog.onerror = () => {};
        recog.start();
        recognition.current = recog;
      }

      const rec = new MediaRecorder(st);
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        setUrl((u) => {
          if (u) URL.revokeObjectURL(u);
          return URL.createObjectURL(blob);
        });

        // Give SpeechRecognition time to flush final results
        await new Promise((r) => setTimeout(r, 350));

        const text = liveText.current.trim();
        setTranscript(text || null);

        if (text) {
          setState("evaluating");
          try {
            const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transcript: text, question }),
            });
            const data = await res.json();
            if (data.evaluation) setEvaluation(data.evaluation);
          } catch (err) {
            console.error("Evaluation failed:", err);
          }
        }
        setState("ready");
      };

      mr.current = rec;
      rec.start();
      setState("rec");
      setElapsed(0);
      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      setState("error");
    }
  };

  const stop = () => {
    clearInterval(timer.current);
    stopRecognition();
    if (mr.current && mr.current.state !== "inactive") mr.current.stop();
  };

  const redo = () => {
    setUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return null;
    });
    setState("idle");
    setElapsed(0);
    setTranscript(null);
    setEvaluation(null);
    liveText.current = "";
  };

  const showResults = state === "evaluating" || state === "ready";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      {state === "idle" && (
        <button onClick={start} className="btn-spin" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 99, background: s.fill, color: s.onFill, fontWeight: 700, fontSize: 14.5 }}>
          <span style={{ width: 11, height: 11, borderRadius: 99, background: s.onFill }}></span>
          Ghi âm câu trả lời
        </button>
      )}
      {state === "rec" && (
        <React.Fragment>
          <button onClick={stop} className="icon-btn" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 99, background: "#b53326", color: "#fff", fontWeight: 700, fontSize: 14.5 }}>
            <span className="rec-dot" style={{ width: 11, height: 11, borderRadius: 3, background: "#fff" }}></span>
            Dừng lại
          </button>
          <span style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 700, color: s.ink, fontVariantNumeric: "tabular-nums" }}>{fmt(elapsed)}</span>
          <span style={{ fontSize: 12, color: s.faint, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>Đang ghi âm</span>
        </React.Fragment>
      )}
      {showResults && (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <audio src={url || ""} controls style={{ height: 40, maxWidth: 280 }}></audio>
            <button onClick={redo} className="icon-btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 17px", borderRadius: 99, border: "1px solid " + s.line, color: s.soft, fontWeight: 600, fontSize: 13.5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 99, background: s.fill }}></span>
              Ghi âm lại
            </button>
          </div>

          {transcript && (
            <div style={{ padding: "14px 18px", background: s.panel, borderRadius: 12, fontSize: 14.5, lineHeight: 1.5, color: s.ink, border: "1px solid " + s.line }}>
              <div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: s.faint, fontWeight: 800, marginBottom: 6 }}>Bản ghi âm</div>
              <div>{transcript}</div>
            </div>
          )}

          {state === "evaluating" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: s.panel, borderRadius: 12, border: "1px solid " + s.line }}>
              <span className="rec-dot" style={{ width: 9, height: 9, borderRadius: 3, background: s.soft, flexShrink: 0 }}></span>
              <span style={{ fontSize: 13, color: s.soft, fontWeight: 600 }}>Đang đánh giá với Gemini...</span>
            </div>
          )}

          {state === "ready" && evaluation && (
            <div style={{ padding: "18px 20px", background: s.panel, borderRadius: 14, border: "1px solid " + s.line }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: s.faint, fontWeight: 800, paddingTop: 6 }}>
                  Đánh giá của Giám khảo IELTS
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: s.faint, fontWeight: 700, marginBottom: 1 }}>Tổng điểm</div>
                  <div style={{ fontFamily: "var(--display)", fontSize: 38, fontWeight: 800, color: s.ink, lineHeight: 1 }}>
                    {typeof evaluation.overall === "number" ? evaluation.overall.toFixed(1) : evaluation.overall}
                  </div>
                  <div style={{ fontSize: 10, color: s.faint, marginTop: 1 }}>/ 9.0</div>
                </div>
              </div>
              {([
                ["Lưu loát & Mạch lạc", "fluency_coherence"],
                ["Vốn từ vựng", "lexical_resource"],
                ["Ngữ pháp & Độ chính xác", "grammatical_range"],
                ["Phát âm", "pronunciation"],
              ] as [string, string][]).map(([label, key]) => {
                const crit = evaluation[key];
                if (!crit) return null;
                const band = typeof crit.band === "number" ? crit.band : parseFloat(String(crit.band));
                return (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.soft, letterSpacing: ".05em" }}>{label}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: s.ink, fontVariantNumeric: "tabular-nums" }}>{isNaN(band) ? "—" : band.toFixed(1)}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 99, background: s.line, overflow: "hidden", marginBottom: crit.feedback ? 5 : 0 }}>
                      <div style={{ height: "100%", width: isNaN(band) ? "0%" : `${(band / 9) * 100}%`, borderRadius: 99, background: s.fill, transition: "width .8s cubic-bezier(.16,1,.3,1)" }} />
                    </div>
                    {crit.feedback && <p style={{ margin: 0, fontSize: 12.5, color: s.soft, lineHeight: 1.45 }}>{crit.feedback}</p>}
                  </div>
                );
              })}
              {evaluation.summary && (
                <div style={{ marginTop: 8, paddingTop: 14, borderTop: "1px solid " + s.line, fontSize: 13, color: s.soft, lineHeight: 1.6, fontStyle: "italic" }}>
                  "{evaluation.summary}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {state === "error" && <span style={{ fontSize: 13.5, color: s.soft }}>Quyền truy cập mic bị chặn. Vui lòng cấp quyền mic để ghi âm.</span>}
    </div>
  );
}

function VocabList({ item, s }: { item: any; s: any }) {
  const [openIdx, setOpenIdx] = useState<number>(-1);

  const handle = async (i: number) => {
    if (openIdx === i) {
      setOpenIdx(-1);
      return;
    }
    setOpenIdx(i);
  };

  return (
    <div style={{ marginTop: 22, background: s.panel, borderRadius: 16, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
        <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: s.faint, fontWeight: 700 }}>
          Từ vựng hữu ích trong ngữ cảnh
        </span>
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 13, margin: 0, padding: 0 }}>
        {(item.vocab || []).map((v: any, i: number) => {
          const term = typeof v === "string" ? v : v.t;
          const parts = typeof v === "string" ? [{ text: v, hot: true }] : highlightParts(v.s, v.t);
          const open = openIdx === i;
          return (
            <li key={i} className="vsent" style={{ animationDelay: i * 70 + "ms" }}>
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 15.5, lineHeight: 1.5, color: s.soft }}>
                <span style={{ flexShrink: 0, width: 6, height: 6, marginTop: 9, borderRadius: 9, background: s.ink, opacity: 0.55 }}></span>
                <span>
                  {parts.map((p, j) =>
                    p.hot ? (
                      <strong
                        key={j}
                        onClick={() => handle(i)}
                        title="Focus term"
                        style={{
                          color: s.ink,
                          fontWeight: 700,
                          background: s.hi,
                          padding: "1px 5px",
                          borderRadius: 5,
                          cursor: "pointer",
                          borderBottom: "1.5px dashed " + s.ink,
                          boxDecorationBreak: "clone",
                          WebkitBoxDecorationBreak: "clone",
                        }}
                      >
                        {p.text}
                      </strong>
                    ) : (
                      <span key={j}>{p.text}</span>
                    )
                  )}
                </span>
              </div>
              {open && (
                <div
                  style={{
                    marginLeft: 17,
                    marginTop: 7,
                    background: s.ink,
                    color: s.onFill,
                    borderRadius: 11,
                    padding: "10px 13px",
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    animation: "chipIn .25s both",
                  }}
                >
                  <span style={{ display: "block", fontSize: 9.5, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800, opacity: 0.6, marginBottom: 3 }}>
                    Trọng tâm từ
                  </span>
                  <span style={{ fontWeight: 600 }}>{term}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Result({ mode, item, accent, showVocab, isFav, onFav, onAgain, onClose }: any) {
  const isP2 = !!item.bullets;
  const s = surface(accent);
  const seed = seedOf(item);
  const modeLabel = (MODES.find((m) => m.id === mode) || {}).label || "";

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: "30px" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(8,18,14,.6)", backdropFilter: "blur(3px)", animation: "fadeIn .3s both" }}></div>
      <div
        className="scroll"
        style={{
          position: "relative",
          width: isP2 ? 680 : 600,
          maxWidth: "94vw",
          maxHeight: "88vh",
          overflow: "auto",
          background: accent,
          color: s.ink,
          borderRadius: 26,
          border: "1px solid rgba(255,255,255,.16)",
          boxShadow: "0 40px 100px rgba(0,0,0,.5)",
          animation: "posterRise .6s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        <CardPattern seed={seed} opacity={s.patternOpacity} />
        <div style={{ position: "relative", padding: "32px 38px 34px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: s.ink }}>{modeLabel}</span>
              <span style={{ width: 4, height: 4, borderRadius: 9, background: s.faint }}></span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: s.soft }}>{item.topic}</span>
            </div>
            <button
              onClick={onFav}
              className={"flip-fav icon-btn" + (isFav ? " on" : "")}
              title="Save question"
              style={{ padding: 6, borderRadius: 9, color: isFav ? "#E9B949" : s.soft, marginTop: -2, marginRight: -4 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isFav ? "#E9B949" : "none"} stroke="currentColor" strokeWidth="1.7">
                <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 21.4 6.2 24l1.1-6.5L2.5 12.9l6.6-.9z" />
              </svg>
            </button>
          </div>

          {isP2 ? (
            <React.Fragment>
              <h2 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 34, lineHeight: 1.12, margin: "16px 0 16px", color: s.ink, textWrap: "pretty" }}>
                {item.topic}
              </h2>
              <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: s.faint, fontWeight: 700, marginBottom: 12 }}>Bạn nên nói về</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
                {(item.bullets || []).map((b: string, i: number) => (
                  <li key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start", fontSize: 18, color: s.ink, lineHeight: 1.4, fontWeight: 500 }}>
                    <span style={{ flexShrink: 0, width: 8, height: 8, marginTop: 8, borderRadius: 9, background: s.ink, opacity: 0.7 }}></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid " + s.line }}>
                <CueTimer s={s} />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h2 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 31, lineHeight: 1.18, margin: "16px 0 22px", color: s.ink, textWrap: "pretty" }}>
                {item.q}
              </h2>
              <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: s.faint, fontWeight: 700, marginBottom: 12 }}>
                Những điều bạn có thể nói
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11, margin: 0, padding: 0 }}>
                {(item.cues || []).map((c: string, i: number) => (
                  <li key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start", fontSize: 17, color: s.ink, lineHeight: 1.42, fontWeight: 500 }}>
                    <span style={{ flexShrink: 0, fontFamily: "var(--display)", fontWeight: 700, fontSize: 17, color: s.ink, opacity: 0.85, width: 18 }}>{i + 1}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          )}

          {showVocab && <VocabList item={item} s={s} />}

          <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid " + s.line }}>
            <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: s.faint, fontWeight: 700, marginBottom: 13 }}>Luyện tập nói</div>
            <Recorder
              s={s}
              resetKey={mode + "|" + item.topic + "|" + (item.q || "")}
              question={isP2 ? `Chủ đề: ${item.topic}. Bạn nên nói về: ${(item.bullets || []).join("; ")}` : (item.q || item.topic || "")}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            <button
              onClick={onAgain}
              className="btn-spin"
              style={{ flex: 1, padding: "15px", borderRadius: 13, background: s.fill, color: s.onFill, fontWeight: 700, fontSize: 15.5, letterSpacing: ".01em" }}
            >
              Quay lại
            </button>
            <button
              onClick={onClose}
              className="icon-btn"
              style={{ padding: "15px 24px", borderRadius: 13, background: "transparent", border: "1px solid " + s.line, color: s.soft, fontWeight: 600, fontSize: 15 }}
            >
              Về trang bài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedPanel({ open, favs, onClose, onOpen, onRemove }: any) {
  return (
    <React.Fragment>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.4)",
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .3s",
        }}
      ></div>
      <div
        className="scroll"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: "86vw",
          background: "var(--panel)",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid var(--line)",
          zIndex: 201,
          transform: open ? "none" : "translateX(105%)",
          transition: "transform .38s cubic-bezier(.16,1,.3,1)",
          overflow: "auto",
          padding: "26px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--display)", fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>Câu hỏi đã lưu</h3>
          <button onClick={onClose} className="icon-btn" style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid var(--line)", color: "var(--ink-soft)", fontSize: 18 }}>
            ✕
          </button>
        </div>
        {favs.length === 0 ? (
          <div style={{ color: "var(--ink-faint)", fontSize: 14, lineHeight: 1.6, padding: "40px 0", textAlign: "center" }}>
            Chưa có câu hỏi nào được lưu.<br />Nhấn ngôi sao trên bất kỳ câu hỏi nào để lưu tại đây.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {favs.map((f: any) => (
              <div
                key={f.key}
                className="saved-row"
                style={{ display: "flex", gap: 12, padding: "13px 12px", borderRadius: 12, cursor: "pointer", alignItems: "flex-start" }}
                onClick={() => onOpen(f)}
              >
                <span style={{ width: 7, height: 7, borderRadius: 9, marginTop: 7, background: f.accent, flexShrink: 0 }}></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>
                    {MODES.find((m) => m.id === f.mode)?.label} · {f.item.topic}
                  </div>
                  <div style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.34 }}>{f.item.q || f.item.topic}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(f.key);
                  }}
                  className="icon-btn"
                  style={{ color: "var(--ink-faint)", fontSize: 15, padding: 2, flexShrink: 0 }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default function SpeakingRouletteClient() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [t] = useState(TWEAK_DEFAULTS);
  const [mode, setMode] = useState("p1");
  const [phase, setPhase] = useState("idle");
  const [hot, setHot] = useState(-1);
  const [selected, setSelected] = useState<any>(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [favs, setFavs] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ielts_favs") || "[]");
    } catch (e) {
      return [];
    }
  });

  const pool = MODES.find((m) => m.id === mode)?.data() || [];
  const palette = PALETTES[t.palette] || PALETTES.poster;
  const [fanCards, setFanCards] = useState(() => pickFan(pool));
  const spinning = useRef(false);

  useEffect(() => {
    spinning.current = false;
    setFanCards(pickFan(pool));
    setPhase("idle");
    setHot(-1);
    setSelected(null);
  }, [mode, pool]);

  useEffect(() => {
    setIsMounted(true);
    const fit = () => {
      document.documentElement.style.setProperty("--fan-fit", String(Math.min(1, (window.innerWidth - 40) / 1080)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const th = THEMES[t.theme] || THEMES.grid;
    Object.entries(th).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v as string);
    });
    document.documentElement.style.setProperty("--display", `"${t.displayFont}", Georgia, serif`);
    document.documentElement.style.setProperty("--fan-scale", String(t.fanSize));
  }, [t.theme, t.displayFont, t.fanSize]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ielts_favs", JSON.stringify(favs));
    }
  }, [favs]);

  const spin = useCallback(() => {
    if (spinning.current) return;
    spinning.current = true;
    playTick(true); // play start sound
    const deck = pickFan(pool);
    setFanCards(deck);
    setPhase("spinning");
    setSelected(null);

    const profile = SPIN_PROFILE[t.spinSpeed] || 1;
    const loops = 1 + Math.floor(Math.random() * 2);
    const totalSteps = loops * FAN_N + Math.floor(Math.random() * FAN_N);
    const startIdx = Math.floor(Math.random() * FAN_N);
    const duration = 2400 * profile;
    const finalIdx = (startIdx + totalSteps) % FAN_N;
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
    const t0 = performance.now();
    let lastIdx = -1;

    const frame = (now: number) => {
      if (!spinning.current) return;
      const p = Math.min(1, (now - t0) / duration);
      const stepNow = Math.floor(easeOut(p) * totalSteps);
      const idx = (startIdx + stepNow) % FAN_N;
      if (idx !== lastIdx) {
        setHot(idx);
        if (lastIdx !== -1) playTick(); // Play tick sound when card changes
        lastIdx = idx;
      }
      if (p < 1) requestAnimationFrame(frame);
    };
    const finalize = () => {
      if (!spinning.current) return;
      spinning.current = false;
      setHot(finalIdx);
      setSelected({ item: pool[deck[finalIdx]], accent: palette[finalIdx % palette.length] });
      setPhase("result");
    };
    requestAnimationFrame(frame);
    setTimeout(finalize, duration + 360);
  }, [pool, palette, t.spinSpeed]);

  const closeResult = () => {
    setPhase("idle");
    setHot(-1);
  };
  const favKey = selected ? itemKey(mode, selected.item) : null;
  const isFav = favKey && favs.some((f) => f.key === favKey);
  const toggleFav = () => {
    if (!selected) return;
    setFavs((prev) =>
      prev.some((f) => f.key === favKey)
        ? prev.filter((f) => f.key !== favKey)
        : [{ key: favKey, mode, item: selected.item, accent: selected.accent }, ...prev]
    );
  };
  const openFav = (f: any) => {
    setMode(f.mode);
    setTimeout(() => {
      setSelected({ item: f.item, accent: f.accent });
      setPhase("result");
      setSavedOpen(false);
    }, 60);
  };
  const removeFav = (k: string) => setFavs((prev) => prev.filter((f) => f.key !== k));

  if (!isMounted) {
    return <div className="app-container" style={{ height: "100vh", background: "var(--bg)" }} />;
  }

  return (
    <div className="app-container" style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <div className="grid-bg"></div>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      {/* Back Button Overlay */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => router.push("/speaking")}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <header style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "22px 38px 0", position: "relative", zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 13, marginRight: "auto", marginLeft: "100px" }}>
          <span style={{ fontFamily: "var(--display)", fontSize: 25, fontWeight: 700, letterSpacing: "-.01em", color: "var(--ink)" }}>Speaking Roulette</span>
          <span style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 700 }}>IELTS</span>
        </div>
        <button
          onClick={() => setSavedOpen(true)}
          className="icon-btn"
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 16px", borderRadius: 11, border: "1px solid var(--line)", color: "var(--ink-soft)", fontWeight: 600, fontSize: 14 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 21.4 6.2 24l1.1-6.5L2.5 12.9l6.6-.9z" />
          </svg>
          Đã lưu {favs.length > 0 && <span style={{ background: "var(--ink)", color: "var(--bg)", borderRadius: 99, fontSize: 11, fontWeight: 800, padding: "1px 7px" }}>{favs.length}</span>}
        </button>
      </header>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, position: "relative", zIndex: 5 }}>
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="modetab"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                padding: "10px 20px",
                borderRadius: 13,
                background: on ? "var(--ink)" : "transparent",
                border: `1px solid ${on ? "var(--ink)" : "var(--line)"}`,
                color: on ? "var(--bg)" : "var(--ink-soft)",
                minWidth: 130,
                lineHeight: 1.15,
                cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>{m.label}</span>
              <span style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.7, fontWeight: 700, whiteSpace: "nowrap" }}>{m.sub}</span>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
        {/* Adjusted marginBottom: 380 to push cards higher from the center */}
        <div style={{ width: "100%", marginBottom: 380 }}>
          <Fan pool={pool} palette={palette} fanCards={fanCards} hotIndex={hot} phase={phase} onSpin={spin} />
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 13, pointerEvents: phase === "result" ? "none" : "auto" }}>
          <button
            onClick={spin}
            disabled={phase === "spinning"}
            className="btn-spin"
            style={{
              padding: "17px 52px",
              borderRadius: 99,
              fontFamily: "var(--display)",
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: ".01em",
              whiteSpace: "nowrap",
              background: "var(--ink)",
              color: "var(--bg)",
              boxShadow: "0 14px 36px rgba(0,0,0,.4)",
              opacity: phase === "spinning" ? 0.6 : 1,
              cursor: phase === "spinning" ? "default" : "pointer",
            }}
          >
            {phase === "spinning" ? "Đang quay..." : "Quay ngẫu nhiên"}
          </button>
          <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>
            {phase === "spinning" ? "Đang tìm câu hỏi..." : "Nhấn vào thẻ hoặc nút để rút câu hỏi ngẫu nhiên"}
          </div>
        </div>

        {phase === "result" && selected && (
          <Result
            mode={mode}
            item={selected.item}
            accent={selected.accent}
            showVocab={t.showVocab}
            isFav={isFav}
            onFav={toggleFav}
            onAgain={spin}
            onClose={closeResult}
          />
        )}
      </div>

      <SavedPanel open={savedOpen} favs={favs} onClose={() => setSavedOpen(false)} onOpen={openFav} onRemove={removeFav} />
    </div>
  );
}
