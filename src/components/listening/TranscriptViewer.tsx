"use client";

import React, { useMemo } from "react";
import { FileText, Volume2 } from "lucide-react";
import { useListeningTest } from "@/context/ListeningTestContext";

export default function TranscriptViewer() {
  const {
    currentSection,
    mockCurrentTime,
    mockDuration,
  } = useListeningTest();

  if (!currentSection) return null;

  const questionsCount = currentSection.questions.length;

  const chunks = useMemo(() => {
    const rawText = currentSection.audioDescription || "";
    const split = rawText.split(/\n\n+/).filter(Boolean);
    if (split.length === 0) return [rawText];
    return split;
  }, [currentSection.audioDescription]);

  // Determine active chunk index based on the currentTime fraction
  const activeChunkIndex = useMemo(() => {
    if (mockDuration === 0 || chunks.length === 0) return 0;
    const progressFraction = mockCurrentTime / mockDuration;
    const index = Math.floor(progressFraction * chunks.length);
    return Math.min(index, chunks.length - 1);
  }, [mockCurrentTime, mockDuration, chunks.length]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
        <div>
          <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#3B5C37]" />
            📄 Audio Context — Section {currentSection.sectionNumber}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">
            Đọc đoạn mô tả dưới đây để tìm từ khoá/đáp án
          </p>
        </div>
        <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {chunks.map((chunk, idx) => {
          const isActive = idx === activeChunkIndex;
          return (
            <div
              key={idx}
              className={`pl-4 border-l-3 py-2.5 px-3 rounded-r-xl transition-all duration-300 ${
                isActive
                  ? "border-[#3B5C37] bg-emerald-50/60 text-[#1b3d1e] font-bold shadow-sm"
                  : "border-slate-200 bg-white text-slate-500 hover:text-slate-700"
              }`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-line">
                {chunk}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
