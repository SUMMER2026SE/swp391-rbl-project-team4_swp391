"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, RotateCcw, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export interface CTA {
  label: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  ctas?: CTA[];
}

interface ChatPanelProps {
  onClose: () => void;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Xin chào! Mình là Quali Guide — trợ lý AI của Quali IELTS. Mình có thể giúp gì cho quá trình học tập của bạn? 👋",
};

const QUICK_REPLIES = [
  "Mình mất gốc, bắt đầu từ đâu?",
  "Có đề Cambridge có đáp án không?",
  "Muốn đọc báo tiếng Anh song ngữ",
  "Làm sao lên 6.5 Writing?",
];

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pathname = usePathname() || "";

  // Extract locale and clean pathname
  const localeMatch = pathname.match(/^\/(vi|en)(?=\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "vi";
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  // Load from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem("quali-chat-v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
      }
    }
    setMessages([WELCOME_MESSAGE]);
  }, []);

  // Save to session storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("quali-chat-v2", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, error]);

  // Focus trap and Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      
      if (e.key === "Tab" && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        );
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === containerRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    // Focus the container when mounted
    if (containerRef.current) {
      containerRef.current.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleNewConversation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    setIsLoading(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const currentRequestController = new AbortController();
    abortControllerRef.current = currentRequestController;

    setIsLoading(true);
    setError(null);

    const userMessageId = crypto.randomUUID();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    const assistantMessageId = crypto.randomUUID();
    const tempAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      ctas: [],
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-16).map((m) => ({ role: m.role, content: m.content })),
          pathname: cleanPath,
          locale,
        }),
        signal: currentRequestController.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Bạn hỏi hơi nhanh, chờ mình chút nhé 😅");
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Gặp sự cố khi kết nối với máy chủ AI.");
      }

      setMessages((prev) => [...prev, tempAssistantMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || ""; // Keep the last incomplete part in the buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.substring(6);
              let parsedData = null;
              
              try {
                parsedData = JSON.parse(dataStr);
              } catch (e) {
                console.error("Failed to parse SSE JSON", e, dataStr);
              }

              if (parsedData) {
                if (parsedData.type === "token") {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + parsedData.value }
                        : msg
                    )
                  );
                } else if (parsedData.type === "cta") {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, ctas: parsedData.value }
                        : msg
                    )
                  );
                } else if (parsedData.type === "error") {
                  throw new Error(parsedData.value);
                }
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Chat aborted");
        return;
      }
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn.");
      // If the assistant message was empty, we can remove it.
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.id === assistantMessageId && !lastMsg.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      // Only set loading to false if this was the last dispatched request
      if (abortControllerRef.current === currentRequestController) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      tabIndex={-1} 
      className="flex flex-col h-full bg-white rounded-2xl border-2 border-[#1b3d1e]/10 shadow-[0_16px_48px_rgba(27,61,30,0.18)] overflow-hidden focus:outline-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1b3d1e] text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-white/10 shrink-0">
            <Image src="/assets/logo-final.png" alt="Quali Guide" fill className="object-contain p-1" />
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight text-white m-0">Quali Guide</h3>
            <span className="text-[11px] text-white/80 flex items-center font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FCAF3C] mr-1.5 shadow-[0_0_4px_#FCAF3C]" />
              Trợ lý học IELTS · Đang online
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleNewConversation}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
            aria-label="Cuộc trò chuyện mới"
            title="Cuộc trò chuyện mới"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
            aria-label="Đóng panel"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-[#f4f5f9] scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} ctas={msg.ctas} onClosePanel={onClose} />
        ))}

        {/* Quick Replies - only show if there's exactly 1 message (the welcome message) */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 mt-4 ml-11">
            {QUICK_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(reply)}
                className="text-left text-xs font-semibold px-3 py-1.5 rounded-full border border-[#3B5C37] text-[#3B5C37] hover:bg-[#3B5C37] hover:text-white transition-colors cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex w-full items-start space-x-3 my-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-[#e5ebd8] text-[#3B5C37] shrink-0 border border-[#d8e0cc]">
              <div className="w-5 h-5 relative">
                <Image src="/assets/logo-final.png" alt="Bot typing" fill className="object-contain" />
              </div>
            </div>
            <TypingIndicator />
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 p-3 my-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
            <AlertCircle size={14} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Input panel */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
