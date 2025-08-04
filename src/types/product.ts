
export interface Product {
  id: string; 
  name: string;
  slug: string; 
  description: string;
  price: number;
  stock: number;
  images: ProductImage[]; 
  category: Category;
  createdAt: string; 
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
}
