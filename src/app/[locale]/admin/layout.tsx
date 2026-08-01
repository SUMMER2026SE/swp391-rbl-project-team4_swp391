"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import {
  Users,
  LayoutDashboard,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Clock,
  FileText,
  CreditCard,
  Lock,
  UserX,
  Mail,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role?: string } | null>({
    name: "Quản trị viên",
    email: "admin@qualicode.com",
    role: "ADMIN"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockedEmail, setLockedEmail] = useState("");

  // Check admin session and implement route protection - Bypassed per user request
  useEffect(() => {
    // Attempt to load current user name if logged in, but don't block or redirect if not
    async function loadUserInfo() {
      try {
        // Check mock session first
        let hasMock = false;
        let mockUser = null;
        if (typeof window !== "undefined") {
          const mockSessionStr = localStorage.getItem("mock_session");
          if (mockSessionStr) {
            try {
              mockUser = JSON.parse(mockSessionStr);
              if (mockUser) {
                hasMock = true;
              }
            } catch (e) {}
          }
        }

        if (hasMock && mockUser) {
          const mockRole = mockUser.role || "GUEST";
          if (mockRole !== "ADMIN" && mockRole !== "INSTRUCTOR") {
            window.location.href = "/";
            return;
          }
          const ADMIN_ONLY = ["/admin/users", "/admin/payments", "/admin/settings", "/admin/leads"];
          const pathNoLocale = pathname.replace(/^\/(en|vi)/, "");
          if (mockRole === "INSTRUCTOR" && ADMIN_ONLY.some((p) => pathNoLocale === p || pathNoLocale.startsWith(p + "/"))) {
            window.location.href = "/admin";
            return;
          }
          setAdminUser({
            name: mockUser.name || "Quản trị viên (Bypass)",
            email: mockUser.email || "admin@qualicode.com",
            role: mockRole
          });
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        // Not logged in -> bounce to login.
        if (!user) {
          window.location.href = "/login?error=insufficient_permissions";
          return;
        }

        const metadata = user.user_metadata || {};
        const isMetadataLocked = metadata.isLocked === true || !!user.banned_until;

        let isDbLocked = false;
        try {
          const { data: profile } = await supabase.from("profiles").select("role, isLocked").eq("id", user.id).single();
          if (profile?.isLocked) isDbLocked = true;
        } catch (e) {}

        if (isMetadataLocked || isDbLocked) {
          setIsAccountLocked(true);
          setLockedEmail(user.email || "N/A");
          return;
        }

        // Fetch from profiles as single source of truth.
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        const finalRole = profile?.role || metadata.role || "STUDENT";

        // Role enforcement: only ADMIN and INSTRUCTOR may enter the admin panel.
        if (finalRole !== "ADMIN" && finalRole !== "INSTRUCTOR") {
          window.location.href = "/";
          return;
        }

        // INSTRUCTOR is restricted from ADMIN-only sub-areas.
        const ADMIN_ONLY = ["/admin/users", "/admin/payments", "/admin/settings", "/admin/leads"];
        const pathNoLocale = pathname.replace(/^\/(en|vi)/, "");
        if (finalRole === "INSTRUCTOR" && ADMIN_ONLY.some((p) => pathNoLocale === p || pathNoLocale.startsWith(p + "/"))) {
          window.location.href = "/admin";
          return;
        }

        setAdminUser({
          name: metadata.name || "Quản trị viên",
          email: user.email || "admin@qualicode.com",
          role: finalRole
        });
      } catch (err) {
        console.warn("Could not fetch logged-in user metadata, using defaults:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserInfo();
  }, [pathname]);

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_session");
      document.cookie = "sb-custom-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Không thể gọi signOut trên Supabase:", e);
    }
    window.location.href = "/login";
  };

  if (isAccountLocked) {
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
              TÀI KHOẢN ĐÃ BỊ KHÓA
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-[#0f1738] tracking-tight">
              Quyền truy cập bị ngưng
            </h1>
            <p className="text-xs md:text-sm font-semibold text-slate-500 mt-2 leading-relaxed">
              Tài khoản của bạn (<strong className="text-slate-800">{lockedEmail}</strong>) đã bị khóa bởi Quản trị viên hệ thống. Bạn tạm thời không thể truy cập các tính năng trang Quản trị.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs font-medium text-slate-600">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-400 font-bold">Email tài khoản:</span>
              <span className="font-extrabold text-slate-800">{lockedEmail}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-400 font-bold">Trạng thái:</span>
              <span className="font-extrabold text-rose-600 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Bị khóa (Tạm ngưng)
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 font-bold">Lý do:</span>
              <span className="font-extrabold text-slate-700">Khóa bởi Quản trị viên hệ thống</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSignOut}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
            <a
              href="mailto:admin@qualicode.com?subject=Y%C3%AAu%20c%E1%BA%A7u%20m%E1%BB%9F%20kh%C3%B3a%20t%C3%A0i%20kho%E1%BA%A3n"
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <Mail className="w-4 h-4" />
              <span>Liên hệ Quản trị viên</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Định nghĩa danh sách menu điều hướng
  const menuItems = [
    {
      label: t("sidebar.overview"),
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: t("sidebar.users"),
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      label: t("sidebar.exams"),
      href: "/admin/exams",
      icon: FileText,
      active: pathname.startsWith("/admin/exams"),
    },
    {
      label: t("sidebar.payments"),
      href: "/admin/payments",
      icon: CreditCard,
      active: pathname.startsWith("/admin/payments"),
    },
    {
      label: t("sidebar.activityLogs"),
      href: "/admin/activity-logs",
      icon: Clock,
      active: pathname.startsWith("/admin/activity-logs"),
    },
    {
      label: t("sidebar.settings"),
      href: "/admin/settings",
      icon: Settings,
      active: pathname === "/admin/settings",
    },
  ].filter(item => {
    if (adminUser?.role === "INSTRUCTOR") {
      return ["Tổng quan", "Quản lý Đề Thi"].includes(item.label);
    }
    return true; // ADMIN sees all
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f5f9] text-[#0f1738]">
        <div className="w-10 h-10 border-4 border-[#3B5C37]/30 border-t-[#3B5C37] rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-[#5e6792] animate-pulse">{t("sidebar.authenticating")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f9] text-[#0f1738] flex flex-col font-sans">
      {/* Top Header Mobile */}
      <header className="md:hidden flex items-center justify-between bg-[#0d153a] text-white px-5 py-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span>{t("sidebar.brand")}</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d153a] text-white flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand Logo Header (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 px-6 py-6 border-b border-white/5">
            <span className="text-[#3B5C37] font-serif text-3xl leading-none">*</span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              {t("sidebar.brand")}
            </span>
          </div>

          {/* Quick Profile Admin */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3 bg-[#0a102e]/60">
            <div className="w-10 h-10 rounded-xl bg-[#3B5C37]/10 border border-[#3B5C37]/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#3B5C37]" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-sm truncate text-white">{adminUser?.name}</div>
              <div className="text-xs text-[#a0a5c0] truncate">{adminUser?.role === "INSTRUCTOR" ? "Giảng viên" : "Quản trị viên"}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 min-h-0 px-4 py-6 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    item.active
                      ? "bg-[#3B5C37] text-white shadow-[0_6px_16px_rgba(59,92,55,0.25)] font-bold scale-[1.02]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 bg-[#0a102e]/40 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-colors w-full"
            >
              <span>{t("sidebar.viewHome")}</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors w-full cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>{t("sidebar.logout")}</span>
            </button>
          </div>
        </aside>

        {/* Sidebar Overlay Mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Top Navbar Header (Desktop only) */}
          <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200/80 px-8 py-4 sticky top-0 z-30">
            {/* Page title or Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">{t("header.title")}</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-sm font-extrabold text-[#0d153a]">
                {pathname === "/admin"
                  ? t("header.breadcrumbs.overview")
                  : pathname.startsWith("/admin/users")
                  ? t("header.breadcrumbs.users")
                  : pathname.startsWith("/admin/exams")
                  ? t("header.breadcrumbs.exams")
                  : pathname.startsWith("/admin/payments")
                  ? t("header.breadcrumbs.payments")
                  : pathname.startsWith("/admin/activity-logs")
                  ? t("header.breadcrumbs.activityLogs")
                  : t("header.breadcrumbs.settings")}
              </span>
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center gap-5">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Notification Button */}
              <button className="relative p-2 text-slate-500 hover:text-[#0d153a] hover:bg-slate-100 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>

              {/* Separator line */}
              <div className="h-6 w-px bg-slate-200" />

              {/* Profile Card */}
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3B5C37] to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_10px_rgba(59,92,55,0.15)] uppercase">
                  {adminUser?.name?.substring(0, 2)}
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#0d153a] group-hover:text-[#3B5C37] transition-colors leading-tight">
                    {adminUser?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">
                    {t("header.mainSystem")}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Render children contents with professional padding */}
          <div className="flex-1 p-5 md:p-8 max-w-[1440px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
