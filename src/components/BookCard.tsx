import React from "react";
import { Book } from "../types";
import { Star, ShoppingCart } from "lucide-react";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart }) => {
  // Category-based color styling
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Văn Học":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Kỹ Năng":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Kinh Tế":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Khoa Học":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Công Nghệ":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200/80 transition-all duration-300 flex flex-col group h-full">
      {/* Book Cover Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={book.imageUrl}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {book.isBestSeller && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Bán Chạy
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Badge & Meta */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getCategoryStyle(book.category)}`}>
              {book.category}
            </span>
            {book.year && (
              <span className="text-slate-400 text-xs font-medium">
                {book.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1 text-[15px] mb-1 leading-snug">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-500 font-medium mb-3">
            Bởi <span className="text-slate-600 font-semibold">{book.author}</span>
          </p>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Footer */}
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(book.rating) ? "fill-amber-400" : "text-slate-200"}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-600">{book.rating}</span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Giá bán</span>
              <span className="text-base font-bold text-slate-900">
                {book.price.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <button
              onClick={() => onAddToCart(book)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm hover:shadow flex items-center justify-center gap-1.5 font-medium text-xs px-4"
            >
              <ShoppingCart size={14} />
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
