"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { ListeningTestProvider, useListeningTest } from "@/context/ListeningTestContext";
import ListeningLayout from "@/components/listening/ListeningLayout";

function ListeningTestPageContent() {
  const { testId } = useParams();
  const { selectTest, isLoading, error } = useListeningTest();

  useEffect(() => {
    if (testId) {
      selectTest(testId as string);
    }
  }, [testId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#3B5C37] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Đang chuẩn bị đề thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-4 shadow-sm">
          <p className="text-sm font-bold text-red-500">❌ Lỗi: {error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#3B5C37] hover:bg-[#2c4728] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return <ListeningLayout />;
}

export default function ListeningTestPage() {
  return (
    <ListeningTestProvider>
      <ListeningTestPageContent />
    </ListeningTestProvider>
  );
}
