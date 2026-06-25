import { useState, useEffect } from "react";
import { Book, CartItem, Order } from "./types";
import { INITIAL_BOOKS } from "./data";
import { BookCard } from "./components/BookCard";
import { RecommendationEngine } from "./components/RecommendationEngine";
import { CheckoutModal } from "./components/CheckoutModal";
import { AdminBookModal } from "./components/AdminBookModal";
import {
  BookOpen,
  Search,
  ShoppingCart,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
  Grid,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
} from "lucide-react";

export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Modal controls
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Load books from server API on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setBooks(data);
          }
        }
      } catch (err) {
        console.warn("Could not load books from Express server, using fallback static list:", err);
      }
    };
    fetchBooks();
  }, []);

  // Filter books list based on category and search query
  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Unique categories list
  const categories = ["All", "Văn Học", "Kỹ Năng", "Kinh Tế", "Khoa Học", "Công Nghệ"];

  // Cart operations
  const handleAddToCart = (book: Book) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.book.id === book.id);
      if (existing) {
        return prevCart.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { book, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (bookId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.book.id === bookId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (bookId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.book.id !== bookId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Checkout response
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setCart([]); // Reset cart
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Notification Banner */}
      <div className="bg-emerald-850 bg-slate-900 text-slate-200 py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-emerald-400 animate-pulse" />
        <span>Cửa Hàng Sách Trực Tuyến Tích Hợp Đề Xuất Sách AI (Sử dụng Gemini) & Quét Mã Thanh Toán VietQR MB Bank!</span>
      </div>

      {/* Main Elegant Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <BookOpen size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg block">BOOKSTORE</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase -mt-1 block">Trí Thức Là Sức Mạnh</span>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Award size={14} className="text-emerald-600" />
              <span>Sách Chính Hãng 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-600" />
              <span>Bán Chạy Nhất Tuần</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            {/* Admin Add Book Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl transition-all duration-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-200/50 cursor-pointer"
            >
              <Plus size={14} />
              Thêm Sách
            </button>

            {/* Cart summary badge */}
            <a
              href="#cart-section"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Welcome / Banner Area */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-100/50">
              Giải Pháp Trí Tuệ Nhân Tạo Hiện Đại
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Khám Phá Sách Theo Cách Hoàn Toàn Mới
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
              Mua sắm những đầu sách tinh hoa từ Kỹ năng sống, Kinh tế cho đến Khoa học công nghệ. Trải nghiệm hệ thống gợi ý chuyên sâu bằng AI và quét QR ngân hàng thanh toán siêu nhanh.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* 1. Smart AI Recommendation Section */}
        <section id="ai-recommendations" className="scroll-mt-20">
          <RecommendationEngine
            onAddRecommendedToCart={handleAddToCart}
            availableBooks={books}
          />
        </section>

        {/* 2. Order Success Success State Banner (Conditional) */}
        {lastOrder && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Gửi đơn hàng {lastOrder.id} thành công!</h4>
                <p className="text-xs text-emerald-700">Chúng tôi đã chuẩn bị đóng gói sách cho khách hàng {lastOrder.customerName}.</p>
              </div>
            </div>
            <button
              onClick={() => setLastOrder(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline"
            >
              Ẩn thông báo này
            </button>
          </div>
        )}

        {/* 3. Catalog and Shopping Cart grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Books List (Catalog) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                <Grid size={14} className="text-slate-400 mr-1 flex-shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Tìm kiếm tựa sách, tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Grid display books */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto">
                <Search className="text-slate-300 mx-auto mb-3" size={36} />
                <h4 className="font-bold text-slate-800 text-sm">Không tìm thấy sách phù hợp</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc lọc theo danh mục khác nhé.
                </p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div id="cart-section" className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-6 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-[15px]">Giỏ Hàng Của Bạn</h3>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            </div>

            {cart.length > 0 ? (
              <div className="space-y-4">
                {/* Cart list items */}
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.book.id} className="flex gap-3 text-xs justify-between items-start">
                      <img
                        src={item.book.imageUrl}
                        alt={item.book.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 object-cover rounded-md bg-slate-50 border border-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 line-clamp-1 leading-snug">{item.book.title}</h4>
                        <p className="text-slate-400 text-[10px] font-semibold mt-0.5">{item.book.price.toLocaleString("vi-VN")} đ</p>
                        
                        {/* Quantity picker */}
                        <div className="flex items-center gap-2.5 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.book.id, -1)}
                            className="bg-slate-100 hover:bg-slate-200 w-5 h-5 rounded-md font-bold text-slate-600 flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="font-bold text-slate-700 text-[11px]">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.book.id, 1)}
                            className="bg-slate-100 hover:bg-slate-200 w-5 h-5 rounded-md font-bold text-slate-600 flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => handleRemoveFromCart(item.book.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bill totals info */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Tổng phụ</span>
                    <span>{cartTotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Giao hàng</span>
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5">
                    <span>Tổng thanh toán</span>
                    <span>{cartTotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-emerald-100 hover:shadow-emerald-200 flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <ShoppingCart size={15} />
                  Thanh Toán Ngay
                </button>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2.5">
                <ShoppingCart className="text-slate-200 mx-auto" size={32} />
                <p className="text-xs font-semibold text-slate-400">Giỏ hàng của bạn đang trống</p>
                <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto leading-relaxed">
                  Nhấp vào nút "Thêm" dưới mỗi cuốn sách để thêm vào giỏ hàng của bạn.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info section */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-extrabold text-white tracking-wider text-sm">BOOKSTORE ONLINE</span>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Dự án website bán sách thế hệ mới hỗ trợ thanh toán chuyển khoản thông minh tự động sinh mã VietQR và trí tuệ nhân tạo tư vấn đầu sách đắc lực nhất.
            </p>
          </div>
          <div>
            <span className="font-bold text-white text-xs">CÔNG NGHỆ ÁP DỤNG</span>
            <ul className="space-y-1.5 mt-2.5 text-[11px]">
              <li>• Thiết kế giao diện hiện đại với React 19 & TailwindCSS</li>
              <li>• API Gateway và Middleware tích hợp bảo mật bằng Express</li>
              <li>• Hệ thống AI tạo sinh thông minh (Mô hình Gemini 3.5 Flash)</li>
              <li>• Cổng thanh toán tiện dụng thông qua hình ảnh VietQR MB Bank</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white text-xs">LIÊN HỆ HỖ TRỢ</span>
            <p className="text-[11px] mt-2 leading-relaxed">
              Địa chỉ: Hà Nội, Việt Nam<br />
              Email: hỗ trợ@bookstoreonline.vn<br />
              Số điện thoại: 1900 6789 (Hỗ trợ 24/7)
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800/60 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} Cửa Hàng Sách Trực Tuyến Sáng Tạo. Toàn bộ bản quyền được bảo lưu.
        </div>
      </footer>

      {/* Modals injection */}
      {isCheckoutOpen && (
        <CheckoutModal
          cartItems={cart}
          total={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {isAdminOpen && (
        <AdminBookModal
          onClose={() => setIsAdminOpen(false)}
          onBookAdded={(newBook) => {
            setBooks((prev) => [...prev, newBook]);
          }}
        />
      )}
    </div>
  );
}
