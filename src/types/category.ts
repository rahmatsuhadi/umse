export interface Category {
  id: string;
  name: string;
  icon_path:string;
  is_featured:boolean;
  icon_url: string;
  slug: string; // untuk URL, mis: /produk?kategori=makanan-ringan
  imageUrl?: string;
}