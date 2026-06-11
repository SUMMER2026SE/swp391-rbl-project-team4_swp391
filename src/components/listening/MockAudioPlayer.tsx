"use client";

import React from "react";
import { Play, Pause, Disc, AlertTriangle } from "lucide-react";
import { useListeningTest } from "@/context/ListeningTestContext";

export default function MockAudioPlayer() {
  const {
    isPlaying,
    mockProgress,
    mockDuration,
    mockCurrentTime,
    togglePlay,
    seekTo,
  } = useListeningTest();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(parseFloat(e.target.value));
  };

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 to-orange-50/50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> TRANSCRIPT MODE
          </span>
        </div>
        <span className="text-[9px] font-bold text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-md">
          Mock Audio Player
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md hover:scale-105 active:scale-95 transition-all select-none cursor-pointer border-none outline-none ${
            isPlaying
              ? "bg-slate-800 hover:bg-slate-900 shadow-slate-900/10"
              : "bg-[#3B5C37] hover:bg-[#2c4728] shadow-[#3B5C37]/15"
          }`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Progress Slider */}
        <div className="flex-1 w-full flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={mockProgress}
            onChange={handleSliderChange}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-[#3B5C37] outline-none"
            aria-label="Progress bar"
          />
          <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 mt-1 px-0.5">
            <span className="flex items-center gap-1">
              <Disc className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} />
              {formatTime(mockCurrentTime)}
            </span>
            <span>{formatTime(mockDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
