import { Book } from "./types";

export const INITIAL_BOOKS: Book[] = [
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
