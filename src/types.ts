export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  category: string;
  description: string;
  imageUrl: string;
  isBestSeller?: boolean;
  year?: number;
  pages?: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface UserPreferences {
  genres: string[];
  keywords: string;
  readingGoal: string;
  preferredStyle: string; // e.g., "Dễ hiểu", "Sâu sắc", "Kịch tính", "Học thuật"
}

export interface RecommendedBook {
  title: string;
  author: string;
  reason: string;
  matchScore: number; // Percentage out of 100
  category: string;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: 'pending' | 'paid' | 'cancelled';
  timestamp: string;
  paymentMethod: 'qr' | 'cod' | 'card';
  paymentDescription: string;
  paymentQRUrl?: string;
}
