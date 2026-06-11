"use client";

import React from "react";
import { useListeningTest } from "@/context/ListeningTestContext";
import type { NormalizedListeningQuestion } from "@/utils/questionHelpers";

interface ListeningQuestionProps {
  question: NormalizedListeningQuestion;
}

export default function ListeningQuestion({ question }: ListeningQuestionProps) {
  const { answers, setAnswer } = useListeningTest();

  const selected = answers[question.id] ?? "";

  const renderFillInput = () => {
    const text = question.text;
    const parts = text.split(/_{2,}/g);

    if (parts.length > 1) {
      return (
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-slate-800 leading-relaxed">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span dangerouslySetInnerHTML={{ __html: part }} />
              {index < parts.length - 1 && (
                <input
                  type="text"
                  value={selected}
                  onChange={(e) => setAnswer(question.id, e.target.value)}
                  placeholder="Type your answer..."
                  className="mx-1 border-b-2 border-slate-300 focus:border-blue-600 outline-none px-2 py-0.5 text-xs text-blue-700 font-bold w-36 bg-slate-50 rounded"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
        <input
          type="text"
          value={selected}
          onChange={(e) => setAnswer(question.id, e.target.value)}
          placeholder="Type your answer here..."
          className="w-full max-w-md border-b-2 border-slate-300 focus:border-blue-600 outline-none px-3 py-1.5 text-sm text-blue-700 font-bold bg-slate-50/50 rounded-lg"
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black select-none ${
            selected.trim() !== ""
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {question.globalOrder}
        </span>
        
        <div className="flex-1 min-w-0">
          {question.type === "fill" ? (
            renderFillInput()
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-800 leading-relaxed mb-3">
                {question.text}
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {question.options.map((opt) => {
                  const isSelected = selected === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setAnswer(question.id, opt.key)}
                      className={`text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-start gap-2 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/30 text-blue-700 shadow-sm"
                          : "border-slate-100 bg-white hover:border-slate-200 text-slate-500"
                      }`}
                    >
                      <span className="text-blue-700 shrink-0">{opt.key}.</span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
