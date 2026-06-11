"use client";

import React from "react";
import { Check } from "lucide-react";
import { useListeningTest } from "@/context/ListeningTestContext";

export default function SectionTabs() {
  const {
    sections,
    currentSectionIndex,
    goToSection,
    answers,
  } = useListeningTest();

  const getSectionState = (sec: any, idx: number) => {
    const isCurrent = idx === currentSectionIndex;
    const allAnswered = sec.questions.every(
      (q: any) => answers[q.id] !== undefined && answers[q.id].trim() !== ""
    );

    if (isCurrent) return "current";
    if (allAnswered && sec.questions.length > 0) return "completed";
    return "pending";
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
      {sections.map((sec, idx) => {
        const state = getSectionState(sec, idx);
        
        let tabClass = "";
        if (state === "current") {
          tabClass = "bg-blue-600 text-white shadow-sm";
        } else if (state === "completed") {
          tabClass = "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200";
        } else {
          tabClass = "bg-white hover:bg-slate-50 text-slate-500 border border-slate-200/60";
        }

        return (
          <button
            key={sec.sectionNumber}
            type="button"
            onClick={() => goToSection(idx)}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none border-none outline-none ${tabClass}`}
          >
            {state === "completed" && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            <span>Section {sec.sectionNumber}</span>
          </button>
        );
      })}
    </div>
  );
}
