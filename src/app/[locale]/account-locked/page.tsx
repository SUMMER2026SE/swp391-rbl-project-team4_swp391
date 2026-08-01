"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { UserX, Lock, LogOut, Mail, ArrowLeft, ShieldAlert } from "lucide-react";

export default function AccountLockedPage() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [userEmail, setUserEmail] = useState<string>("N/A");

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        } else {
          const mockSessionStr = localStorage.getItem("mock_session");
          if (mockSessionStr) {
            const mock = JSON.parse(mockSessionStr);
            if (mock?.email) setUserEmail(mock.email);
          }
        }
      } catch {
        // ignore
      }
    }
    loadUser();
  }, []);

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_session");
      document.cookie = "sb-custom-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDF8F6] p-4 md:p-6 relative overflow-hidden font-sans">
      {/* Background glowing soft shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-200/50 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-lg bg-white rounded-[32px] border border-rose-100 shadow-[0_20px_50px_rgba(225,29,72,0.08)] p-8 md:p-10 text-center relative z-10 space-y-6 animate-fade-in">
        {/* Lock Icon */}
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border-4 border-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <UserX className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-700 mb-3 border border-rose-200">
            <Lock className="w-3.5 h-3.5" />
            {isEn ? "ACCOUNT LOCKED" : "TÀI KHOẢN ĐÃ BỊ KHÓA"}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-[#0f1738] tracking-tight">
            {isEn ? "Access Suspended" : "Quyền truy cập bị ngưng"}
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 mt-2 leading-relaxed">
            {isEn
              ? `Your account (${userEmail}) has been locked by an Administrator. Access to system features is currently restricted.`
              : `Tài khoản của bạn (${userEmail}) đã bị khóa bởi Quản trị viên hệ thống. Bạn tạm thời không thể truy cập các tính năng.`}
          </p>
        </div>

        {/* Account Details Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs font-medium text-slate-600">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-400 font-bold">{isEn ? "Account Email:" : "Email tài khoản:"}</span>
            <span className="font-extrabold text-slate-800">{userEmail}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-400 font-bold">{isEn ? "Status:" : "Trạng thái:"}</span>
            <span className="font-extrabold text-rose-600 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {isEn ? "Locked (Inactive)" : "Bị khóa (Tạm ngưng)"}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-bold">{isEn ? "Reason:" : "Lý do:"}</span>
            <span className="font-extrabold text-slate-700">
              {isEn ? "Suspended by Administrator" : "Khóa bởi Quản trị viên hệ thống"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSignOut}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
          >
            <LogOut className="w-4 h-4" />
            <span>{isEn ? "Sign Out" : "Đăng xuất"}</span>
          </button>
          <a
            href="mailto:admin@qualicode.com?subject=Y%C3%AAu%20c%E1%BA%A7u%20m%E1%BB%9F%20kh%C3%B3a%20t%C3%A0i%20kho%E1%BA%A3n"
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer no-underline"
          >
            <Mail className="w-4 h-4" />
            <span>{isEn ? "Contact Admin" : "Liên hệ Quản trị viên"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
