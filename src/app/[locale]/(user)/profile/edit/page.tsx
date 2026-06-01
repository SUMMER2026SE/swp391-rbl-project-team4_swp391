"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, CheckCircle2, User, Phone, FileText } from "lucide-react";

function ProfileEditFormInner({ user, router }: { user: AuthUser; router: ReturnType<typeof useRouter> }) {
  const [name, setName] = useState(user.user_metadata?.name || "");
  const [phone, setPhone] = useState(user.user_metadata?.phone || "");
  const [bio, setBio] = useState(user.user_metadata?.bio || "");
  const [inAppReminders, setInAppReminders] = useState(user.user_metadata?.inAppReminders !== false);
  const [emailReminders, setEmailReminders] = useState(user.user_metadata?.emailReminders !== false);
  const [streakWarning, setStreakWarning] = useState(user.user_metadata?.streakWarning !== false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Họ và tên không được bỏ trống.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          name: name.trim(), 
          phone: phone.trim(), 
          bio: bio.trim(),
          inAppReminders,
          emailReminders,
          streakWarning
        },
      });

      if (error) throw error;

      setSuccessMsg("Cập nhật thông tin hồ sơ thành công!");
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Đã xảy ra lỗi khi cập nhật.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-black text-[#0d153a]">Chỉnh sửa hồ sơ cá nhân</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Cập nhật thông tin chi tiết tài khoản của bạn.</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-xs animate-shake">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-100 flex items-start gap-3 text-green-700 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Name */}
        <div className="group relative">
          <label className="block text-[10px] font-black text-[#5e6792] uppercase tracking-wider mb-2">Họ và Tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#97a0c3] group-focus-within:text-[#3B5C37]">
              <User className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full pl-11 pr-4 py-3 bg-[#f0f4fd] border border-[#e1e4ed]/40 rounded-2xl text-[#0f1738] font-semibold text-xs focus:bg-white focus:border-[#3B5C37] focus:ring-4 focus:ring-[#3B5C37]/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Email - Disabled */}
        <div className="relative opacity-60">
          <label className="block text-[10px] font-black text-[#5e6792] uppercase tracking-wider mb-2">Email (Không thể thay đổi)</label>
          <input
            type="email"
            disabled
            value={user.email || ""}
            className="w-full px-4 py-3 bg-slate-100 border border-[#e1e4ed]/40 rounded-2xl text-[#0f1738] font-semibold text-xs cursor-not-allowed outline-none"
          />
        </div>

        {/* Phone */}
        <div className="group relative">
          <label className="block text-[10px] font-black text-[#5e6792] uppercase tracking-wider mb-2">Số điện thoại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#97a0c3] group-focus-within:text-[#3B5C37]">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              className="w-full pl-11 pr-4 py-3 bg-[#f0f4fd] border border-[#e1e4ed]/40 rounded-2xl text-[#0f1738] font-semibold text-xs focus:bg-white focus:border-[#3B5C37] focus:ring-4 focus:ring-[#3B5C37]/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="group relative">
          <label className="block text-[10px] font-black text-[#5e6792] uppercase tracking-wider mb-2">
            Giới thiệu bản thân (Tối đa 300 ký tự)
          </label>
          <div className="relative">
            <div className="absolute top-3 left-4 text-[#97a0c3] group-focus-within:text-[#3B5C37]">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              placeholder="Chia sẻ một chút thông tin về bạn..."
              rows={4}
              className="w-full pl-11 pr-4 py-3 bg-[#f0f4fd] border border-[#e1e4ed]/40 rounded-2xl text-[#0f1738] font-semibold text-xs focus:bg-white focus:border-[#3B5C37] focus:ring-4 focus:ring-[#3B5C37]/10 transition-all outline-none resize-none"
            />
          </div>
          <div className="flex justify-end text-[10px] font-bold text-slate-400 mt-1">
            {bio.length}/300 ký tự
          </div>
        </div>

        {/* Cấu hình Nhận Thông báo */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div>
            <h3 className="text-xs font-black text-[#0d153a] uppercase tracking-wider">Cấu hình thông báo & nhắc nhở</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Lựa chọn cách bạn muốn nhận các nhắc nhở học tập và chuỗi streak.</p>
          </div>

          <div className="space-y-3">
            {/* In-app notification */}
            <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-100/80 rounded-2xl hover:border-[#3B5C37]/10 transition-colors">
              <div>
                <h4 className="font-extrabold text-xs text-[#0d153a]">Thông báo trong ứng dụng</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Nhận các nhắc nhở học tập và tin nhắn hệ thống trực tiếp khi truy cập trang web.</p>
              </div>
              <button
                type="button"
                onClick={() => setInAppReminders(!inAppReminders)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${inAppReminders ? "bg-[#3B5C37]" : "bg-slate-200"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${inAppReminders ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>

            {/* Email reminder */}
            <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-100/80 rounded-2xl hover:border-[#3B5C37]/10 transition-colors">
              <div>
                <h4 className="font-extrabold text-xs text-[#0d153a]">Nhắc nhở học tập qua Email</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Nhận email động viên học tập hàng ngày nếu hôm đó bạn chưa rèn luyện kỹ năng nào.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailReminders(!emailReminders)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${emailReminders ? "bg-[#3B5C37]" : "bg-slate-200"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${emailReminders ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>

            {/* Streak loss warning */}
            <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-100/80 rounded-2xl hover:border-[#3B5C37]/10 transition-colors">
              <div>
                <h4 className="font-extrabold text-xs text-[#0d153a]">Cảnh báo sắp mất chuỗi học tập (Streak)</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Nhận cảnh báo khẩn cấp khi chuỗi học tập của bạn sắp bị đặt lại về 0.</p>
              </div>
              <button
                type="button"
                onClick={() => setStreakWarning(!streakWarning)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${streakWarning ? "bg-[#3B5C37]" : "bg-slate-200"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${streakWarning ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 h-12 bg-[#3B5C37] hover:bg-[#ff8e26] text-white font-bold text-xs rounded-2xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer border-none outline-none"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Lưu thay đổi"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-6 h-12 bg-white border border-[#e1e4ed] text-[#5e6792] font-bold text-xs rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer outline-none"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfileEditPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading || !user) return null;

  return <ProfileEditFormInner user={user} router={router} />;
}
