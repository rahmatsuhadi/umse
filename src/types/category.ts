export interface Category {
  id: number;
  name: string;
  slug: string; // untuk URL, mis: /produk?kategori=makanan-ringan
  is_ready_to_serve: boolean;
  is_frozen: boolean;
  is_featured: boolean;
  icon_url: string;
  imageUrl?: string;
  products_count?: number;
}