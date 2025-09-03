import { apiClient } from "@/lib/api-client";
import type { Review, PaginatedApiResponse } from "@/types";



export type CreateReviewData = {
  content: string
  order_item_id: string
  rating: number
  media: File[]
};

// Tipe untuk parameter query
export type ReviewQueryParams = {
  productId: string;
  page?: number;
  per_page?: number;
};

/**
 * Mengambil daftar ulasan untuk produk tertentu dengan paginasi.
 */
export const getReviews = ({ productId, page = 1, per_page = 5 }: ReviewQueryParams): Promise<PaginatedApiResponse<Review>> => {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(per_page)
  }).toString();

  // Endpoint contoh: /products/ID_PRODUK/reviews?page=1&limit=5
  return apiClient<PaginatedApiResponse<Review>>(`/products/${productId}/reviews?${query}`);
};

/** Menambah review baru */
export const addReviewByOrderId = (id: string, data: CreateReviewData): Promise<Review> => {
  const formData = new FormData();

  // Menambahkan fields lainnya ke FormData
  formData.append('content', data.content);
  formData.append('order_item_id', data.order_item_id);
  formData.append('rating', data.rating.toString()); // rating as string for form data compatibility

  // Menambahkan media (file) ke FormData
  data.media.forEach((file, index) => {
    formData.append(`media[${index}]`, file); // Use the index to avoid collision
  });
  formData.append("_method", "POST");

  // Mengirimkan request dengan FormData
  return apiClient<Review>(`/customer/orders/${id}/reviews`, {
    method: 'POST',
    body: formData,
  });
};