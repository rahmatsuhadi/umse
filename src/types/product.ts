import type { Store } from './store';
import type { Category } from './category';
import type { User } from './user';

export interface Price {
  amount: string;
  currency: 'IDR';
  formatted: string;
  value: number;
}

export interface Media {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  name: string;
}

export interface VariantOption {
  option_name: string;
  option_value: string;
}

export interface Variant {
  id: string;
  name: string;
  price: Price;
  stock_quantity: number;
  thumbnail: Media;
  options: VariantOption[];
}

export interface Product {
  id: string;
  store_id: string;
  store: Store;
  name: string;
  slug: string;
  price: Price;
  description: string;
  category_id: string;
  category: Category;
  review_status: 'pending' | 'approved' | 'rejected';
  reviewer: User | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  rating_count: Record<string, number>; // Objek seperti { "3": 3, "4": 20, "5": 72 }
  average_rating: string; // Sebaiknya di-parse ke number saat digunakan
  stock_quantity: number;
  stock_status: 'in_stock' | 'out_of_stock';
  thumbnail: Media;
  media: Media[];
  variants: Variant[];
  created_at: string;
  updated_at: string;
}