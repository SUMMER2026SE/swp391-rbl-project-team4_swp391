"use client";
import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Mail, Calendar, Phone, Heart, User, Key, Camera, Flame, Trophy } from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const { user } = useAuth();
  const [streak, setStreak] = useState<{ currentStreak: number; longestStreak: number; lastStudyDate: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    async function fetchStreak() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("/api/student/streak", {
          headers: {
            "Authorization": `Bearer ${session?.access_token || ""}`
          }
        });
        if (res.ok) {
          const result = await res.json();
          setStreak(result.streak);
        }
      } catch (err) {
        console.error("Lỗi khi tải streak học tập:", err);
      }
    }
    fetchStreak();
  }, [user]);

  if (!user) return null;

  const initialsFallback = (user.user_metadata?.name || user.email || "U").charAt(0).toUpperCase();
  const dateFormatted = new Date(user.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Cover Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0d153a] to-[#B38F4D] p-8 text-white overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B5C37]/10 blur-2xl rounded-full" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          {user.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white text-[#3B5C37] flex items-center justify-center text-4xl font-black shadow-lg">
              {initialsFallback}
            </div>
          )}
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-black">{user.user_metadata?.name || t("fallback.name")}</h2>
              <span className="text-[10px] font-black tracking-wider text-white bg-[#3B5C37] px-2.5 py-1 rounded-full uppercase">
                {user.user_metadata?.role || "STUDENT"}
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1">{user.email}</p>
          </div>
          <Link
            href="/profile/edit"
            className="px-5 py-2.5 bg-[#3B5C37] hover:bg-[#ff8e26] text-white text-xs font-bold rounded-2xl shadow-lg transition-all"
          >
            {t("editProfile")}
          </Link>
        </div>
      </div>

      {/* Streak Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8e26]/5 blur-2xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 animate-pulse">
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#0d153a] text-sm">Chuỗi học tập (Streak)</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Duy trì luyện tập Speaking hàng ngày để tăng chuỗi ngày liên tiếp nhé!</p>
          </div>
        </div>
        <div className="flex items-center gap-6 z-10 bg-slate-50/50 px-6 py-3 rounded-2xl border border-slate-100">
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hiện tại</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="text-xl font-black text-[#0d153a]">{streak?.currentStreak || 0}</span>
              <span className="text-lg">🔥</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kỷ lục</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="text-xl font-black text-yellow-600">{streak?.longestStreak || 0}</span>
              <span className="text-lg">👑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        <h3 className="font-extrabold text-[#0d153a] text-lg">{t("detailedInfo")}</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#3B5C37]">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{tc("email")}</p>
              <p className="text-xs font-bold text-[#0d153a] mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#3B5C37]">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t("joinDate")}</p>
              <p className="text-xs font-bold text-[#0d153a] mt-0.5">{dateFormatted}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#3B5C37]">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t("phone")}</p>
              <p className="text-xs font-bold text-[#0d153a] mt-0.5">
                {user.user_metadata?.phone || t("fallback.phone")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#3B5C37]">
              <Heart className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t("status")}</p>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                {t("statusActive")}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">{t("bio")}</p>
          <p className="text-xs text-[#5e6792] leading-relaxed">
            {user.user_metadata?.bio || t("fallback.bio")}
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/profile/edit"
          className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-[#3B5C37]/30 hover:shadow-md transition-all group no-underline text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#fff4e6] text-[#3B5C37] flex items-center justify-center mb-3">
            <User className="w-4.5 h-4.5" />
          </div>
          <h4 className="font-extrabold text-[#0d153a] text-xs group-hover:text-[#3B5C37] transition-colors">{t("editProfile")}</h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">{t("desc.editProfile")}</p>
        </Link>

        <Link
          href="/settings/password"
          className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-[#3B5C37]/30 hover:shadow-md transition-all group no-underline text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#fff4e6] text-[#3B5C37] flex items-center justify-center mb-3">
            <Key className="w-4.5 h-4.5" />
          </div>
          <h4 className="font-extrabold text-[#0d153a] text-xs group-hover:text-[#3B5C37] transition-colors">{t("changePassword")}</h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">{t("desc.changePassword")}</p>
        </Link>

        <Link
          href="/settings/avatar"
          className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-[#3B5C37]/30 hover:shadow-md transition-all group no-underline text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#fff4e6] text-[#3B5C37] flex items-center justify-center mb-3">
            <Camera className="w-4.5 h-4.5" />
          </div>
          <h4 className="font-extrabold text-[#0d153a] text-xs group-hover:text-[#3B5C37] transition-colors">{t("uploadAvatar")}</h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">{t("desc.uploadAvatar")}</p>
        </Link>
      </div>
    </div>
  );
}
