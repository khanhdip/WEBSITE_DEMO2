import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Book Store initialized with default books
let books = [
  {
    id: "b1",
    title: "Nhà Giả Kim (The Alchemist)",
    author: "Paulo Coelho",
    price: 89000,
    rating: 4.8,
    category: "Văn Học",
    description: "Nhà giả kim là câu chuyện đầy chất thơ về hành trình của Santiago, một cậu bé chăn cừu Tây Ban Nha đi tìm kho báu ở Ai Cập, giúp người đọc tìm kiếm ước mơ và sứ mệnh cuộc đời.",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    isBestSeller: true,
    year: 2020,
    pages: 228
  },
  {
    id: "b2",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    price: 76000,
    rating: 4.9,
    category: "Kỹ Năng",
    description: "Đắc Nhân Tâm là cuốn sách nghệ thuật giao tiếp và thu phục lòng người bán chạy nhất mọi thời đại, hướng dẫn con người thấu hiểu bản thân và xây dựng các mối quan hệ tốt đẹp.",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    isBestSeller: true,
    year: 2021,
    pages: 320
  },
  {
    id: "b3",
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    author: "Nguyễn Nhật Ánh",
    price: 125000,
    rating: 4.7,
    category: "Văn Học",
    description: "Tác phẩm khắc họa thế giới tuổi thơ mộc mạc, trong trẻo ở một làng quê nghèo miền Trung, với tình anh em sâu sắc, sự ghen tị trẻ con và những tình cảm học trò đầu đời đầy thơ ngây.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
    year: 2018,
    pages: 378
  },
  {
    id: "b4",
    title: "Cha Giàu Cha Nghèo (Rich Dad Poor Dad)",
    author: "Robert T. Kiyosaki",
    price: 110000,
    rating: 4.6,
    category: "Kinh Tế",
    description: "Cuốn sách mở ra góc nhìn hoàn toàn mới về tài chính cá nhân, đầu tư và tài sản, giúp người đọc định hình tư duy làm chủ dòng tiền thay vì làm thuê suốt đời cho tiền bạc.",
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
    isBestSeller: true,
    year: 2019,
    pages: 350
  },
  {
    id: "b5",
    title: "Lược Sử Loài Người (Sapiens)",
    author: "Yuval Noah Harari",
    price: 195000,
    rating: 4.9,
    category: "Khoa Học",
    description: "Một hành trình quét qua lịch sử loài người từ thời đồ đá cho đến hiện đại, lý giải cách mà Homo Sapiens vươn lên thống trị hành tinh nhờ vào khả năng tưởng tượng và hợp tác.",
    imageUrl: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&q=80&w=400",
    year: 2017,
    pages: 560
  },
  {
    id: "b6",
    title: "Thiết Kế Vạn Vật (The Design of Everyday Things)",
    author: "Don Norman",
    price: 145000,
    rating: 4.5,
    category: "Công Nghệ",
    description: "Cuốn sách kinh điển dành cho các nhà thiết kế và nhà phát triển công nghệ, giúp lý giải lý do tại sao một số sản phẩm lại dễ sử dụng trong khi số khác lại gây bối rối.",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
    year: 2018,
    pages: 420
  },
  {
    id: "b7",
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu?",
    author: "Rosie Nguyễn",
    price: 79000,
    rating: 4.8,
    category: "Kỹ Năng",
    description: "Cuốn sách là lời tự sự của một người đi trước dành cho những người trẻ, chia sẻ về việc tự học, đam mê, xê dịch và kiến tạo giá trị thực sự cho bản thân trong những năm tháng thanh xuân.",
    imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400",
    isBestSeller: true,
    year: 2020,
    pages: 280
  },
  {
    id: "b8",
    title: "Thương Vụ Để Đời (Built to Last)",
    author: "Jim Collins",
    price: 165000,
    rating: 4.7,
    category: "Kinh Tế",
    description: "Cuốn sách nghiên cứu chuyên sâu về các tập đoàn trường tồn với thời gian, khám phá ra những triết lý kinh doanh cốt lõi giúp họ đứng vững trước muôn vàn sóng gió thị trường.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    year: 2015,
    pages: 450
  }
];

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Get all books
app.get("/api/books", (req, res) => {
  res.json(books);
});

// 2. Add a new book (Admin action simulation)
app.post("/api/books", (req, res) => {
  const { title, author, price, category, description, imageUrl, year, pages } = req.body;
  if (!title || !author || !price || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newBook = {
    id: "b" + (books.length + 1),
    title,
    author,
    price: Number(price),
    rating: 5.0,
    category,
    description: description || "Không có mô tả sản phẩm.",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    year: Number(year) || new Date().getFullYear(),
    pages: Number(pages) || 200
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// 3. Create payment QR code (using real-time dynamic VietQR API)
app.post("/api/payment/create", (req, res) => {
  const { amount, customerName } = req.body;
  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  const orderId = "BOOK" + Math.floor(100000 + Math.random() * 900000);
  const paymentDescription = `Thanh toan don hang ${orderId} cho Cua hang Sach Online`;

  // MB Bank (Ngân hàng Quân đội), số tài khoản giả định đẹp 999912345678
  const bankId = "MB";
  const accountNumber = "999912345678";
  const accountName = "CUA HANG SACH ONLINE";
  const template = "qr_only";

  // VietQR dynamic image URL
  const paymentQRUrl = `https://img.vietqr.io/image/${bankId}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(paymentDescription)}&accountName=${encodeURIComponent(accountName)}`;

  res.json({
    orderId,
    amount,
    customerName,
    paymentDescription,
    paymentQRUrl,
    bankId,
    accountNumber,
    accountName,
    status: "pending"
  });
});

// 4. AI Book Recommendation endpoint (using Gemini API or localized fallback)
app.post("/api/recommendations", async (req, res) => {
  const { genres, keywords, readingGoal, preferredStyle } = req.body;

  if (!genres || !Array.isArray(genres) || genres.length === 0) {
    return res.status(400).json({ error: "Vui lòng chọn ít nhất một thể loại sách." });
  }

  const genresStr = genres.join(", ");
  const keywordsStr = keywords || "Chung";
  const goalStr = readingGoal || "Phát triển bản thân";
  const styleStr = preferredStyle || "Dễ hiểu, gần gũi";

  try {
    const ai = getAi();
    
    const prompt = `Bạn là một chuyên gia tư vấn sách kỳ cựu và tinh tế. 
Hãy gợi ý cho tôi chính xác 3 cuốn sách tuyệt vời nhất dựa trên hồ sơ sở thích của tôi dưới đây:
- Thể loại yêu thích: ${genresStr}
- Từ khóa quan tâm: ${keywordsStr}
- Mục tiêu đọc sách: ${goalStr}
- Phong cách hành văn ưa thích: ${styleStr}

Sách được gợi ý có thể là sách nổi tiếng thế giới hoặc sách chất lượng cao trong thực tế.
Mỗi gợi ý phải đi kèm lý do cụ thể và thuyết phục giải thích vì sao cuốn sách này cực kỳ tương thích với mong muốn của tôi.
Bạn phải tính toán Điểm tương thích (matchScore) từ 70 đến 100 dựa trên mức độ phù hợp.

Yêu cầu trả về kết quả dưới định dạng JSON mảng (Array of Objects) với cấu trúc chính xác sau:
[
  {
    "title": "Tên cuốn sách bằng Tiếng Việt hoặc tên quốc tế phổ biến tại Việt Nam",
    "author": "Tên tác giả",
    "category": "Thể loại chính phù hợp nhất",
    "description": "Tóm tắt ngắn gọn nội dung cuốn sách khoảng 2-3 câu",
    "reason": "Giải thích chi tiết vì sao cuốn sách này phù hợp với sở thích, mục tiêu và phong cách đọc của người dùng",
    "matchScore": 95
  }
]

Không viết thêm bất kỳ văn bản nào ngoài khối mảng JSON trên. Trả lời hoàn toàn bằng Tiếng Việt.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              reason: { type: Type.STRING },
              matchScore: { type: Type.INTEGER }
            },
            required: ["title", "author", "category", "description", "reason", "matchScore"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Không nhận được dữ liệu phản hồi từ AI");
    }

    const recommendations = JSON.parse(text);
    res.json({ recommendations, isSimulated: false });

  } catch (error: any) {
    console.warn("Gemini API error, running smart simulation fallback:", error.message);
    
    // Fallback: Smart recommendation engine in Vietnamese to ensure the app works flawlessly
    const simulatedRecommendations = [
      {
        title: `Hành Trình Tìm Kiếm Bản Thân (Gợi ý cho ${genres[0]})`,
        author: "Tác giả truyền cảm hứng nổi tiếng",
        category: genres[0],
        description: `Một cuốn sách đột phá hướng dẫn người đọc thấu hiểu chiều sâu tâm hồn, tập trung làm rõ các từ khóa '${keywordsStr}' và dẫn dắt cuộc sống đúng hướng.`,
        reason: `Cuốn sách này phù hợp tuyệt đối vì bạn quan tâm đến thể loại ${genresStr} và hướng tới mục tiêu '${goalStr}'. Cách hành văn '${styleStr}' sẽ giúp bạn dễ dàng hấp thụ các bài học quý giá mà không bị khô khan.`,
        matchScore: Math.floor(Math.random() * 11) + 88
      },
      {
        title: `Nghệ Thuật Làm Chủ Tư Duy & Hành Động`,
        author: "Nhà nghiên cứu tâm lý học hành vi",
        category: "Kỹ Năng",
        description: `Giải mã cơ chế vận hành của não bộ, thói quen và cách thiết lập một lộ trình kỷ luật để chinh phục những đỉnh cao mới trong sự nghiệp lẫn đời sống tinh thần.`,
        reason: `Mục tiêu '${goalStr}' của bạn đòi hỏi sự kỷ luật và tư duy nhất quán. Cuốn sách này cung cấp bộ khung kỹ năng hoàn hảo để thực hiện điều đó dựa trên sở thích cốt lõi về ${genresStr}.`,
        matchScore: Math.floor(Math.random() * 11) + 85
      },
      {
        title: `Kiến Tạo Tương Lai Số`,
        author: "Chuyên gia đổi mới sáng tạo",
        category: "Kinh Tế / Công Nghệ",
        description: `Phân tích những chuyển dịch mạnh mẽ của thế giới hiện đại và phương thức để cá nhân đón đầu làn sóng công nghệ mới, rèn luyện tư duy nhạy bén.`,
        reason: `Với những từ khóa bạn cung cấp như '${keywordsStr}', cuốn sách này sẽ mở rộng đáng kể tầm nhìn thực tế, kết hợp phong cách viết '${styleStr}' vô cùng trực quan và lôi cuốn.`,
        matchScore: Math.floor(Math.random() * 11) + 80
      }
    ];

    res.json({ 
      recommendations: simulatedRecommendations, 
      isSimulated: true,
      message: "Tính năng gợi ý hiện đang hoạt động ở chế độ Mô Phỏng Thông Minh (Để kích hoạt AI thực tế, vui lòng cấu hình GEMINI_API_KEY trong Settings > Secrets)." 
    });
  }
});

// Vite Middleware & SPA Static fallback setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Online Bookstore backend running on http://localhost:${PORT}`);
  });
}

startServer();
