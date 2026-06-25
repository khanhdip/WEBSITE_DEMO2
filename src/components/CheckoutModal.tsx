import React, { useState } from "react";
import { Order, CartItem } from "../types";
import { X, CreditCard, Banknote, QrCode, ClipboardCheck, CheckCircle2, RotateCw, ShieldCheck } from "lucide-react";

interface CheckoutModalProps {
  cartItems: CartItem[];
  total: number;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cartItems,
  total,
  onClose,
  onOrderSuccess,
}) => {
  // Customer info form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "cod" | "card">("qr");

  // Simulated credit card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Order & Payment state
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "qr") {
        // Create VietQR details on the backend
        const response = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, customerName: name }),
        });
        const qrData = await response.json();

        if (qrData.error) {
          throw new Error(qrData.error);
        }

        setCreatedOrder(qrData);
      } else {
        // Immediate order creation for COD / Card
        const orderId = "BOOK" + Math.floor(100000 + Math.random() * 900000);
        setCreatedOrder({
          orderId,
          amount: total,
          customerName: name,
          paymentDescription: `Thanh toan COD/Card ${orderId}`,
          status: paymentMethod === "cod" ? "pending" : "paid",
        });
        if (paymentMethod === "card") {
          // Simulate short card processing time
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi tạo đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Simulate payment status check
  const handleVerifyPayment = async () => {
    setCheckingPayment(true);
    // Simulate query verification delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCheckingPayment(false);
    setPaymentCompleted(true);
  };

  // Dispatch success order details back to main app state
  const handleFinishOrder = () => {
    if (!createdOrder) return;

    const finalOrder: Order = {
      id: createdOrder.orderId,
      items: cartItems,
      total: total,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      status: paymentMethod === "cod" ? "pending" : "paid",
      timestamp: new Date().toLocaleString("vi-VN"),
      paymentMethod: paymentMethod,
      paymentDescription: createdOrder.paymentDescription,
      paymentQRUrl: createdOrder.paymentQRUrl,
    };

    onOrderSuccess(finalOrder);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Thanh Toán Đơn Hàng</h2>
            <p className="text-xs text-slate-500">Hoàn tất biểu mẫu dưới đây để mua sách của bạn</p>
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
          {!createdOrder ? (
            /* STAGE 1: ENTER SHIPPING DETAILS & CHOOSE METHOD */
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">Bảo mật giao dịch tối đa</h4>
                  <p className="text-xs text-emerald-600">Đơn hàng và giao dịch của bạn được xử lý an toàn bằng mã hóa.</p>
                </div>
              </div>

              {/* Shipping info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Thông tin giao hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Họ và tên khách hàng *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0987xxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Địa chỉ Email nhận hóa đơn *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment methods list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Phương thức thanh toán</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* VietQR Option */}
                  <label className={`border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 ${paymentMethod === "qr" ? "border-emerald-500 bg-emerald-50/20 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={paymentMethod === "qr"}
                      onChange={() => setPaymentMethod("qr")}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-2 text-emerald-600">
                      <QrCode size={18} />
                      <span className="font-semibold text-sm text-slate-800">Chuyển khoản QR</span>
                    </div>
                    <span className="text-[11px] text-slate-500 leading-snug">Quét mã VietQR ngân hàng. Xử lý tức thì.</span>
                  </label>

                  {/* COD Option */}
                  <label className={`border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 ${paymentMethod === "cod" ? "border-emerald-500 bg-emerald-50/20 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-2 text-sky-600">
                      <Banknote size={18} />
                      <span className="font-semibold text-sm text-slate-800">Thanh toán COD</span>
                    </div>
                    <span className="text-[11px] text-slate-500 leading-snug">Trả tiền mặt khi nhận sách tại nhà.</span>
                  </label>

                  {/* Card Option */}
                  <label className={`border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 ${paymentMethod === "card" ? "border-emerald-500 bg-emerald-50/20 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <CreditCard size={18} />
                      <span className="font-semibold text-sm text-slate-800">Thẻ tín dụng</span>
                    </div>
                    <span className="text-[11px] text-slate-500 leading-snug">Thanh toán nhanh bằng thẻ Quốc tế Visa/Master.</span>
                  </label>
                </div>
              </div>

              {/* Credit card form (shows conditionally) */}
              {paymentMethod === "card" && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <h4 className="text-xs font-bold text-slate-700">Thông tin thẻ tín dụng (Demo)</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Số thẻ *</label>
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Hạn sử dụng *</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Mã bảo mật CVV *</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          placeholder="***"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order summary block */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Tổng đơn hàng ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} cuốn)</span>
                  <p className="text-2xl font-bold text-slate-900">{total.toLocaleString("vi-VN")} đ</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  {loading ? (
                    <>
                      <RotateCw className="animate-spin" size={16} />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận đặt hàng"
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STAGE 2: PROCESS THE PAYMENT WITH SELECTED METHOD */
            <div className="space-y-6 py-4">
              {paymentMethod === "qr" && !paymentCompleted && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* QR Image */}
                  <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100/50 relative">
                      <img
                        src={createdOrder.paymentQRUrl}
                        alt="Mã QR Thanh Toán VietQR"
                        className="w-64 h-64 object-contain"
                      />
                      {checkingPayment && (
                        <div className="absolute inset-0 bg-white/80 rounded-2xl flex flex-col items-center justify-center gap-2 animate-pulse">
                          <RotateCw className="animate-spin text-emerald-600" size={32} />
                          <span className="text-xs font-bold text-slate-700">Đang tra cứu số dư...</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-2 font-medium">Sử dụng Mobile Banking quét mã VietQR</span>
                  </div>

                  {/* Payment instruction details */}
                  <div className="space-y-4">
                    <div className="bg-amber-50 text-amber-800 p-3.5 rounded-xl border border-amber-100 text-xs leading-relaxed font-medium">
                      Hãy mở ứng dụng ví điện tử hoặc ngân hàng để thanh toán. Số tiền sẽ được tự động ghi nhận vào tài khoản của bạn.
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-400 font-medium text-xs">Mã đơn hàng</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 font-mono text-xs">{createdOrder.orderId}</span>
                          <button
                            onClick={() => handleCopy(createdOrder.orderId, "orderId")}
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <ClipboardCheck size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-400 font-medium text-xs">Ngân hàng</span>
                        <span className="font-semibold text-slate-800 text-xs">{createdOrder.bankId} (MB Bank)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-400 font-medium text-xs">Số tài khoản</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 font-mono text-xs">{createdOrder.accountNumber}</span>
                          <button
                            onClick={() => handleCopy(createdOrder.accountNumber, "accountNumber")}
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <ClipboardCheck size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-400 font-medium text-xs">Số tiền cần chuyển</span>
                        <span className="font-bold text-emerald-600">{createdOrder.amount.toLocaleString("vi-VN")} đ</span>
                      </div>
                      <div className="flex justify-between items-start text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-400 font-medium text-xs">Nội dung chuyển khoản</span>
                        <div className="flex items-center gap-1.5 text-right max-w-[60%]">
                          <span className="font-semibold text-slate-700 text-xs break-all line-clamp-1">{createdOrder.paymentDescription}</span>
                          <button
                            onClick={() => handleCopy(createdOrder.paymentDescription, "desc")}
                            className="text-slate-400 hover:text-emerald-600 transition-colors flex-shrink-0"
                          >
                            <ClipboardCheck size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {copySuccess && (
                      <p className="text-[11px] text-emerald-600 font-semibold text-right">
                        ✓ Đã sao chép vào bộ nhớ tạm!
                      </p>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={handleVerifyPayment}
                        disabled={checkingPayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-200 active:scale-95 text-xs shadow flex items-center justify-center gap-2"
                      >
                        {checkingPayment ? (
                          <>
                            <RotateCw className="animate-spin" size={14} />
                            Đang kết nối cổng thanh toán...
                          </>
                        ) : (
                          "Tôi Đã Chuyển Khoản Thành Công"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {(paymentCompleted || paymentMethod !== "qr") && (
                <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={36} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Giao dịch thành công!</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Cảm ơn bạn, đơn hàng <span className="font-semibold text-slate-800 font-mono">{createdOrder.orderId}</span> đã được ghi nhận vào hệ thống của Cửa hàng Sách.
                    </p>
                  </div>

                  <div className="bg-slate-50 max-w-sm mx-auto p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Khách hàng:</span>
                      <span className="font-semibold text-slate-700">{name}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Số điện thoại:</span>
                      <span className="font-semibold text-slate-700">{phone}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Tổng tiền:</span>
                      <span className="font-bold text-emerald-600">{total.toLocaleString("vi-VN")} đ</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Hình thức:</span>
                      <span className="font-semibold text-slate-700 uppercase">
                        {paymentMethod === "qr" ? "Ví QR Ngân hàng" : paymentMethod === "card" ? "Thẻ Visa/Master" : "COD Giao hàng tận nơi"}
                      </span>
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleFinishOrder}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-8 rounded-xl transition-all duration-200 active:scale-95 text-xs shadow"
                    >
                      Hoàn Tất Đơn Hàng & Quay Lại
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
