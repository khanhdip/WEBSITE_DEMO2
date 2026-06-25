import React, { useState } from "react";
import { UserPreferences, RecommendedBook, Book } from "../types";
import { Sparkles, Compass, Check, BookOpen, ThumbsUp, HelpCircle, Loader2 } from "lucide-react";

interface RecommendationEngineProps {
  onAddRecommendedToCart: (book: Book) => void;
  availableBooks: Book[];
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  onAddRecommendedToCart,
  availableBooks,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    keywords: "",
    readingGoal: "Phát triển bản thân & Tư duy",
    preferredStyle: "Dễ hiểu, thực tế",
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const GENRES_LIST = [
    "Văn Học",
    "Kỹ Năng",
    "Kinh Tế",
    "Khoa Học",
    "Công Nghệ",
    "Tâm Lý Học",
    "Nghệ Thuật",
  ];

  const GOALS_LIST = [
    "Phát triển bản thân & Tư duy",
    "Tìm kiếm cảm hứng & Động lực",
    "Nâng cao chuyên môn & Kỹ năng làm việc",
    "Giải trí, thư giãn tinh thần",
    "Thấu hiểu tâm lý & Con người",
  ];

  const STYLES_LIST = [
    "Dễ hiểu, thực tế",
    "Sâu sắc, triết lý & Chiêm nghiệm",
    "Học thuật, logic & Nghiên cứu",
    "Hấp dẫn, lôi cuốn & Giàu cảm xúc",
  ];

  const toggleGenre = (genre: string) => {
    setPreferences((prev) => {
      const isSelected = prev.genres.includes(genre);
      return {
        ...prev,
        genres: isSelected
          ? prev.genres.filter((g) => g !== genre)
          : [...prev.genres, genre],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.genres.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thể loại sách yêu thích!");
      return;
    }

    setLoading(true);
    setInfoMessage(null);
    setRecommendations([]);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendations(data.recommendations || []);
      if (data.message) {
        setInfoMessage(data.message);
      }
    } catch (err: any) {
      console.error(err);
      alert("Đã xảy ra lỗi khi lấy gợi ý từ AI. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Convert recommended book to actual store book if possible, or build a custom purchase mock object
  const handlePurchaseRecommended = (recBook: RecommendedBook) => {
    // Check if the recommended book title matches an existing book in store
    const matchedBook = availableBooks.find(
      (b) =>
        b.title.toLowerCase().includes(recBook.title.toLowerCase()) ||
        recBook.title.toLowerCase().includes(b.title.toLowerCase())
    );

    if (matchedBook) {
      onAddRecommendedToCart(matchedBook);
    } else {
      // Create a temporary book object to buy
      const tempBook: Book = {
        id: "temp-" + Math.floor(Math.random() * 10000),
        title: recBook.title,
        author: recBook.author,
        price: 99000, // Standard flat rate for special AI books
        rating: 4.8,
        category: recBook.category || preferences.genres[0] || "AI Khuyên Đọc",
        description: recBook.description,
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
        year: new Date().getFullYear(),
        pages: 250,
      };
      onAddRecommendedToCart(tempBook);
    }
  };

  return (
    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-2xl">
          <Sparkles size={22} className="animate-pulse" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Gợi Ý Sách Thông Minh (AI)</h2>
          <p className="text-xs text-slate-500">
            Dựa trên sở thích cá nhân, AI (Gemini) sẽ tuyển chọn những cuốn sách phù hợp nhất với bạn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form preferences column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          {/* Genre selections */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Thể loại ưa thích *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENRES_LIST.map((genre) => {
                const isSelected = preferences.genres.includes(genre);
                return (
                  <button
                    type="button"
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {genre}
                    {isSelected && <Check size={12} className="inline ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Từ khóa bạn quan tâm
            </label>
            <input
              type="text"
              placeholder="Ví dụ: khởi nghiệp, tài chính cá nhân, chữa lành, triết học..."
              value={preferences.keywords}
              onChange={(e) => setPreferences({ ...preferences, keywords: e.target.value })}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-700"
            />
          </div>

          {/* Goal */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Mục tiêu đọc sách lúc này
            </label>
            <select
              value={preferences.readingGoal}
              onChange={(e) => setPreferences({ ...preferences, readingGoal: e.target.value })}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-emerald-500 text-slate-700 font-medium"
            >
              {GOALS_LIST.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Writing Style */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. Phong cách hành văn bạn thích
            </label>
            <select
              value={preferences.preferredStyle}
              onChange={(e) => setPreferences({ ...preferences, preferredStyle: e.target.value })}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-emerald-500 text-slate-700 font-medium"
            >
              {STYLES_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Đang biên soạn gợi ý từ AI...
              </>
            ) : (
              <>
                <Compass size={16} />
                Nhận Đề Xuất Từ AI
              </>
            )}
          </button>
        </form>

        {/* Output recommendations column */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm text-center p-6 h-full">
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 animate-bounce" size={16} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">AI đang phân tích sở thích của bạn...</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Mô hình ngôn ngữ lớn đang đối chiếu sở thích, từ khóa và phong cách viết để tuyển lựa ra 3 tựa sách phù hợp nhất.
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4 h-full">
              {infoMessage && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100 text-[11px] leading-relaxed">
                  {infoMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition-all duration-200 flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden group"
                  >
                    {/* Decorative badge with match rating */}
                    <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-emerald-100">
                      {rec.matchScore}% tương thích
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Gợi ý #{index + 1}
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">{rec.category}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{rec.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">Tác giả: {rec.author}</p>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rec.description}"
                      </p>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 text-xs text-slate-700 leading-relaxed">
                        <strong className="text-emerald-700">Lý do chọn: </strong>
                        {rec.reason}
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => handlePurchaseRecommended(rec)}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 text-xs shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen size={14} />
                        Mua Sách Này
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm text-center p-6 h-full">
              <Compass className="text-slate-300 mb-3" size={40} />
              <h4 className="font-bold text-slate-800 text-sm mb-1">Chưa có gợi ý sách nào</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                Điền sở thích của bạn vào biểu mẫu bên trái để nhận đề xuất tuyển chọn đặc sắc từ AI.
              </p>
              <div className="bg-slate-50 border border-slate-100/50 rounded-xl p-3 max-w-sm text-left text-[11px] text-slate-500 flex items-start gap-2">
                <HelpCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={14} />
                <span>
                  Bằng việc kết hợp các trường dữ liệu, Gemini AI sẽ đề xuất sách có độ tương thích cao đi kèm lý do chi tiết.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
