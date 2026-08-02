"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/diagnosticQuestions";
import { fetchDiagnosticQuestions } from "@/services/diagnosticService";
import VoiceRecorder from "@/components/VoiceRecorder";
import {
  Sparkles,
  Volume2,
  BookOpen,
  PenTool,
  Mic,
  BrainCircuit,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  AlertCircle,
  Undo2,
  TrendingUp,
  Lightbulb,
  Award,
  Trophy,
  Timer,
  Route,
  ClipboardCheck
} from "lucide-react";

export default function OrientationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRetest = searchParams?.get('retest') === 'true';
  const retestPathId = searchParams?.get('pathId');
  const locale = params?.locale || "vi";

  // Wizard steps:
  // 0: Intro
  // 1: Listening
  // 2: Reading
  // 3: Writing
  // 4: Speaking
  // 5: AI Scanner animation
  // 6: Results + roadmap form
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // AI scanner animation states
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);

  // Band result from computed scoring
  const [calculatedBand, setCalculatedBand] = useState<number>(5.0);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [comparison, setComparison] = useState<any>(null);

  // Roadmap generation form states
  const [targetBand, setTargetBand] = useState<number>(6.5);
  const [dailyHours, setDailyHours] = useState<number>(2.0);
  const [targetDate, setTargetDate] = useState<string>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [focusSkills, setFocusSkills] = useState<string[]>([
    "Listening", "Reading", "Writing", "Speaking"
  ]);

  const [questions, setQuestions] = useState<any>(DIAGNOSTIC_QUESTIONS);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await fetchDiagnosticQuestions();
        if (data && (data.listening?.length > 0 || data.reading?.length > 0 || data.writing?.length > 0 || data.speaking?.length > 0)) {
          const mappedQuestions: any = {
            listening: (data.listening || []).map((m: any, idx: number) => {
              const content = m.content;
              const extra = m.extra_data || {};
              return {
                id: `l${idx + 1}`,
                type: extra.type || "fill_in_blank",
                audioDescription: content?.test_name || extra.audioDescription || "Listening Section",
                transcript: content?.activeSection?.transcript || content?.transcript || extra.transcript || "",
                questionText: extra.questionText || "Answer the question based on the audio",
                options: extra.options || [],
                correctAnswer: extra.correctAnswer || "",
                answers: extra.answers || [],
                audioSrc: extra.audioSrc || "",
              };
            }),
            reading: (data.reading || []).map((m: any, idx: number) => {
              const content = m.content;
              const extra = m.extra_data || {};
              return {
                id: `r${idx + 1}`,
                type: extra.type || "true_false_not_given",
                passage: content?.content_html || extra.passage || "",
                items: extra.items || content?.questions || [],
                questionText: extra.questionText || "",
                options: extra.options || [],
                correctAnswer: extra.correctAnswer || "",
              };
            }),
            writing: (data.writing || []).map((m: any, idx: number) => {
              const content = m.content;
              const extra = m.extra_data || {};
              return {
                id: `w${idx + 1}`,
                type: content?.task_type || extra.type || `task${idx + 1}`,
                instruction: extra.instruction || (content?.task_type === "task2" ? "You should spend about 40 minutes on this task. Write at least 250 words." : "You should spend about 20 minutes on this task. Write at least 150 words."),
                prompt: content?.description || extra.prompt || "",
                chartDescription: extra.chartDescription || "",
                minimumWords: extra.minimumWords || (content?.task_type === "task2" ? 250 : 150),
                cloudinaryUrl: content?.cloudinary_url || "",
              };
            }),
            speaking: (data.speaking || []).map((m: any, idx: number) => {
              const content = m.content;
              const extra = m.extra_data || {};
              return {
                id: `sp${idx + 1}`,
                type: extra.type || `part${idx + 1}`,
                instruction: extra.instruction || "",
                questions: content?.questions || extra.questions || [],
                cueCard: content?.cue_card || extra.cueCard || "",
                bulletPoints: content?.bullet_points || extra.bulletPoints || [],
              };
            }),
          };

          if (mappedQuestions.listening.length === 0) mappedQuestions.listening = DIAGNOSTIC_QUESTIONS.listening;
          if (mappedQuestions.reading.length === 0) mappedQuestions.reading = DIAGNOSTIC_QUESTIONS.reading;
          if (mappedQuestions.writing.length === 0) mappedQuestions.writing = DIAGNOSTIC_QUESTIONS.writing;
          if (mappedQuestions.speaking.length === 0) mappedQuestions.speaking = DIAGNOSTIC_QUESTIONS.speaking;

          setQuestions(mappedQuestions);
        }
      } catch (err) {
        console.error("Failed to load diagnostic questions from DB, using fallback local questions:", err);
      }
    }
    loadQuestions();
  }, []);

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const getWordCount = (text: string) => {
    return (text || "").trim().split(/\s+/).filter(Boolean).length;
  };

  // Compute band from objective answers when entering scanner step
  const computeBand = () => {
    let correct = 0;

    // Grade Listening dynamically using questions.listening
    if (questions.listening && Array.isArray(questions.listening)) {
      questions.listening.forEach((q: any) => {
        const userAns = (answers[q.id] || "").trim().toLowerCase();
        if (!userAns) return;

        if (q.type === "multiple_choice") {
          const correctAns = (q.correctAnswer || "").trim().toLowerCase();
          const normalizedAns = userAns.charAt(0);
          const normalizedCorrect = correctAns.charAt(0);
          if (normalizedAns && normalizedCorrect && normalizedAns === normalizedCorrect) {
            correct += 1;
          }
        } else {
          const possibleAnswers = (q.answers || [q.correctAnswer] || [])
            .map((a: any) => String(a).trim().toLowerCase())
            .filter(Boolean);
            
          if (q.id === "l1" && q.audioDescription?.includes("Accommodation")) {
            // Legacy / fallback question l1
            if (userAns.includes("monday")) correct += 1;
            if (userAns.includes("2") || userAns.includes("two")) correct += 1;
          } else {
            const isMatch = possibleAnswers.some((pa: string) => userAns.includes(pa) || pa.includes(userAns));
            if (isMatch) {
              correct += 1;
            }
          }
        }
      });
    }

    // Grade Reading dynamically using questions.reading
    if (questions.reading && Array.isArray(questions.reading)) {
      // r1 True/False/Not Given
      const r1 = questions.reading[0];
      if (r1 && r1.items) {
        r1.items.forEach((item: any, idx: number) => {
          const key = `r1_${idx}`;
          const userAns = (answers[key] || "").trim().toUpperCase();
          const correctAns = (item.correctAnswer || item.correct_answer || "").trim().toUpperCase();
          if (userAns && userAns === correctAns) {
            correct += 1;
          }
        });
      }

      // r2 Multiple Choice
      const r2 = questions.reading[1];
      if (r2) {
        const userAns = (answers.r2 || "").trim().toUpperCase();
        const correctAns = (r2.correctAnswer || r2.correct_answer || "").trim().toUpperCase();
        if (userAns && correctAns && userAns.charAt(0) === correctAns.charAt(0)) {
          correct += 1;
        }
      }
    }

    // Writing contribution
    const w1Len = getWordCount(answers.w1);
    const w2Len = getWordCount(answers.w2);
    if (w1Len > 150) correct += 1;
    else if (w1Len > 50) correct += 0.5;
    if (w2Len > 250) correct += 1;
    else if (w2Len > 100) correct += 0.5;

    // Band mapping (0–10 scale)
    let band = 4.0;
    if (correct <= 2) band = 4.0;
    else if (correct <= 4) band = 4.5;
    else if (correct <= 5) band = 5.0;
    else if (correct <= 6) band = 5.5;
    else if (correct <= 7) band = 6.0;
    else if (correct <= 8) band = 6.5;
    else if (correct <= 9) band = 7.0;
    else band = 7.5;

    setCalculatedBand(band);
    setTargetBand(Math.min(9.0, band + 1.5));
  };

  const handleSubmit = async () => {
    computeBand();
    setStep(5);
    setScanProgress(0);
    setScanStepIndex(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const submitRes = await fetch("/api/student/diagnostic/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({ 
          answers,
          isRetest,
          retestPathId,
          answerKey: {
            listening: (questions.listening || []).map((q: any) => ({
              id: q.id,
              answers: q.answers || [q.correctAnswer],
              correctAnswer: q.correctAnswer
            })),
            reading: (questions.reading || []).map((q: any) => ({
              id: q.id,
              items: q.items || [],
              correctAnswer: q.correctAnswer
            }))
          }
        })
      });

      const submitData = await submitRes.json();
      if (submitData.success) {
        if (submitData.id) setDiagnosticId(submitData.id);
        if (submitData.comparison) setComparison(submitData.comparison);
      }
    } catch (err: any) {
      console.error("Failed to submit diagnostic answers:", err);
    }
  };

  const handleCompleteRoadmap = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await fetch("/api/student/roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`
      },
      body: JSON.stringify({ 
        action: "COMPLETE", 
        pathId: retestPathId 
      })
    });
    router.push(`/${locale}/roadmap`);
  };

  // AI scanner progress animation
  useEffect(() => {
    if (step !== 5) return;

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setStep(6), 400);
          return 100;
        }
        return prev + 4;
      });
    }, 180);

    const stepInterval = setInterval(() => {
      setScanStepIndex(prev => {
        if (prev >= 4) { clearInterval(stepInterval); return 4; }
        return prev + 1;
      });
    }, 700);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [step]);

  // Navigate to roadmap after generating
  const handleGenerateRoadmap = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/student/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({
          action: "GENERATE",
          currentBand: calculatedBand,
          targetBand,
          dailyHours,
          targetDate,
          focusSkills,
          diagnosticId
        })
      });

      if (!res.ok) throw new Error("Lỗi khi kết nối với API tạo lộ trình");
      router.push(`/${locale}/roadmap`);
    } catch (err: any) {
      setSubmitError(err.message || "Đã xảy ra lỗi không xác định");
      setIsSubmitting(false);
    }
  };

  const handleSkillsChange = (skill: string) => {
    setFocusSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Band description helpers (same as original)
  const getBandTitle = (band: number) => {
    if (band >= 7.0) return "Good User (Trình độ Khá)";
    if (band >= 6.0) return "Competent User (Trình độ Trung Khá)";
    if (band >= 5.0) return "Modest User (Trình độ Trung Bình)";
    return "Limited User (Trình độ Yếu)";
  };

  const scanSteps = [
    "Đang quét và đối chiếu câu trả lời Listening...",
    "Đang phân tích bài đọc Reading...",
    "Đang đánh giá bài viết Writing...",
    "Đang nhận xét phần Speaking...",
    "Hoàn tất đánh giá. Trình bày kết quả..."
  ];

  // ─── SHARED QUIZ CHROME ────────────────────────────────────
  // Card shell reused by every question block across steps 1–4.
  const cardClass =
    "bg-white rounded-xl border-[3px] border-black p-6 md:p-7 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";

  const renderStepHeader = (
    part: number,
    title: string,
    Icon: any,
    range: string,
    tintClass: string,
    labelClass: string
  ) => (
    <div className="bg-white rounded-xl border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${tintClass}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className={`block text-[11px] font-black uppercase tracking-[0.2em] ${labelClass}`}>
            Phần {part} / 4
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#1b3d1e] tracking-tight leading-none">
            {title}
          </h2>
        </div>
      </div>
      <span className="rounded-full bg-[#2c4728] text-white px-4 py-2 text-[11px] font-extrabold tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        {range}
      </span>
    </div>
  );

  const renderStepNav = (
    onBack: () => void,
    onNext: () => void,
    nextLabel: string,
    nextBgClass: string,
    isFinal = false
  ) => (
    <div className="flex flex-wrap justify-between items-center gap-4 pt-2 pb-2">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full bg-white border-[3px] border-black px-7 py-3.5 text-sm font-black text-[#1b3d1e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer select-none"
      >
        <ChevronLeft className="w-5 h-5" /> Quay lại
      </button>
      <button
        onClick={onNext}
        className={`inline-flex items-center gap-2.5 rounded-full border-[3px] border-black px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base font-black text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer select-none ${nextBgClass}`}
      >
        <span>{nextLabel}</span>
        {isFinal ? <ArrowRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );

  // ─── STEP 0: INTRO ─────────────────────────────────────────
  const renderIntro = () => (
    <div className="text-left w-full max-w-[1240px] mx-auto space-y-8 md:space-y-10">
      {isRetest && (
        <div className="bg-[#fff8e8] border-[3px] border-black rounded-xl p-5 md:p-6 flex gap-4 items-start shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-11 h-11 shrink-0 rounded-lg bg-[#B38F4D] border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-[#1b3d1e]">Bài Kiểm Tra Lại (Retest)</h4>
            <p className="text-[13px] text-[#2d4a2d]/75 font-semibold leading-relaxed">
              Đây là bài kiểm tra lại để đánh giá tiến bộ của bạn so với lộ trình đang theo.
            </p>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        style={{ background: "linear-gradient(105deg, #1a331c 0%, #3B5C37 45%, #5c8257 100%)" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==')] opacity-60 pointer-events-none" />
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#B38F4D]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-14 items-center p-8 sm:p-10 md:p-14 lg:p-16 min-h-[440px] md:min-h-[520px]">
          {/* Left: copy + CTA */}
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm px-4 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#e3c98a]" />
              IELTS Placement Diagnostic Test
            </span>

            <div className="space-y-4">
              <h1 className="font-black text-white tracking-tight leading-[1.05]">
                <span className="block text-3xl sm:text-4xl md:text-5xl">Kiểm Tra</span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[64px]">
                  Năng Lực <span className="text-[#e3c98a]">Đầu Vào</span>
                </span>
              </h1>
              <p className="text-[14px] md:text-[16px] lg:text-[17px] text-white/85 font-medium leading-relaxed max-w-[560px]">
                Bài kiểm tra ~30 phút bao quát đủ 4 kỹ năng Listening, Reading, Writing và Speaking.
                Sau khi nộp bài, AI sẽ phân tích điểm mạnh — điểm yếu và đề xuất lộ trình học 12 tuần
                tối ưu riêng cho bạn.
              </p>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { icon: Timer, text: "~30 phút" },
                { icon: ClipboardCheck, text: "4 kỹ năng · 7+ câu hỏi" },
                { icon: Route, text: "Lộ trình 12 tuần" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-[11px] md:text-xs font-bold text-white/90 backdrop-blur-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-[#e3c98a]" />
                  {text}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 md:px-10 md:py-4.5 text-sm md:text-base font-black text-[#1f3e1b] border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer select-none"
              >
                <span>Bắt Đầu Làm Bài</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-[11px] md:text-xs text-white/60 font-semibold italic">
                Miễn phí · Không giới hạn số lần kiểm tra
              </span>
            </div>
          </div>

          {/* Right: AI orb */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-6">
            <div className="relative w-[240px] h-[240px] flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-spin"
                style={{ animationDuration: "18s" }}
              />
              <div
                className="absolute inset-6 rounded-full border border-[#e3c98a]/50 animate-spin"
                style={{ animationDuration: "9s", animationDirection: "reverse" }}
              />
              <div className="w-[136px] h-[136px] rounded-full bg-gradient-to-tr from-[#3B5C37] to-[#B38F4D] border-[3px] border-black shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center justify-center">
                <BrainCircuit className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
            <div className="w-full max-w-[260px] rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-4 text-center">
              <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                Kết quả bạn nhận được
              </span>
              <span className="block mt-1.5 text-xl font-black text-white leading-tight">
                Band ước tính + Lộ trình AI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 SKILL CARDS ────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-black text-[#1b3d1e] tracking-tight">
            Bài kiểm tra gồm những gì?
          </h2>
          <p className="text-[13px] font-semibold text-[#5b6484]">
            4 phần thi tuần tự — bạn có thể quay lại chỉnh sửa trước khi nộp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Volume2,
              label: "Listening",
              detail: "Nghe audio kèm transcript, làm dạng Điền từ và Trắc nghiệm.",
              badge: "3 câu hỏi",
              tint: "bg-[#dbeafe] text-[#2563eb]",
            },
            {
              icon: BookOpen,
              label: "Reading",
              detail: "Đọc hiểu bài học thuật với dạng True/False/Not Given và MCQ.",
              badge: "4 câu hỏi",
              tint: "bg-[#dcfce7] text-[#16a34a]",
            },
            {
              icon: PenTool,
              label: "Writing",
              detail: "Task 1 mô tả biểu đồ (150 từ) và Task 2 bài luận (250 từ).",
              badge: "2 bài viết",
              tint: "bg-[#ffedd5] text-[#ea580c]",
            },
            {
              icon: Mic,
              label: "Speaking",
              detail: "Part 1 trả lời ngắn và Part 2 Cue Card, ghi âm trực tiếp.",
              badge: "2 phần nói",
              tint: "bg-[#fce7f3] text-[#db2777]",
            },
          ].map(({ icon: Icon, label, detail, badge, tint }, idx) => (
            <div
              key={label}
              className="group relative flex flex-col bg-white rounded-xl border-[3px] border-black p-6 min-h-[268px] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
            >
              <span className="absolute top-5 right-6 text-2xl font-black text-black/10 select-none">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <div
                className={`w-14 h-14 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${tint}`}
              >
                <Icon className="w-7 h-7" />
              </div>

              <h3 className="mt-5 text-[19px] md:text-[20px] font-black text-[#1b3d1e] tracking-tight">
                {label}
              </h3>
              <p className="mt-2 flex-1 text-[13px] font-semibold text-[#2d4a2d]/70 leading-relaxed">
                {detail}
              </p>
              <span className="mt-5 inline-flex w-max items-center rounded-full bg-[#2c4728] text-white px-4 py-1.5 text-[11px] font-extrabold tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS + NOTE ──────────────────────────── */}
      <section className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="rounded-xl bg-white border border-[#e8ebf3] p-7 md:p-9 shadow-[0_4px_32px_rgba(20,28,60,0.07)]">
          <h3 className="text-xl md:text-2xl font-black text-[#1b3d1e] tracking-tight">
            Quy trình 3 bước
          </h3>
          <div className="mt-7 space-y-6">
            {[
              {
                icon: ClipboardCheck,
                title: "Làm bài kiểm tra 4 kỹ năng",
                desc: "Hoàn thành lần lượt Listening → Reading → Writing → Speaking trong khoảng 30 phút.",
              },
              {
                icon: BrainCircuit,
                title: "AI chấm và phân tích",
                desc: "Hệ thống đối chiếu đáp án, đánh giá bài viết và bài nói để ước tính band điểm hiện tại.",
              },
              {
                icon: Route,
                title: "Nhận lộ trình cá nhân hóa",
                desc: "Chọn band mục tiêu, thời gian học mỗi ngày và ngày thi — AI dựng lộ trình 12 tuần chia 3 giai đoạn.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-lg bg-[#f2f6ee] border-2 border-[#3B5C37]/15 flex items-center justify-center text-[#3B5C37]">
                    <Icon className="w-5 h-5" />
                  </div>
                  {i < 2 && <div className="absolute left-1/2 top-11 h-6 w-0.5 -translate-x-1/2 bg-[#3B5C37]/15" />}
                </div>
                <div className="pt-0.5">
                  <h4 className="text-[15px] md:text-base font-extrabold text-[#121a3c]">{title}</h4>
                  <p className="mt-1 text-[13px] font-medium text-[#5b6484] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#f2f6ee] border-[3px] border-[#3B5C37]/20 p-7 md:p-9 flex flex-col justify-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#3B5C37] flex items-center justify-center text-white shadow-md">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-black text-[#1b3d1e]">Lưu ý quan trọng</h4>
          <p className="text-[13px] font-semibold text-[#3B5C37]/85 leading-relaxed">
            Vui lòng làm bài nghiêm túc, không tra từ điển hay dùng công cụ dịch — để AI đo đúng
            trình độ thực tế và xây lộ trình phù hợp nhất với bạn.
          </p>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 pt-2 pb-4">
        <button
          onClick={() => setStep(1)}
          className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#3B5C37] hover:bg-[#1f3e1b] px-10 py-4 md:px-12 md:py-5 text-sm md:text-base font-black text-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer select-none"
        >
          <span>Bắt Đầu Làm Bài Ngay</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-semibold text-[#5b6484] italic">
          Bạn có thể thoát giữa chừng, nhưng kết quả sẽ không được lưu.
        </span>
      </div>
    </div>
  );

  // ─── STEP 1: LISTENING ─────────────────────────────────────
  const renderListening = () => (
    <div className="space-y-6 text-left w-full max-w-4xl mx-auto">
      {renderStepHeader(1, "Listening Practice", Volume2, "Q1 - Q3", "bg-[#dbeafe] text-[#2563eb]", "text-[#2563eb]")}

      <div className={cardClass}>
        {/* Audio Player */}
        {questions.listening[0]?.audioSrc && (
          <div className="bg-[#eef4ff] rounded-lg border-2 border-black/10 p-4 md:p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black text-[#1b3d1e] uppercase tracking-wide">File âm thanh bài nghe</p>
                <p className="text-[13px] text-[#5b6484] font-semibold leading-tight">{questions.listening[0]?.audioDescription}</p>
              </div>
            </div>
            <audio
              src={questions.listening[0].audioSrc}
              controls
              className="w-full lg:w-[400px] h-10 outline-none block"
            />
          </div>
        )}

        <div className="divide-y-2 divide-black/5">
          {questions.listening.map((q: any, idx: number) => (
            <div key={q.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
              <label className="flex items-start gap-3 text-base md:text-[17px] font-extrabold text-[#1b3d1e] leading-snug">
                <span className="shrink-0 w-7 h-7 rounded-full bg-[#dbeafe] text-[#2563eb] border-2 border-black text-[11px] font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="pt-0.5">
                  {typeof q.questionText === "string" ? q.questionText.replace(/\{\d+\}/g, "_______") : q.questionText}
                </span>
              </label>

              <div className="pl-10">
                {q.type === "fill_in_blank" && (
                  <input
                    type="text"
                    placeholder="Nhập câu trả lời..."
                    value={answers[q.id] || ""}
                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-5 py-3.5 rounded-lg border-2 border-black/15 bg-[#fafbfe] text-sm font-semibold text-[#1b3d1e] placeholder:text-slate-400 placeholder:font-medium focus:border-[#2563eb] focus:bg-white outline-none transition-all"
                  />
                )}

                {q.type === "multiple_choice" && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {q.options?.map((opt: any) => {
                      const isString = typeof opt === "string";
                      const letter = isString ? opt.charAt(0) : (opt.key || opt.letter || opt.value || "");
                      const text = isString ? opt : (opt.text || opt.label || opt.value || "");
                      const isSelected = answers[q.id] === letter;
                      const keyStr = isString ? opt : (opt.key || JSON.stringify(opt));
                      return (
                        <button
                          key={keyStr}
                          type="button"
                          onClick={() => handleAnswerChange(q.id, letter)}
                          className={`text-left px-4 py-3.5 rounded-lg border-2 text-sm font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "border-black bg-[#dbeafe] text-[#1e40af] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                              : "border-black/15 bg-[#fafbfe] hover:border-black/40 hover:bg-white text-[#5b6484]"
                          }`}
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {renderStepNav(() => setStep(0), () => setStep(2), "Tiếp tục Reading", "bg-[#2563eb] hover:bg-[#1d4ed8]")}
    </div>
  );

  // ─── STEP 2: READING ───────────────────────────────────────
  const renderReading = () => (
    <div className="space-y-6 text-left w-full max-w-[1240px] mx-auto">
      {renderStepHeader(2, "Reading Practice", BookOpen, "Q4 - Q7", "bg-[#dcfce7] text-[#16a34a]", "text-[#16a34a]")}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Passage */}
        <div className={`${cardClass} lg:sticky lg:top-6 h-fit max-h-[640px] overflow-y-auto space-y-4`}>
          <div className="flex items-center gap-3 border-b-2 border-black/10 pb-3">
            <div className="w-10 h-10 rounded-lg bg-[#dcfce7] text-[#16a34a] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base md:text-[17px] font-black text-[#1b3d1e] leading-tight">
              Urban Agriculture: The Green Revolution in Cities
            </h3>
          </div>
          <div 
            className="text-[14px] text-[#3d4663] font-medium leading-[1.8] whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: questions.reading[0]?.passage || "" }}
          />
        </div>

        {/* Questions */}
        <div className={cardClass}>
          <div className="divide-y-2 divide-black/5">
            {/* Q4-6 True / False / Not Given */}
            <section className="pb-7 space-y-5">
              <h4 className="text-[11px] font-black text-[#16a34a] uppercase tracking-[0.2em]">
                Q4-6 · True / False / Not Given
              </h4>
              {questions.reading[0]?.items?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <p className="flex items-start gap-3 text-[15px] font-extrabold text-[#1b3d1e] leading-snug">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[#dcfce7] text-[#16a34a] border-2 border-black text-[11px] font-black flex items-center justify-center">
                      {4 + idx}
                    </span>
                    <span className="pt-0.5">{item.statement}</span>
                  </p>
                  <div className="flex gap-2.5 pl-10">
                    {["TRUE", "FALSE", "NOT GIVEN"].map(opt => {
                      const key = `r1_${idx}`;
                      const isSelected = answers[key] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(key, opt)}
                          className={`flex-1 py-2.5 rounded-lg border-2 text-[11px] font-black text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-black bg-[#dcfce7] text-[#15803d] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                              : "border-black/15 bg-[#fafbfe] hover:border-black/40 hover:bg-white text-[#5b6484]"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            {/* Q7 Multiple Choice */}
            <section className="pt-7 space-y-4">
              <h4 className="text-[11px] font-black text-[#16a34a] uppercase tracking-[0.2em]">
                Q7 · Multiple Choice
              </h4>
              <p className="flex items-start gap-3 text-[15px] font-extrabold text-[#1b3d1e] leading-snug">
                <span className="shrink-0 w-7 h-7 rounded-full bg-[#dcfce7] text-[#16a34a] border-2 border-black text-[11px] font-black flex items-center justify-center">
                  7
                </span>
                <span className="pt-0.5">{questions.reading[1]?.questionText}</span>
              </p>
              <div className="grid gap-3 pl-10">
                {questions.reading[1]?.options?.map((opt: any) => {
                  const isString = typeof opt === "string";
                  const letter = isString ? opt.charAt(0) : (opt.key || opt.letter || opt.value || "");
                  const text = isString ? opt : (opt.text || opt.label || opt.value || "");
                  const isSelected = answers.r2 === letter;
                  const keyStr = isString ? opt : (opt.key || JSON.stringify(opt));
                  return (
                    <button
                      key={keyStr}
                      type="button"
                      onClick={() => handleAnswerChange("r2", letter)}
                      className={`w-full text-left px-4 py-3.5 rounded-lg border-2 text-sm transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "border-black bg-[#dcfce7] text-[#15803d] font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "border-black/15 bg-[#fafbfe] hover:border-black/40 hover:bg-white text-[#5b6484] font-semibold"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? "border-black bg-[#16a34a] text-white" : "border-black/25"}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span>{text}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {renderStepNav(() => setStep(1), () => setStep(3), "Tiếp tục Writing", "bg-[#16a34a] hover:bg-[#15803d]")}
    </div>
  );

  // ─── STEP 3: WRITING ───────────────────────────────────────
  const renderWriting = () => {
    const wordBadge = (count: number, min: number) => (
      <span
        className={`rounded-full border-2 border-black px-3.5 py-1.5 text-[11px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
          count >= min ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#ffedd5] text-[#c2410c]"
        }`}
      >
        {count} / {min} từ
      </span>
    );

    return (
      <div className="space-y-6 text-left w-full max-w-4xl mx-auto">
        {renderStepHeader(3, "Writing Practice", PenTool, "Task 1 + Task 2", "bg-[#ffedd5] text-[#ea580c]", "text-[#ea580c]")}

        <div className={cardClass}>
          <div className="divide-y-2 divide-black/5">
            {/* Task 1 */}
            <section className="pb-7 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-[0.2em]">
                  Task 1 · Academic Report
                </span>
                {wordBadge(getWordCount(answers.w1), 150)}
              </div>

              <div
                className="text-[15px] font-bold text-[#3d4663] italic leading-relaxed [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: questions.writing[0]?.prompt || "" }}
              />

              {questions.writing[0]?.cloudinaryUrl && (
                <div className="max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-black/15 bg-[#fafbfe] flex items-center justify-center p-3">
                  <img
                    src={questions.writing[0].cloudinaryUrl}
                    alt="Writing Task 1 Chart"
                    className="max-h-[380px] object-contain w-auto h-auto rounded"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {questions.writing[0]?.chartDescription && (
                <pre className="text-[12px] font-mono bg-[#fafbfe] p-4 rounded-lg border-2 border-black/15 whitespace-pre-line text-[#3d4663] leading-relaxed">
                  {questions.writing[0]?.chartDescription}
                </pre>
              )}

              <textarea
                rows={10}
                placeholder="Nhập bài làm Task 1 của bạn (ít nhất 150 từ)..."
                value={answers.w1 || ""}
                onChange={e => handleAnswerChange("w1", e.target.value)}
                className={`w-full p-5 rounded-lg border-2 bg-[#fafbfe] text-sm font-medium text-[#1b3d1e] leading-relaxed placeholder:text-slate-400 outline-none focus:bg-white transition-all resize-y ${
                  getWordCount(answers.w1) >= 150 ? "border-[#16a34a]" : "border-black/15 focus:border-[#ea580c]"
                }`}
              />
            </section>

            {/* Task 2 */}
            <section className="pt-7 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-[0.2em]">
                  Task 2 · Essay
                </span>
                {wordBadge(getWordCount(answers.w2), 250)}
              </div>

              <div
                className="text-[15px] font-bold text-[#3d4663] italic leading-relaxed [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: questions.writing[1]?.prompt || "" }}
              />

              <textarea
                rows={14}
                placeholder="Nhập bài làm Task 2 của bạn (ít nhất 250 từ)..."
                value={answers.w2 || ""}
                onChange={e => handleAnswerChange("w2", e.target.value)}
                className={`w-full p-5 rounded-lg border-2 bg-[#fafbfe] text-sm font-medium text-[#1b3d1e] leading-relaxed placeholder:text-slate-400 outline-none focus:bg-white transition-all resize-y ${
                  getWordCount(answers.w2) >= 250 ? "border-[#16a34a]" : "border-black/15 focus:border-[#ea580c]"
                }`}
              />
            </section>
          </div>
        </div>

        {renderStepNav(() => setStep(2), () => setStep(4), "Tiếp tục Speaking", "bg-[#ea580c] hover:bg-[#c2410c]")}
      </div>
    );
  };

  // ─── STEP 4: SPEAKING ──────────────────────────────────────
  const renderSpeaking = () => (
    <div className="space-y-6 text-left w-full max-w-4xl mx-auto">
      {renderStepHeader(4, "Speaking Practice", Mic, "Part 1 + Part 2", "bg-[#fce7f3] text-[#db2777]", "text-[#db2777]")}

      <div className={cardClass}>
        <div className="divide-y-2 divide-black/5">
          {/* Part 1 */}
          <section className="pb-7 space-y-5">
            <div className="space-y-1.5">
              <span className="block text-[11px] font-black text-[#db2777] uppercase tracking-[0.2em]">
                Part 1 · Short Answers
              </span>
              <p className="text-[13px] text-[#5b6484] font-semibold italic">{questions.speaking[0]?.instruction}</p>
            </div>
            {questions.speaking[0]?.questions?.map((q: string, idx: number) => (
              <div key={idx} className="space-y-3">
                <label className="flex items-start gap-3 text-[15px] font-extrabold text-[#1b3d1e] leading-snug">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#fce7f3] text-[#db2777] border-2 border-black text-[11px] font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{q}</span>
                </label>
                <div className="pl-10">
                  <VoiceRecorder
                    onTranscription={(txt) => handleAnswerChange(`sp1_${idx}`, txt)}
                    initialValue={answers[`sp1_${idx}`] || ""}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Part 2 */}
          <section className="pt-7 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="text-[11px] font-black text-[#db2777] uppercase tracking-[0.2em]">
                Part 2 · Cue Card
              </span>
              <span
                className={`rounded-full border-2 border-black px-3.5 py-1.5 text-[11px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  getWordCount(answers.sp2) >= 80 ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fce7f3] text-[#be185d]"
                }`}
              >
                {getWordCount(answers.sp2)} / 80 từ
              </span>
            </div>

            <div className="border-2 border-black/15 bg-[#fdf2f8] rounded-lg p-5 space-y-3">
              <p className="text-lg md:text-xl font-black text-[#1b3d1e] leading-snug">
                {questions.speaking[1]?.cueCard}
              </p>
              <ul className="bg-white/70 p-4 rounded-lg border-2 border-dashed border-[#db2777]/40 space-y-1.5 list-disc list-inside text-sm font-semibold text-[#3d4663]">
                {questions.speaking[1]?.bulletPoints?.map((pt: string, i: number) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            <VoiceRecorder
              onTranscription={(txt) => handleAnswerChange("sp2", txt)}
              initialValue={answers.sp2 || ""}
            />
          </section>
        </div>
      </div>

      {renderStepNav(
        () => setStep(3),
        handleSubmit,
        "Nộp Bài & AI Phân Tích",
        "bg-gradient-to-r from-[#3B5C37] to-[#B38F4D] hover:opacity-95",
        true
      )}
    </div>
  );

  // ─── STEP 5: AI SCANNER ────────────────────────────────────
  const renderScanner = () => (
    <div className="bg-white rounded-xl p-8 md:p-12 border border-slate-100 shadow-xl flex flex-col items-center justify-center min-h-[450px] text-center relative overflow-hidden max-w-xl mx-auto py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3B5C37]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B38F4D]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#3B5C37]/40 animate-spin" style={{ animationDuration: "10s" }} />
        <div className="absolute inset-2 rounded-full border border-double border-[#B38F4D]/50 animate-spin animate-pulse" style={{ animationDuration: "4s", animationDirection: "reverse" }} />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3B5C37] to-[#B38F4D] flex items-center justify-center shadow-lg">
          <BrainCircuit className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-black text-[#0d153a] mb-2">Trợ Lý AI Đang Phân Tích</h3>

      <div className="w-full max-w-sm bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-200/50">
        <div
          className="h-full bg-gradient-to-r from-[#3B5C37] to-[#B38F4D] transition-all duration-200 rounded-full"
          style={{ width: `${scanProgress}%` }}
        />
      </div>

      <div className="w-full max-w-xs text-left space-y-3 bg-slate-50/50 p-5 rounded-xl border border-slate-100/80">
        {scanSteps.map((msg, idx) => {
          const isDone = scanStepIndex > idx;
          const isActive = scanStepIndex === idx;
          return (
            <div key={idx} className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${isDone || isActive ? "opacity-100" : "opacity-30"}`}>
              {isDone ? (
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              ) : isActive ? (
                <div className="w-4 h-4 border-2 border-[#3B5C37] border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span className={`font-bold ${isActive ? "text-[#3B5C37]" : "text-[#5e6792]"}`}>{msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─── STEP 6: RESULTS + ROADMAP FORM ────────────────────────
  const renderResults = () => {
    const durationWeeks = Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    return (
      <div className="space-y-8 text-left max-w-4xl mx-auto py-2">
        {comparison && (
          <div className={`p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            comparison.reachedTarget 
              ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-800" 
              : comparison.improved 
                ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-800" 
                : "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-800"
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                comparison.reachedTarget ? "bg-emerald-500/20 text-emerald-700" : comparison.improved ? "bg-blue-500/20 text-blue-700" : "bg-amber-500/20 text-amber-700"
              }`}>
                {comparison.reachedTarget ? <Trophy className="w-5 h-5" /> : comparison.improved ? <TrendingUp className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold uppercase tracking-wider">
                  {comparison.reachedTarget ? "Đạt mục tiêu!" : comparison.improved ? "Tiến bộ ghi nhận!" : "Kết quả kiểm tra lại"}
                </h4>
                <p className="text-xs font-bold leading-relaxed">
                  {comparison.reachedTarget && (
                    <>
                      🎉 Chúc mừng! Bạn đã đạt mục tiêu Band {comparison.targetBand}. Band hiện tại: {comparison.newBand} (tăng {comparison.bandDiff} so với lần test trước).
                    </>
                  )}
                  {!comparison.reachedTarget && comparison.improved && (
                    <>
                      📈 Bạn đã tiến bộ! Band tăng từ {comparison.oldBand} lên {comparison.newBand} (+{comparison.bandDiff}). Mục tiêu {comparison.targetBand} — cố gắng thêm nhé!
                    </>
                  )}
                  {!comparison.improved && (
                    <>
                      Band hiện tại {comparison.newBand}, chưa thấy tiến bộ so với lần trước ({comparison.oldBand}). Hãy xem lại các phase trong lộ trình và tập trung vào kỹ năng còn yếu.
                    </>
                  )}
                </p>
              </div>
            </div>
            {comparison.reachedTarget && (
              <button
                onClick={handleCompleteRoadmap}
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <span>Đánh dấu hoàn thành lộ trình 🎉</span>
              </button>
            )}
          </div>
        )}
        {/* Success banner */}
        <div className="bg-gradient-to-r from-[#3B5C37] to-[#1f3e1b] rounded-xl p-6 md:p-8 text-white relative overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 blur-xl rounded-full" />
          <div className="space-y-2 z-10 text-center md:text-left">
            <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Kết Quả Đánh Giá Năng Lực AI
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
              Chúc Mừng Bạn Đã Hoàn Thành Bài Kiểm Tra!
            </h2>
            <p className="text-xs text-white/80 font-medium max-w-md">
              AI đã phân tích bài làm 4 kỹ năng của bạn và đề xuất lộ trình học IELTS cá nhân hóa phù hợp nhất.
            </p>
          </div>
          <div className="bg-white/10 px-6 py-5 rounded-xl border border-white/20 text-center z-10 shrink-0 self-center min-w-[160px]">
            <Award className="w-8 h-8 text-[#B38F4D] mx-auto mb-1 animate-bounce" />
            <span className="text-[10px] text-white/70 font-bold block uppercase tracking-wider">Band Ước Tính</span>
            <span className="text-3xl font-black text-white">{calculatedBand.toFixed(1)}</span>
          </div>
        </div>

        {/* Band card + AI analysis */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="font-extrabold text-[#0d153a] text-xs uppercase tracking-wider">Trình Độ Ước Tính</h3>
            <div className="w-28 h-28 rounded-full border-4 border-[#3B5C37]/20 flex items-center justify-center bg-emerald-50/50 shadow-inner">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">IELTS Band</span>
                <span className="text-3xl font-black text-[#3B5C37]">{calculatedBand.toFixed(1)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-[#0d153a] block leading-none">{getBandTitle(calculatedBand)}</span>
              <span className="text-[10px] text-slate-400 font-semibold">Dựa trên bài kiểm tra 4 kỹ năng</span>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#0d153a] text-xs uppercase tracking-wider border-b border-slate-50 pb-2.5 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-[#3B5C37]" /> Phân Tích Kỹ Năng từ Trợ Lý AI
            </h3>
            <div className="space-y-3.5">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-[#0d153a]">Điểm mạnh nhận diện:</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {calculatedBand >= 5.5
                      ? "Khả năng phân tích cấu trúc phức và từ vựng học thuật ở mức ổn. Nhận biết và loại trừ các bẫy thông tin gây nhiễu tốt."
                      : "Có khả năng nhận diện các từ vựng căn bản và thông tin trực tiếp từ bài nghe/đọc ngắn."}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-[#0d153a]">Điểm yếu cần cải thiện:</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {calculatedBand >= 6.5
                      ? "Cần tinh chỉnh cấu trúc đảo ngữ nâng cao trong Writing và từ vựng C2 ở các chủ đề trừu tượng."
                      : "Kỹ năng chắt lọc từ khóa trong Reading còn yếu. Cần mở rộng ý và phát triển lập luận trong Writing."}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-[#0d153a]">Đề xuất giáo trình từ AI:</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Tập trung học {calculatedBand >= 5.5 ? "Collocations học thuật nâng cao + Luyện Matching Info & Writing Task 2 nâng cao" : "Bảng phiên âm IPA + Từ vựng theo 10 chủ đề IELTS cơ bản + Cấu trúc câu cơ bản"}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap configuration form */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-extrabold text-[#0d153a] text-xs uppercase tracking-wider border-b border-slate-50 pb-2.5">
            Cấu Hình Lộ Trình Học Cá Nhân Hóa AI Đề Xuất
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0d153a] uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-slate-400" /> Band Mục Tiêu
              </label>
              <select
                value={targetBand}
                onChange={e => setTargetBand(parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs font-medium text-[#0d153a] focus:border-[#3B5C37] focus:ring-1 focus:ring-[#3B5C37] outline-none bg-white"
              >
                {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(b => (
                  <option key={b} value={b}>Band {b.toFixed(1)}{b === 6.5 ? " (Khuyên dùng)" : ""}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0d153a] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Thời gian học / ngày
              </label>
              <select
                value={dailyHours}
                onChange={e => setDailyHours(parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs font-medium text-[#0d153a] focus:border-[#3B5C37] focus:ring-1 focus:ring-[#3B5C37] outline-none bg-white"
              >
                {[1.0, 1.5, 2.0, 3.0, 4.0].map(h => (
                  <option key={h} value={h}>{h.toFixed(1)} giờ / ngày{h === 2.0 ? " (Khuyên dùng)" : ""}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0d153a] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ngày Thi Dự Kiến
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs font-medium text-[#0d153a] focus:border-[#3B5C37] focus:ring-1 focus:ring-[#3B5C37] outline-none bg-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#0d153a] uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-slate-400" /> Kỹ Năng Cần Tập Trung Luyện Tập
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Listening", "Reading", "Writing", "Speaking"].map(skill => {
                const isChecked = focusSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillsChange(skill)}
                    className={`py-2.5 px-4 rounded-lg border text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 select-none cursor-pointer ${
                      isChecked ? "border-[#3B5C37] bg-[#3B5C37]/5 text-[#3B5C37]" : "border-slate-100 bg-white hover:border-slate-200 text-slate-500"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 text-[#3B5C37]" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-[#0d153a]">
                Tổng quỹ thời gian dự kiến: {Math.round(durationWeeks * 7 * dailyHours)} giờ thực hành
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Lộ trình AI sẽ chia làm 3 giai đoạn ôn luyện chi tiết dựa trên thông số trên.
              </p>
            </div>
            <button
              onClick={handleGenerateRoadmap}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#3B5C37] to-[#B38F4D] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang Tạo Lộ Trình AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Xem Lộ Trình Học AI Đề Xuất</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f4f5f9] min-h-screen py-6 px-4 md:px-6">
      <div
        className={`mx-auto space-y-6 ${
          step === 0 ? "max-w-[1280px]" : step === 2 ? "max-w-[1240px]" : "max-w-4xl"
        }`}
      >
        {/* Top navigation bar (only during quiz steps) */}
        {step > 0 && step < 5 && (
          <div className="flex flex-wrap justify-between items-center gap-4 bg-white py-4 px-5 md:px-6 rounded-xl border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => {
                if (confirm("Bạn có chắc muốn thoát? Kết quả bài test hiện tại sẽ không được lưu.")) {
                  router.push(`/${locale}/roadmap`);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-black px-4 py-2 text-xs font-black text-[#1b3d1e] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all cursor-pointer select-none"
            >
              <Undo2 className="w-4 h-4" /> Thoát test
            </button>

            {/* Step progress */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {[
                { n: 1, label: "Listening", icon: Volume2, activeClass: "bg-[#2563eb]" },
                { n: 2, label: "Reading", icon: BookOpen, activeClass: "bg-[#16a34a]" },
                { n: 3, label: "Writing", icon: PenTool, activeClass: "bg-[#ea580c]" },
                { n: 4, label: "Speaking", icon: Mic, activeClass: "bg-[#db2777]" },
              ].map(({ n, label, icon: Icon, activeClass }, idx) => {
                const isDone = step > n;
                const isActive = step === n;
                return (
                  <React.Fragment key={n}>
                    <div
                      className={`flex items-center gap-1.5 rounded-full border-2 px-2.5 sm:px-3.5 py-1.5 text-[11px] font-black transition-all ${
                        isActive
                          ? `${activeClass} text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`
                          : isDone
                            ? "bg-[#f2f6ee] text-[#3B5C37] border-[#3B5C37]/40"
                            : "bg-white text-slate-400 border-slate-200"
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      <span className="hidden md:inline">{label}</span>
                      <span className="md:hidden">{n}</span>
                    </div>
                    {idx < 3 && (
                      <div className={`w-3 sm:w-5 h-1 rounded-full ${isDone ? "bg-[#3B5C37]/40" : "bg-slate-200"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {step === 0 && renderIntro()}
        {step === 1 && renderListening()}
        {step === 2 && renderReading()}
        {step === 3 && renderWriting()}
        {step === 4 && renderSpeaking()}
        {step === 5 && renderScanner()}
        {step === 6 && renderResults()}
      </div>
    </div>
  );
}
