"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Headphones, Disc, ChevronRight, Award, History, Info, Play } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ListeningTestProvider, useListeningTest } from "@/context/ListeningTestContext";

import Navbar from "@/components/Navbar";

function ListeningTestListContent() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  const {
    testList,
    loadTestList,
    isLoading
  } = useListeningTest();

  const [historyScores, setHistoryScores] = useState<Record<string, { score: number; date: string }>>({});
  const [sessionUser, setSessionUser] = useState<any>(null);

  // Fetch test list
  useEffect(() => {
    loadTestList();
  }, []);

  // Fetch previous test results
  useEffect(() => {
    async function fetchHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setSessionUser(session.user);

      const { data, error } = await supabase
        .from("user_submissions")
        .select("exam_id, score, completed_at")
        .eq("user_id", session.user.id)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error loading history results:", error);
        return;
      }

      const scoreMap: Record<string, { score: number; date: string }> = {};
      data.forEach((row: any) => {
        if (!scoreMap[row.exam_id]) {
          scoreMap[row.exam_id] = {
            score: row.score,
            date: new Date(row.completed_at).toLocaleDateString("vi-VN")
          };
        }
      });
      setHistoryScores(scoreMap);
    }
    fetchHistory();
  }, [testList]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#3B5C37] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Đang tải danh sách đề thi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f9] text-[#0f1738] font-sans pb-16">
      <Navbar />

      {/* Hero section */}
      <main className="mx-auto max-w-[1160px] px-6 pt-28">
        <section className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-[#1c3519] via-[#2d5027] to-[#3B5C37] text-white p-8 md:p-12 shadow-[0_16px_40px_rgba(59,92,55,0.15)] border border-white/5">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#568140]/20 blur-3xl" />

          <div className="relative z-10 max-w-[700px]">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-green-200 text-xs font-bold uppercase tracking-wider mb-5 border border-white/15">
              <Headphones className="w-3.5 h-3.5" />
              IELTS Listening Section
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 text-white">
              Phòng Thi Listening{" "}
              <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
                Phát Audio Thực Tế
              </span>
            </h1>

            <p className="text-sm md:text-base text-green-100/80 leading-relaxed mb-8 max-w-[560px]">
              Luyện kỹ năng Nghe hiểu với audio thực tế từ đề thi Cambridge IELTS, giúp bạn làm quen trực tiếp với môi trường thi thật.
            </p>
          </div>
        </section>

        {/* Section Title grid */}
        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Disc className="w-5 h-5 text-[#3B5C37]" /> Đề thi Cambridge IELTS hiện có
        </h2>

        {/* Tests Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testList.map((test) => {
            const history = historyScores[test.id];
            const sectionsCount = test.sections ? test.sections.length : 0;
            const totalQs = test.sections
              ? test.sections.reduce((sum: number, s: any) => sum + (s.questions?.length || 0), 0)
              : 0;

            return (
              <div
                key={test.id}
                className="group relative bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3B5C37] bg-[#3B5C37]/10 px-3 py-1.5 rounded-xl">
                      Cambridge {test.volume}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <Headphones className="w-3 h-3 text-emerald-600" /> AUDIO MODE
                    </span>
                  </div>

                  {/* Test title */}
                  <h3 className="text-sm font-black text-slate-800 tracking-tight leading-snug mb-3 group-hover:text-[#3B5C37] transition-colors">
                    {test.test_name}
                  </h3>

                  {/* Section count stats */}
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-300" /> {sectionsCount} Sections
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-300" /> {totalQs} câu hỏi
                    </span>
                  </div>

                  {/* Last attempt score if exists */}
                  {history && (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex items-center justify-between text-xs mb-5">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <History className="w-3.5 h-3.5 text-slate-400" /> Điểm gần nhất:
                      </span>
                      <strong className="text-emerald-700 font-extrabold">Band {history.score.toFixed(1)} ({history.date})</strong>
                    </div>
                  )}
                </div>

                {/* CTA buttons */}
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/listening/${test.id}`)}
                  className="w-full py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-[#3B5C37] transition-all flex items-center justify-center gap-1 cursor-pointer border-none outline-none shadow shadow-slate-950/10 group-hover:scale-[1.02]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{history ? "Thi lại" : "Bắt đầu làm bài"}</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function ListeningPage() {
  return (
    <ListeningTestProvider>
      <ListeningTestListContent />
    </ListeningTestProvider>
  );
}
