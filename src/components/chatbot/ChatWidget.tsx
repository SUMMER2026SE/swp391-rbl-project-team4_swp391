"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import ChatPanel from "./ChatPanel";
import { ResultSunMascot } from "../sunMascot";

// Các trang đang làm bài thi -> Ẩn hẳn chatbot để user tập trung
const HIDDEN_ON: (RegExp | string)[] = [
  /^\/reading\/cam\/[^/]+$/, // Đang làm đề Reading Cam (không tính trang review/result)
  /^\/reading\/test$/,       // Đang làm test Reading
  /^\/reading\/(?!result|song-ngu|bilingual|cam|test)[^/]+$/, // Làm đề Reading thường
  
  /^\/listening\/cam-test\/[^/]+$/, // Đang làm đề Listening Cam
  /^\/listening\/(?!result|cam-test|dictation)[^/]+$/, // Làm đề Listening thường
  
  /^\/writing\/tests\/[^/]+$/, // Đang làm bài Writing Cam
  /^\/writing\/test$/,         // Làm bài Writing Test
  /^\/writing\/(?!result|dich-cau|translation|tests|test)[^/]+$/, // Làm bài Writing thường
  
  /^\/speaking\/test$/,        // Đang thi Speaking
];

// Các trang có thanh bottom bar cố định hoặc audio player nổi -> Nâng chatbot lên bottom-20
const RAISED_ON: (RegExp | string)[] = [
  /^\/admin/,                           // Dashboard admin có UI riêng
  /^\/listening\/dictation\/[^/]+$/,    // Trang chép chính tả có audio player ở dưới
  /^\/speaking\/shadowing\/[^/]+$/,     // Trang shadowing có control player
  /^\/practice/,                        // Các trang luyện tập có control
  /^\/reading\/bilingual\/[^/]+$/,      // Trang bài đọc báo song ngữ có control panel/bottom bar
  /^\/reading\/cam\/[^/]+\/review$/,    // Trang review đề Cam Reading có thanh pagination dưới cùng
  /^\/reading\/cam\/[^/]+\/result$/,    // Trang result đề Cam Reading
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const badgeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname() || "";
  
  const shouldReduceMotion = useReducedMotion();

  // Normalize pathname by removing locale prefix
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  useEffect(() => {
    // Check if we need to show the greeting badge
    const hasSeenBadge = localStorage.getItem("quali-chat-badge-seen");
    if (!hasSeenBadge) {
      badgeTimerRef.current = setTimeout(() => {
        setShowBadge(true);
      }, 8000);
    }
    
    return () => {
      if (badgeTimerRef.current) {
        clearTimeout(badgeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Lock body scroll when panel is open on mobile
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Return focus to previous element when closing
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
    
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleCloseBadge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBadge(false);
    localStorage.setItem("quali-chat-badge-seen", "true");
  };

  const handleOpenChat = () => {
    if (!isOpen) {
      // Store current focus before opening
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    
    setIsOpen(!isOpen);
    
    if (showBadge || !localStorage.getItem("quali-chat-badge-seen")) {
      setShowBadge(false);
      localStorage.setItem("quali-chat-badge-seen", "true");
      if (badgeTimerRef.current) {
        clearTimeout(badgeTimerRef.current);
      }
    }
  };

  const isHidden = HIDDEN_ON.some((pattern) => 
    typeof pattern === "string" ? cleanPath === pattern : pattern.test(cleanPath)
  );

  if (isHidden) {
    return null;
  }

  const hasBottomBar = RAISED_ON.some((pattern) => 
    typeof pattern === "string" ? cleanPath.startsWith(pattern) : pattern.test(cleanPath)
  );

  const positionClass = hasBottomBar
    ? "fixed bottom-20 right-6 z-50 flex flex-col items-end"
    : "fixed bottom-6 right-6 z-50 flex flex-col items-end";
    
  const motionDuration = shouldReduceMotion ? 0 : 0.2;

  return (
    <div className={positionClass}>
      {/* Chat Panel Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.95 }}
            transition={{ duration: motionDuration, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 w-full h-[85dvh] rounded-t-3xl rounded-b-none shadow-2xl z-50 sm:relative sm:inset-auto sm:bottom-auto sm:w-[380px] sm:h-[560px] sm:max-h-[80vh] sm:rounded-2xl sm:mb-4 bg-white"
          >
            <ChatPanel onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Hidden on mobile when open) */}
      <div className={`relative ${isOpen ? 'hidden sm:block' : 'block'}`}>
        <AnimatePresence>
          {showBadge && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              transition={{ duration: motionDuration }}
              className="absolute right-[110%] top-1/2 -translate-y-1/2 mr-3 bg-[#FFFADD] border-2 border-[#1b3d1e] rounded-2xl p-3 pr-8 shadow-md w-max z-50"
            >
              <p className="text-sm font-bold text-[#1b3d1e] m-0 pr-2">
                Cần tư vấn lộ trình IELTS? Hỏi mình nhé 👋
              </p>
              <button 
                onClick={handleCloseBadge}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1b3d1e]/60 hover:text-[#1b3d1e] cursor-pointer"
                aria-label="Đóng gợi ý"
              >
                <X size={16} />
              </button>
              {/* Tooltip triangle */}
              <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-3 h-3 bg-[#FFFADD] border-t-2 border-r-2 border-[#1b3d1e] rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleOpenChat}
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
          aria-label="Mở trợ lý Quali IELTS"
          aria-expanded={isOpen}
          className="flex items-center justify-center w-14 h-14 rounded-full text-white transition-colors cursor-pointer bg-[#3B5C37] hover:bg-[#1f3e1b] shadow-[0_6px_20px_rgba(59,92,55,0.35)] ring-2 ring-[#FCAF3C]/60"
        >
          <motion.div
            animate={{ rotate: (isOpen && !shouldReduceMotion) ? 90 : 0 }}
            transition={{ duration: motionDuration }}
            className="flex items-center justify-center pt-1"
          >
            <ResultSunMascot size={32} disableHover={true} />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
