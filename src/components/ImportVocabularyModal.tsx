"use client";
import React, { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
// import * as xlsx from 'xlsx'; // Requires npm install xlsx

export default function ImportVocabularyModal({ onClose, onImported }: { onClose: () => void, onImported?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      // NOTE: You must install 'xlsx' package to use this fully.
      // const data = await file.arrayBuffer();
      // const workbook = xlsx.read(data);
      // const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // const rows = xlsx.utils.sheet_to_json(sheet);
      
      const rows = [] as any[]; // Placeholder
      
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["x-mock-user-id"] = "usr_2";
      }

      const res = await fetch('/api/notebook/batch', {
        method: 'POST',
        headers,
        body: JSON.stringify({ items: rows })
      });
      
      if (!res.ok) throw new Error("Failed to import");
      if (onImported) onImported();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4 z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-[#0d153a] text-sm">Nhập từ vựng hàng loạt (Excel)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 border-none bg-transparent">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && <p className="text-xs text-rose-500 bg-rose-50 p-2 rounded-lg">{error}</p>}
        
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors">
          <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Tải lên file Excel (.xlsx)</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Cột yêu cầu: word, definition, pos, example</p>
          
          <label className="cursor-pointer bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold inline-block hover:bg-indigo-700 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Chọn file"}
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileUpload} disabled={loading} />
          </label>
        </div>
        <p className="text-[10px] text-center text-slate-400">
          * Vui lòng chạy <code>npm install xlsx</code> trước khi sử dụng tính năng này
        </p>
      </div>
    </div>
  );
}
