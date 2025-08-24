import { apiClient } from "@/lib/api-client";
import type { Review, PaginatedApiResponse } from "@/types";

// Tipe untuk parameter query
export type ReviewQueryParams = {
  productId: string;
  page?: number;
  limit?: number;
};

/**
 * Mengambil daftar ulasan untuk produk tertentu dengan paginasi.
 */
export const getReviews = ({ productId, page = 1, limit = 5 }: ReviewQueryParams): Promise<PaginatedApiResponse<Review>> => {
  const query = new URLSearchParams({ 
    page: String(page), 
    limit: String(limit) 
  }).toString();
  
  // Endpoint contoh: /products/ID_PRODUK/reviews?page=1&limit=5
  return apiClient<PaginatedApiResponse<Review>>(`/products/${productId}/reviews?${query}`);
};