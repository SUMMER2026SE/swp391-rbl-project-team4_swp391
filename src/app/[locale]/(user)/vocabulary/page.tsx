"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Search, Volume2, Plus, Trash2, Heart, Sparkles, BookOpen } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useVocabLimit, VocabLimitModal } from "@/components/VocabLimitGate";

interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
  category: string | null;
  level: string | null;
}

interface FlashcardItem {
  word: string;
  category: string;
  frequency: number;
  meaning?: string;
  phonetic?: string;
}

interface NotebookItem {
  id: string;
  word: string;
  definition: string | null;
  example: string | null;
  category: string | null;
  created_at: string;
}

const CATEGORIES = [
  "Tất cả",
  "academic",
  "environment",
  "economy",
  "society",
  "health",
  "education",
  "government",
  "technology"
];

const LEVELS = ["Tất cả", "5.5", "6.0", "6.5", "7.0", "7.5", "B1", "B2", "C1"];

const FLASHCARD_TRANSLATIONS: Record<string, { meaning: string; phonetic: string }> = {
  significant: { meaning: "đáng kể, quan trọng", phonetic: "/sɪɡˈnɪf.ɪ.kənt/" },
  however: { meaning: "tuy nhiên", phonetic: "/haʊˈev.ər/" },
  therefore: { meaning: "do đó, vì vậy", phonetic: "/ˈðeə.fɔːr/" },
  although: { meaning: "mặc dù", phonetic: "/ɔːlˈðəʊ/" },
  furthermore: { meaning: "hơn nữa", phonetic: "/ˌfɜː.ðəˈmɔːr/" },
  nevertheless: { meaning: "tuy nhiên, tuy thế", phonetic: "/ˌnev.ə.ðəˈles/" },
  consequently: { meaning: "hậu quả là, do đó", phonetic: "/ˈkɒn.sɪ.kwənt.li/" },
  moreover: { meaning: "hơn nữa, ngoài ra", phonetic: "/mɔːrˈəʊ.vər/" },
  "in contrast": { meaning: "ngược lại", phonetic: "/ɪn ˈkɒn.trɑːst/" },
  "on the other hand": { meaning: "mặt khác", phonetic: "/ɒn ði ˈʌð.ər hænd/" },
  "for instance": { meaning: "ví dụ như", phonetic: "/fɔːr ˈɪn.stəns/" },
  "in addition": { meaning: "ngoài ra, thêm vào đó", phonetic: "/ɪn əˈdɪʃ.ən/" },
  "as a result": { meaning: "kết quả là", phonetic: "/æz eɪ rɪˈzʌlt/" },
  "in conclusion": { meaning: "tóm lại, kết luận", phonetic: "/ɪn kənˈkluː.ʒən/" },
  "to sum up": { meaning: "tóm lại", phonetic: "/tuː sʌm ʌp/" },
  "it is argued that": { meaning: "có ý kiến cho rằng", phonetic: "/ɪt ɪz ˈɑːɡ.juːd ðæt/" },
  "there is evidence to suggest": { meaning: "có bằng chứng chỉ ra rằng", phonetic: "/ðeər ɪz ˈev.ɪ.dəns tuː səˈdʒest/" },
  "it is widely accepted that": { meaning: "được chấp nhận rộng rãi rằng", phonetic: "/ɪt ɪz ˈwaɪd.li əkˈsep.tɪd ðæt/" },
  "this suggests that": { meaning: "điều này cho thấy rằng", phonetic: "/ðɪs səˈdʒests ðæt/" },
  arguably: { meaning: "có thể cho rằng", phonetic: "/ˈɑːɡ.ju.ə.bli/" },
  sustainable: { meaning: "bền vững", phonetic: "/səˈsteɪ.nə.bəl/" },
  emissions: { meaning: "khí thải", phonetic: "/iˈmɪʃ.ənz/" },
  "renewable energy": { meaning: "năng lượng tái tạo", phonetic: "/rɪˈnjuː.ə.bəl ˈen.ə.dʒi/" },
  "climate change": { meaning: "biến đổi khí hậu", phonetic: "/ˈklaɪ.mət tʃeɪndʒ/" },
  biodiversity: { meaning: "đa dạng sinh học", phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/" },
  deforestation: { meaning: "sự phá rừng", phonetic: "/diːˌfɒr.ɪˈsteɪ.ʃən/" },
  "carbon footprint": { meaning: "dấu chân carbon", phonetic: "/ˌkɑː.bən ˈfʊt.prɪnt/" },
  conservation: { meaning: "sự bảo tồn", phonetic: "/ˌkɒn.səˈveɪ.ʃən/" },
  pollution: { meaning: "sự ô nhiễm", phonetic: "/pəˈluː.ʃən/" },
  ecosystem: { meaning: "hệ sinh thái", phonetic: "/ˈiː.kəʊˌsɪs.təm/" },
  urbanisation: { meaning: "đô thị hóa", phonetic: "/ˌɜː.bə.naɪˈzeɪ.ʃən/" },
  globalisation: { meaning: "toàn cầu hóa", phonetic: "/ˌɡləʊ.bəl.aɪˈzeɪ.ʃən/" },
  inequality: { meaning: "sự bất bình đẳng", phonetic: "/ˌɪn.ɪˈkwɒl.ə.ti/" },
  infrastructure: { meaning: "cơ sở hạ tầng", phonetic: "/ˈɪn.frəˌstrʌk.tʃər/" },
  "population growth": { meaning: "sự gia tăng dân số", phonetic: "/ˌpɒp.jəˈleɪ.ʃən ɡrəʊθ/" },
  poverty: { meaning: "sự nghèo đói", phonetic: "/ˈpɒv.ə.ti/" },
  migration: { meaning: "sự di cư", phonetic: "/maɪˈɡreɪ.ʃən/" },
  diversity: { meaning: "sự đa dạng", phonetic: "/daɪˈvɜː.sə.ti/" },
  wellbeing: { meaning: "sự khỏe mạnh, hạnh phúc", phonetic: "/ˌwelˈbiː.ɪŋ/" },
  "mental health": { meaning: "sức khỏe tinh thần", phonetic: "/ˈmen.təl helθ/" },
  technology: { meaning: "công nghệ", phonetic: "/tekˈnɒl.ə.dʒi/" },
  "artificial intelligence": { meaning: "trí tuệ nhân tạo", phonetic: "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/" },
  automation: { meaning: "tự động hóa", phonetic: "/ˌɔː.təˈmeɪ.ʃən/" },
  innovation: { meaning: "sự đổi mới, sáng kiến", phonetic: "/ˌɪn.əˈveɪ.ʃən/" },
  digital: { meaning: "kỹ thuật số", phonetic: "/ˈdɪdʒ.ɪ.təl/" },
  "social media": { meaning: "mạng xã hội", phonetic: "/ˌsəʊ.ʃəl ˈmiː.di.ə/" },
  internet: { meaning: "mạng internet", phonetic: "/ˈɪn.tə.net/" },
  data: { meaning: "dữ liệu", phonetic: "/ˈdeɪ.tə/" },
  cybersecurity: { meaning: "an ninh mạng", phonetic: "/ˌsaɪ.bər.sɪˈkʊə.rə.ti/" },
  algorithm: { meaning: "thuật toán", phonetic: "/ˈæl.ɡə.rɪ.ðəm/" },
  education: { meaning: "giáo dục", phonetic: "/ˌed.jʊˈkeɪ.ʃən/" },
  curriculum: { meaning: "chương trình giảng dạy", phonetic: "/kəˈrɪk.jʊ.ləm/" },
  literacy: { meaning: "trình độ học vấn, biết chữ", phonetic: "/ˈlɪt.ər.ə.si/" },
  "academic achievement": { meaning: "thành tích học tập", phonetic: "/ˌæk.əˈdem.ɪk əˈtʃiːv.mənt/" },
  "higher education": { meaning: "giáo dục đại học", phonetic: "/ˌhaɪ.ər ed.jʊˈkeɪ.ʃən/" },
  "critical thinking": { meaning: "tư duy phản biện", phonetic: "/ˌkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/" },
  "lifelong learning": { meaning: "học tập suốt đời", phonetic: "/ˈlaɪf.lɒŋ ˈlɜː.nɪŋ/" },
  "vocational training": { meaning: "đào tạo nghề", phonetic: "/vəʊˈkeɪ.ʃən.əl ˈtreɪ.nɪŋ/" },
  "tuition fees": { meaning: "học phí", phonetic: "/tʃuːˈɪʃ.ən fiːz/" },
  "academic pressure": { meaning: "áp lực học tập", phonetic: "/ˌæk.əˈdem.ɪk ˈpreʃ.ər/" },
  economy: { meaning: "nền kinh tế", phonetic: "/ɪˈkɒn.ə.mi/" },
  unemployment: { meaning: "tình trạng thất nghiệp", phonetic: "/ˌʌn.ɪmˈplɔɪ.mənt/" },
  inflation: { meaning: "lạm phát", phonetic: "/ɪnˈfleɪ.ʃən/" },
  investment: { meaning: "sự đầu tư", phonetic: "/ɪnˈvest.mənt/" },
  subsidy: { meaning: "tiền trợ cấp", phonetic: "/ˈsʌb.sɪ.di/" },
  taxation: { meaning: "hệ thống thuế, sự đánh thuế", phonetic: "/tækˈseɪ.ʃən/" },
  trade: { meaning: "thương mại, giao dịch", phonetic: "/treɪd/" },
  GDP: { meaning: "tổng sản phẩm quốc nội", phonetic: "/ˌdʒiː.diːˈpiː/" },
  privatisation: { meaning: "sự tư nhân hóa", phonetic: "/ˌpraɪ.və.taɪˈzeɪ.ʃən/" },
  "economic growth": { meaning: "sự tăng trưởng kinh tế", phonetic: "/ˌiː.kəˈnɒm.ɪk ɡrəʊθ/" },
  government: { meaning: "chính phủ", phonetic: "/ˈɡʌv.ən.mənt/" },
  legislation: { meaning: "pháp luật, luật ban hành", phonetic: "/ˌledʒ.ɪˈsleɪ.ʃən/" },
  policy: { meaning: "chính sách", phonetic: "/ˈpɒl.ə.si/" },
  regulation: { meaning: "quy định, quy chế", phonetic: "/ˌreɡ.jəˈleɪ.ʃən/" },
  democracy: { meaning: "nền dân chủ", phonetic: "/dɪˈmɒk.rə.si/" },
  corruption: { meaning: "sự tham nhũng", phonetic: "/kəˈrʌp.ʃən/" },
  accountability: { meaning: "trách nhiệm giải trình", phonetic: "/əˌkaʊn.təˈbɪl.ə.ti/" },
  "public sector": { meaning: "khu vực công", phonetic: "/ˌpʌb.lɪk ˈsek.tər/" },
  "welfare state": { meaning: "nhà nước phúc lợi", phonetic: "/ˈwel.feər steɪt/" },
  diplomacy: { meaning: "ngoại giao", phonetic: "/dɪˈpləʊ.mə.si/" },
  obesity: { meaning: "bệnh béo phì", phonetic: "/əʊˈbiː.sə.ti/" },
  vaccination: { meaning: "sự tiêm chủng", phonetic: "/ˌvæk.sɪˈneɪ.ʃən/" },
  pandemic: { meaning: "đại dịch", phonetic: "/pænˈdem.ɪk/" },
  nutrition: { meaning: "dinh dưỡng", phonetic: "/njuːˈtrɪʃ.ən/" },
  "life expectancy": { meaning: "tuỏi thọ trung bình", phonetic: "/ˈlaɪf ɪkˌspek.tən.si/" },
  "chronic disease": { meaning: "bệnh mãn tính", phonetic: "/ˌkrɒn.ɪk dɪˈziːz/" },
  "healthcare system": { meaning: "hệ thống y tế", phonetic: "/ˈhelθ.keər ˈsɪs.təm/" },
  "mortality rate": { meaning: "tỷ lệ tử vong", phonetic: "/mɔːˈtæl.ə.ti reɪt/" },
  "sedentary lifestyle": { meaning: "lối sống ít vận động", phonetic: "/ˈsed.ən.tər.i ˈlaɪf.staɪl/" },
  "mental illness": { meaning: "bệnh tâm thần", phonetic: "/ˈmen.təl ˈɪl.nəs/" },
  facilitate: { meaning: "tạo điều kiện thuận lợi", phonetic: "/fəˈsɪl.ɪ.teɪt/" },
  alleviate: { meaning: "giảm bớt, làm nhẹ bớt", phonetic: "/əˈliː.vi.eɪt/" },
  exacerbate: { meaning: "làm trầm trọng thêm", phonetic: "/ɪɡˈzæs.ə.beɪt/" },
  mitigate: { meaning: "giảm thiểu, làm dịu bớt", phonetic: "/ˈmɪt.ɪ.ɡeɪt/" },
  unprecedented: { meaning: "chưa từng có tiền lệ", phonetic: "/ʌnˈpres.ɪ.den.tɪd/" },
  paradigm: { meaning: "mô hình, kiểu mẫu", phonetic: "/ˈpær.ə.daɪm/" },
  empirical: { meaning: "dựa trên thực nghiệm", phonetic: "/ɪmˈpɪr.ɪ.kəl/" },
  nominalisation: { meaning: "sự danh từ hóa", phonetic: "/ˌnɒm.ɪ.nə.laɪˈzeɪ.ʃən/" }
};

export default function VocabularyPage() {
  const { user } = useAuth();
  const { isVip } = useSubscription();
  const { remaining, showModal, setShowModal, incrementCount } = useVocabLimit();
  
  // Data States
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [savedWords, setSavedWords] = useState<Record<string, NotebookItem>>({});
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

  const handleSelectWord = (item: VocabularyItem) => {
    if (selectedWord?.id === item.id) return;
    const allowed = incrementCount();
    if (!allowed) return;
    setSelectedWord(item);
  };

  // Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch public vocabulary & flashcards from backend API to bypass client RLS
      const apiRes = await fetch("/api/vocabulary");
      if (!apiRes.ok) throw new Error("Không thể tải danh sách từ vựng");
      const { words: wordsData, flashcards: flashData } = await apiRes.json();

      if (wordsData) {
        setWords(wordsData);
        if (wordsData.length > 0) {
          setSelectedWord(wordsData[0]);
        }
      }

      if (flashData) {
        // Map vocabulary meanings/phonetics to flashcards if available
        const wordsMap = new Map(wordsData?.map((w: any) => [w.word.toLowerCase(), w]) || []);
        const mappedFlash = flashData.map((f: any) => {
          const matched = wordsMap.get(f.word.toLowerCase());
          const fallback = FLASHCARD_TRANSLATIONS[f.word.toLowerCase()];
          return {
            ...f,
            meaning: matched?.meaning || fallback?.meaning || "Đang cập nhật...",
            phonetic: matched?.phonetic || fallback?.phonetic || ""
          };
        });
        setFlashcards(mappedFlash);
      }

      // Fetch user notebook (supporting both real session and dev mock)
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';
      if (token || process.env.NODE_ENV === 'development') {
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : { 'x-mock-user-id': 'usr_2' };

        const notebookRes = await fetch("/api/notebook", { headers });
        if (notebookRes.ok) {
          const notebookResult = await notebookRes.json();
          const notebookData = notebookResult.data;
          if (notebookData) {
            const savedMap: Record<string, NotebookItem> = {};
            notebookData.forEach((item: NotebookItem) => {
              savedMap[item.word.toLowerCase()] = item;
            });
            setSavedWords(savedMap);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching vocabulary database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Audio Pronunciation
  const handlePronounce = (word: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Save to Notebook
  const handleSaveToNotebook = async (item: VocabularyItem) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : { 'x-mock-user-id': 'usr_2' })
      };

      const res = await fetch('/api/notebook', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          word: item.word.toLowerCase(),
          definition: item.meaning,
          example: item.example || "",
          category: item.category || "",
          source: "dictionary",
          force: true
        })
      });

      if (!res.ok) throw new Error("Không thể lưu từ vựng");
      const result = await res.json();
      const savedItem = result.data;

      // Update state
      setSavedWords(prev => ({
        ...prev,
        [item.word.toLowerCase()]: {
          id: savedItem?.id || "",
          word: item.word.toLowerCase(),
          definition: item.meaning,
          example: item.example,
          category: item.category,
          created_at: savedItem?.created_at || new Date().toISOString()
        }
      }));
    } catch (err) {
      console.error("Error saving word to notebook:", err);
    }
  };

  // Remove from Notebook
  const handleRemoveFromNotebook = async (word: string) => {
    try {
      const targetItem = savedWords[word.toLowerCase()];
      if (!targetItem) return;

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : { 'x-mock-user-id': 'usr_2' };

      const idToDelete = targetItem.id;
      if (idToDelete) {
        const res = await fetch(`/api/notebook?id=${idToDelete}`, {
          method: 'DELETE',
          headers
        });
        if (!res.ok) throw new Error("Không thể xoá từ vựng");
      } else {
        await supabase
          .from("user_notebook")
          .delete()
          .eq("word", word.toLowerCase());
      }

      setSavedWords(prev => {
        const updated = { ...prev };
        delete updated[word.toLowerCase()];
        return updated;
      });
    } catch (err) {
      console.error("Error deleting word from notebook:", err);
    }
  };

  // Flip Flashcard
  const toggleFlip = (word: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [word]: !prev[word]
    }));
  };

  // Filtering Logic
  const filteredWords = words.filter(w => {
    const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Tất cả" || w.category === selectedCategory;
    const matchesLevel = selectedLevel === "Tất cả" || w.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-[#F5F3EE] p-6 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-green-600 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 mb-2">
              <BookOpen className="w-4 h-4" /> VOCABULARY
            </p>
            <h1 className="leading-tight">
              <span className="text-black font-black text-5xl tracking-tight">IELTS </span>
              <span className="text-green-600 font-black text-5xl tracking-tight">DICTIONARY</span>
            </h1>
            <p className="text-gray-500 text-sm font-semibold mt-2 max-w-xl">
              Kho từ vựng IELTS theo chủ đề và band điểm. Click vào từ để xem phát âm, ví dụ ngữ cảnh, và lưu vào sổ tay học tập của riêng bạn.
            </p>
          </div>
        </header>

        <div>
          <div>
            {/* SEARCH AND FILTERS */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6 flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm từ vựng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F3EE]/40 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-600/10 transition outline-none"
                />
              </div>

              {/* Filters Group */}
              <div className="flex flex-col gap-3">
                {/* Category Pills */}
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Chủ đề</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition ${
                          selectedCategory === cat
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Pills */}
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Trình độ</span>
                  <div className="flex flex-wrap gap-1.5">
                    {LEVELS.map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-3 py-1 text-xs font-extrabold rounded-lg transition ${
                          selectedLevel === lvl
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DUAL-COLUMN CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              
              {/* Left Column: Word List */}
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col h-[600px]">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    Danh sách từ ({filteredWords.length})
                  </span>
                  {!isVip && (
                    <span className="text-[11px] font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                      Hôm nay còn: {remaining}/10 từ
                    </span>
                  )}
                </div>
                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-semibold text-xs">
                    <div className="w-8 h-8 border-4 border-green-600/30 border-t-green-600 rounded-full animate-spin mb-3" />
                    Đang tải danh sách từ...
                  </div>
                ) : filteredWords.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-semibold text-xs text-center p-6">
                    Không tìm thấy từ nào phù hợp với bộ lọc.
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
                    {filteredWords.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectWord(item)}
                        className={`p-3.5 rounded-xl cursor-pointer hover:bg-green-50/50 transition border-l-3 ${
                          selectedWord?.id === item.id
                            ? "border-green-600 bg-green-50 text-gray-900"
                            : "border-transparent text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm tracking-tight">{item.word}</span>
                          <span className="text-[10px] font-black bg-green-100/80 text-green-700 px-2 py-0.5 rounded-md">
                            {item.level || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-[10.5px] text-gray-400 font-bold">{item.phonetic || "—"}</p>
                          <p className="text-[10.5px] text-gray-500 font-semibold truncate max-w-[120px]">{item.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Word Detail */}
              <div className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
                {selectedWord ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-gray-100">
                      <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{selectedWord.word}</h2>
                        <p className="text-gray-400 text-base font-semibold mt-1">{selectedWord.phonetic || "/—/"}</p>
                        <div className="flex gap-1.5 mt-3">
                          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase">
                            Level: {selectedWord.level || "N/A"}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase">
                            Chủ đề: {selectedWord.category || "General"}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePronounce(selectedWord.word)}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition duration-200 flex items-center gap-1.5 shadow-sm border border-gray-200"
                        >
                          <Volume2 className="w-4 h-4 text-green-600" />
                          Phát âm
                        </button>
                        
                        {savedWords[selectedWord.word.toLowerCase()] ? (
                          <button
                            disabled
                            className="px-4 py-2.5 bg-gray-100 text-gray-400 font-extrabold text-xs rounded-xl cursor-not-allowed border border-gray-200"
                          >
                            Đã lưu ✓
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveToNotebook(selectedWord)}
                            disabled={!user && process.env.NODE_ENV !== "development"}
                            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl transition duration-200 flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                            Lưu vào sổ tay
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Definition */}
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Ý nghĩa</span>
                      <p className="text-xl font-bold text-gray-900 leading-snug">{selectedWord.meaning}</p>
                    </div>

                    {/* Example */}
                    {selectedWord.example && (
                      <div className="p-5 bg-green-50/50 border border-green-200/50 border-l-4 border-l-green-600 rounded-2xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 block mb-2">Ví dụ ngữ cảnh</span>
                        <p className="text-gray-700 font-semibold italic text-sm leading-relaxed">
                          "{selectedWord.example}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 font-semibold text-xs min-h-[350px]">
                    Chọn một từ ở cột trái để xem chi tiết bài học.
                  </div>
                )}
              </div>
            </div>

            {/* ================= FLASHCARD QUICK REVIEW ================= */}
            {flashcards.length > 0 && (
              <section className="mt-12 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                      TỪ THƯỜNG GẶP TRONG IELTS
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      Lật nhanh các thẻ flashcard để ghi nhớ phản xạ nghĩa của từ.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200">
                  {flashcards.map((card) => {
                    const isFlipped = flippedCards[card.word];
                    return (
                      <div
                        key={card.word}
                        onClick={() => toggleFlip(card.word)}
                        className={`w-64 h-36 rounded-2xl border flex-shrink-0 cursor-pointer p-5 flex flex-col justify-between transition-all duration-300 relative ${
                          isFlipped
                            ? "bg-green-600 border-green-700 text-white shadow-md transform rotate-y-180"
                            : "bg-[#F5F3EE]/50 border-gray-200 text-gray-900 hover:border-green-400 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                            isFlipped ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            Tần suất: {card.frequency}
                          </span>
                          <span className={`text-[9px] font-bold ${isFlipped ? "text-white/60" : "text-gray-400"}`}>
                            {card.category}
                          </span>
                        </div>

                        <div className="text-center py-2">
                          {isFlipped ? (
                            <p className="font-extrabold text-base leading-snug">{card.meaning}</p>
                          ) : (
                            <>
                              <p className="font-black text-xl tracking-tight">{card.word}</p>
                              {card.phonetic && <p className="text-[10px] text-gray-400 font-bold mt-0.5">{card.phonetic}</p>}
                            </>
                          )}
                        </div>

                        <div className="text-right">
                          <span className={`text-[9px] font-black uppercase tracking-wider ${
                            isFlipped ? "text-white/60" : "text-green-600"
                          }`}>
                            {isFlipped ? "Click để lật lại" : "Click để xem nghĩa"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      {showModal && <VocabLimitModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
