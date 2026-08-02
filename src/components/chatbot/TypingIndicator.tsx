import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 px-4 py-3 bg-white text-gray-500 rounded-2xl rounded-tl-none max-w-[80px] border border-[#1b3d1e]/10 shadow-sm">
      <div className="w-2 h-2 bg-[#3B5C37]/60 rounded-full motion-safe:animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-[#3B5C37]/60 rounded-full motion-safe:animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-[#3B5C37]/60 rounded-full motion-safe:animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
