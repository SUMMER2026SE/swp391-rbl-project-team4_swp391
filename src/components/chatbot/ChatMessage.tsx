import React from "react";
import Image from "next/image";
import { User, Sparkles, BookOpen, FileText, Headphones, Mic, PenTool, BrainCircuit, Library, LayoutList, Target, Compass, CreditCard, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/navigation";
import { CTA } from "./ChatPanel";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  ctas?: CTA[];
  onClosePanel?: () => void;
}

// Map string icon names to Lucide components
const IconMap: Record<string, React.ElementType> = {
  BookOpen,
  FileText,
  Headphones,
  Mic,
  PenTool,
  BrainCircuit,
  Library,
  LayoutList,
  Target,
  Compass,
  CreditCard,
  Sparkles,
};

export default function ChatMessage({ role, content, ctas = [], onClosePanel }: ChatMessageProps) {
  const isUser = role === "user";

  const renderCTA = (cta: CTA, index: number) => {
    const IconComponent = IconMap[cta.icon] || Sparkles;
    const isPrimary = index === 0;

    return (
      <Link
        key={index}
        href={cta.href}
        onClick={() => {
          if (window.innerWidth < 640 && onClosePanel) {
            onClosePanel();
          }
        }}
        aria-label={`Đi tới ${cta.label}: ${cta.description}`}
        className={`group relative flex items-center p-3 rounded-2xl border-2 border-[#1b3d1e] mb-3 transition-transform hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer no-underline block
          ${
            isPrimary
              ? "bg-[#FCAF3C] text-[#1c1c1c] shadow-[3px_3px_0px_0px_rgba(27,61,30,1)] hover:shadow-[1px_1px_0px_0px_rgba(27,61,30,1)]"
              : "bg-white text-[#0f1738] shadow-[3px_3px_0px_0px_rgba(27,61,30,1)] hover:shadow-[1px_1px_0px_0px_rgba(27,61,30,1)]"
          }`}
      >
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-3 shrink-0 ${isPrimary ? 'bg-white/30' : 'bg-[#e5ebd8] text-[#3B5C37]'}`}>
          <IconComponent size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-2">
            <h4 className="font-black text-sm m-0 truncate">
              {cta.label}
            </h4>
            {cta.badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-current opacity-80 whitespace-nowrap">
                {cta.badge}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 m-0 line-clamp-2 font-medium ${isPrimary ? 'text-[#1c1c1c]/80' : 'text-slate-500'}`}>
            {cta.description}
          </p>
        </div>
        <ArrowRight size={18} className={`shrink-0 transition-transform group-hover:translate-x-1 ${isPrimary ? 'text-[#1b3d1e]' : 'text-slate-400'}`} />
      </Link>
    );
  };

  return (
    <div className={`flex w-full items-start space-x-3 my-4 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      {/* Avatar Icon */}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm shrink-0 border ${
          isUser
            ? "bg-[#FCAF3C] text-[#1c1c1c] border-[#1b3d1e]/10"
            : "bg-[#e5ebd8] text-[#3B5C37] border-[#d8e0cc]"
        }`}
      >
        {isUser ? (
          <User size={16} strokeWidth={3} />
        ) : (
          <div className="w-5 h-5 relative">
            <Image src="/assets/logo-final.png" alt="Bot" fill className="object-contain" />
          </div>
        )}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        
        {/* Bubble */}
        <div
          className={`px-4 py-3 shadow-sm border ${
            isUser
              ? "bg-[#3B5C37] text-white border-[#3B5C37] rounded-2xl rounded-tr-md text-left"
              : "bg-white text-[#0f1738] border-[#e8efe5] rounded-2xl rounded-tl-md text-left"
          }`}
        >
          <div className="text-sm [&_strong]:font-black">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                ol: ({...props}) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                li: ({...props}) => <li className="leading-relaxed" {...props} />,
                a: ({...props}) => (
                  <span className="font-semibold text-gray-700 italic border-b border-dashed border-gray-400" title="Link đã bị vô hiệu hoá">
                    {props.children}
                  </span>
                ),
              }}
            >
              {content || "..."}
            </ReactMarkdown>
          </div>
        </div>

        {/* CTA Cards */}
        {ctas && ctas.length > 0 && (
          <div className="mt-3 w-full flex flex-col">
            {ctas.map((cta, idx) => renderCTA(cta, idx))}
          </div>
        )}
      </div>
    </div>
  );
}
