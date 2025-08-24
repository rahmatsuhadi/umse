import { apiClient } from "@/lib/api-client";
import type { Product, PaginatedApiResponse } from "@/types";

// Tipe untuk parameter query
type ProductQueryParams = {
  page?: number;
  limit?: number;
  include?: string;
  category?: string;
  search?: string;
};

/**
 * Mengambil daftar produk dengan paginasi dan filter.
 */
export const getProducts = (params: ProductQueryParams): Promise<PaginatedApiResponse<Product>> => {
  params  ={
    ...params,
    include: 'store',
    to: 10
  }
  // Membuat query string dari objek params
  const query = new URLSearchParams(params as any).toString();
  return apiClient<PaginatedApiResponse<Product>>(`/products?${query}`);
};

/**
 * Mengambil satu produk berdasarkan slug-nya.
 */
export const getProductBySlug = (slug: string): Promise<Product> => {
  return apiClient<Product>(`/products/${slug}`);
};

/**
 * Mengambil satu produk berdasarkan id-nya.
 */
export const getProductById = (id: string): Promise<{data:Product}> => {
  return apiClient<{data:Product}>(`/products/${id}`);
};