import type { User } from './user';

export interface Store {
  id: string;
  owner_id: string;
  owner: User;
  name: string;
  nik: string;
  brand_name: string;
  slug: string;
  average_rating: number;
  logo_url: string;
  description: string;
  address: string;
  // Anda bisa menambahkan tipe lebih detail untuk regency, district, village jika perlu
  regency: { id: number; name: string };
  district: { id: number; name: string };
  village: { id: number; name: string };
  products_count: number;
  created_at: string;
  updated_at: string;
}