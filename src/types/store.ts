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
  regency_id:string,
  district: { id: number; name: string };
  distric_id:string,
  village: { id: number; name: string };
  village_id:number
  user:User

  products_count: number;
  created_at: string;
  updated_at: string;
}