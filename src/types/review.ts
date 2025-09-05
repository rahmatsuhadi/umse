import { Media } from "./product";
import { User } from "./user";

// Tipe untuk data pengguna yang memberikan ulasan
export interface Reviewer {
  id: string;
  name: string;
  avatarUrl?: string;
}

// Tipe untuk satu ulasan
export interface Review {
  id: string;
  rating: number; // 1-5
  content: string;
  reply_content?:string
  replied_at?:string
  created_at: string; // ISO date string
  reviewer: User;
  media: Media[]
  
}