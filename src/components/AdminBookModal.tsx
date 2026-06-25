import React, { useState } from "react";
import { Book } from "../types";
import { X, Plus, BookOpen, DollarSign, Image as ImageIcon, Tag, Calendar, Layers, CheckCircle } from "lucide-react";

interface AdminBookModalProps {
  onClose: () => void;
  onBookAdded: (newBook: Book) => void;
}

export const AdminBookModal: React.FC<AdminBookModalProps> = ({
  onClose,
  onBookAdded,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Văn Học");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const CATEGORIES = ["Văn Học", "Kỹ Năng", "Kinh Tế", "Khoa Học", "Công Nghệ", "Tâm Lý Học", "Nghệ Thuật"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !price) {
      alert("Vui lòng điền các trường bắt buộc (*)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          price: Number(price),
          category,
          description,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
          year: Number(year),
          pages: Number(pages) || 200,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        onBookAdded(data);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        alert("Có lỗi xảy ra: " + (data.error || "Không rõ nguyên nhân"));
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Thêm Sách Mới Vào Kệ</h2>
            <p className="text-xs text-slate-500">Cung cấp thông tin chi tiết về cuốn sách mới</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {success ? (
            <div className="text-center py-12 space-y-3 animate-in fade-in zoom-in duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full">
                <CheckCircle size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Thêm Sách Thành Công!</h3>
              <p className="text-xs text-slate-500">
                Sách mới đã được đồng bộ với hệ thống cửa hàng trực tuyến.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <BookOpen size={13} className="text-slate-400" />
                  Tên sách *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên sách..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tác giả *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tên tác giả..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Tag size={13} className="text-slate-400" />
                    Thể loại *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-emerald-500 text-slate-700 font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <DollarSign size={13} className="text-slate-400" />
                    Giá bán (đ) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="ví dụ: 89000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <ImageIcon size={13} className="text-slate-400" />
                    URL ảnh bìa (Tùy chọn)
                  </label>
                  <input
                    type="url"
                    placeholder="Đăng link hình ảnh..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Year & Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    Năm xuất bản
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Layers size={13} className="text-slate-400" />
                    Số trang
                  </label>
                  <input
                    type="number"
                    placeholder="250"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tóm tắt mô tả sách</label>
                <textarea
                  placeholder="Viết một đoạn tóm tắt nội dung chính..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-95 text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  {loading ? "Đang lưu..." : "Thêm vào kệ"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
